import { Configuration, OpenAIApi } from 'openai';
import prisma from "../../prisma/prismadb"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateBlogTitles = async (req, res) => {
  const basePrompt =
  `
  Give me a list of 5 amazing titles for a blog post serving the given keyword. The exact keyword should appear near the beginning of the title. The title should not be more than 60 characters long.

  keyword: ${req.body.userInput}
  `

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePrompt}`,
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
