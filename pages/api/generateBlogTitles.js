import { Configuration, OpenAIApi } from 'openai';
import prisma from "../../prisma/prismadb"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = "Give me a list of 5 amazing headlines for an article serving the following search keywords: ";

const generateBlogTitles = async (req, res) => {

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 700,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  const prismaUser = await prisma.user.update({
    where: { id: req.body.session.user.id },
    data: {
      credits: req.body.session.user.credits-100
    },
  });

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: basePromptOutput, user: prismaUser });
};

export default generateBlogTitles;
