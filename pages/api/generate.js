import { Configuration, OpenAIApi } from "openai";

const training = `Friend is a 29 year old woman.
Friend: What have you been up to lately?
You: Oh, you know. Nothing much. I've stopped watching the news because it's just getting too frustrating.
Friend: I know. We're more divided than ever now.\n`;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: training + req.body.prompt,
    temperature: 0.9,
    presence_penalty: 2,
    frequency_penalty: 2,
    max_tokens: 2048,
    stop: ["Human:", "LaMDA:"],
  });

  res.status(200).json({ result: completion.data.choices[0].text });
}
