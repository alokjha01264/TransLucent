const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { OpenAI } = require("openai");
const cors = require("cors")({ origin: true });

// Define the secret
const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");

// Cloud Function to handle chatbot requests
exports.chatWithBot = onRequest(
  { secrets: [OPENAI_API_KEY] },
  async (req, res) => {
    cors(req, res, async () => {
      if (req.method !== "POST") {
        return res.status(405).send({ error: "Method Not Allowed" });
      }

      const { message } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).send({ error: "Invalid or missing message" });
      }

      try {
        const openai = new OpenAI({
          apiKey: OPENAI_API_KEY.value(),
        });

        const chatResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
        });

        const reply = chatResponse.choices?.[0]?.message?.content;

        if (!reply) {
          throw new Error("Empty reply from OpenAI");
        }

        res.status(200).json({ reply });
      } catch (error) {
        console.error("OpenAI API Error:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });
  }
);
