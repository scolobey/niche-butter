import { Configuration, OpenAIApi } from 'openai';
import prisma from "../../prisma/prismadb"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateBlogIntroduction = async (req, res) => {
  const basePrompt =
  `
  From the perspective of a well-informed amateur, and in a relaxed but direct style, write an engaging introduction for a blog post about ${req.body.userInput}.
  Clarify the purpose of the article and demonstrate an understanding of the problem the reader is trying to solve.
  `

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePrompt}`,
    temperature: 0.7,
    max_tokens: 500,
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

export default generateBlogIntroduction;
