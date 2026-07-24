import imageKit from "../configs/imageKit.js";
import openai from "../configs/openai.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import axios from "axios";

// text-based ai chat controller
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // checking credits
    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message:
          "You don't have enough credits to use this feature. Please buy more credits.",
      });
    }

    const { chatId, prompt } = req.body;

    if (!chatId || !prompt?.trim()) {
      return res.json({
        success: false,
        message: "chatId and prompt are required",
      });
    }

    const chat = await Chat.findOne({ userId, _id: chatId });

    if (!chat) {
      return res.json({ success: false, message: "Chat not found" });
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImages: false,
    });

    const { choices } = await openai.chat.completions.create({
      model:"gemini-3.5-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {
      role: "assistant",
      content: choices[0].message.content,
      timestamp: Date.now(),
      isImages: false,
    };

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

    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// image generation controller
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    // checking credits
    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message:
          "You don't have enough credits to use this feature. Please buy more credits.",
      });
    }

    const { chatId, prompt, isPublished } = req.body;

    if (!chatId || !prompt?.trim()) {
      return res.json({
        success: false,
        message: "chatId and prompt are required",
      });
    }

    // finding the chat
    const chat = await Chat.findOne({ userId, _id: chatId });

    if (!chat) {
      return res.json({ success: false, message: "Chat not found" });
    }

    // pushing the user's prompt to the chat
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImages: false,
    });

    // encode the prompt
    const encodedPrompt = encodeURIComponent(prompt);
    // generate image from the prompt using imagekit
    const generateImageURL = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/prathsgpt/${Date.now()}.png?tr=w-800,h-800`;

    // trigger generation by fetching from imagekit
    const aiImageResponse = await axios.get(generateImageURL, {
      responseType: "arraybuffer",
    });

    // convert to Base64
    const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString("base64")}`;

    // upload the image to imagekit
    const uploadResponse = await imageKit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "prathsgpt",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImages: true,
      isPublished: !!isPublished,
    };

    chat.messages.push(reply);
    await chat.save();

    // deduct two credits from the user for image generation
    await User.updateOne(
      { _id: userId },
      {
        $inc: {
          credits: -2,
        },
      },
    );

    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// public controller for community/published images
export const getPublishedImages = async (req, res) => {
  try {
    const chats = await Chat.find({ "messages.isPublished": true });

    const images = chats.flatMap((chat) =>
      chat.messages
        .filter((message) => message.isImages && message.isPublished)
        .map((message) => ({
          imageUrl: message.content,
          userName: chat.userName,
        })),
    );

    res.json({
      success: true,
      images: images.reverse(),
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
