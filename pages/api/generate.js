import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: req.body.prompt,
    temperature: 0.6,
    presence_penalty: 0,
    frequency_penalty: 0.5,
    max_tokens: 125,
    stop: ["Human:", "AI:"],
  });

  res.status(200).json({ result: completion.data.choices[0].text });
}
