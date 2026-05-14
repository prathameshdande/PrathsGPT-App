import imageKit from "../configs/imageKit.js";
import openai from "../configs/openai.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import axios from "axios";
// import { encode, decode } from "base-64";

// text-based ai chat controller
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    //checking credits
    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message:
          "You don't have enough credits to use this feature. Please buy more credits.",
      });
    }
    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    chat.messages.push({
      role: "user",
      text: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const { choices } = await openai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {
      ...choices[0].message,
      timestamp: Date.now(),
      isImage: false,
    };

    res.json({
      success: true,
      reply,
    });

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne(
      { _id: userId },
      {
        $inc: {
          credits: -1,
        },
      },
    );

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//image generation controller
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    //checking credits
    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message:
          "You don't have enough credits to use this feature. Please buy more credits.",
      });
    }

    const { chatId, prompt, isPublished } = req.body;
    //finding a chat from this code line
    const chat = await Chat.findOne({ userId, _id: chatId });
    //pushing messages to the chat
    chat.messages.push({
      role: "user",
      text: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    //encode the prompt
    const encodedPrompt = encodeURIComponent(prompt);
    //generate image from the prompt using imagekit
    const generateImageURL = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/prathsgpt/${Date.now()}.png?tr=w-800,h-800`;

    //trigger generation by fetching from imagekit

    const aiImageResponse = await axios.get(generateImageURL, {
      responseType: "arrayBuffer",
    });

    //convert to Base64
    const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString("base64")}`;

    //upload the image to imagekit
    const uploadResponse = await imageKit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "prathsgpt",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    res.json({
      success: true,
      reply,
    });

    //this line deduct two credit from the user for image generation
    await User.updateOne(
      { _id: userId },
      {
        $inc: {
          credits: -2,
        },
      },
    );

    //this line stores an data into the db
    chat.messages.push(reply);
    await chat.save();
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
