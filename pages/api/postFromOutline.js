import { Configuration, OpenAIApi } from 'openai';
import prisma from "../../prisma/prismadb"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const postFromOutline = async (req, res) => {

  const basePromptPrefix =
  `
  Take the table of contents below and generate a blog post written in the style of Tim Ferriss. Don't just list the points. Go deep into each one. Make it feel like a story. Explain why.

  Table of Contents: ${req.body.userInput}

  Blog Post:
  `
  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.80,
    max_tokens: 1500,
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

export default postFromOutline;
