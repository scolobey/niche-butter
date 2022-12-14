import { Configuration, OpenAIApi } from 'openai';
import prisma from "../../prisma/prismadb"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const getCompetitors = async (req, res) => {
  const basePrompt = `Make a list of niche blogs that talk about ${req.body.userInput}. List them by their domain names.`;

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePrompt}`,
    temperature: 0.7,
    max_tokens: 100,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  const prismaUser = await prisma.user.update({
    where: { id: req.body.session.user.id },
    data: {
      credits: req.body.session.user.credits-100
    },
  });

  res.status(200).json({ output: basePromptOutput, user: prismaUser });
};

export default getCompetitors;
