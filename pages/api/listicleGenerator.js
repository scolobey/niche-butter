import { Configuration, OpenAIApi } from 'openai';
import prisma from "../../prisma/prismadb"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = "List every ";

const generateListicle = async (req, res) => {

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 700,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  // I build Prompt #2.
  const secondPrompt =
  `
  For each item in the following list of ${req.body.userInput}, generate a detailed description. Cover unique features and anything else relevant to the topic

  List:
  ${basePromptOutput.text}
  `

  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.85,
		// I also increase max_tokens.
    max_tokens: 2000,
  });

  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  const prismaUser = await prisma.user.update({
    where: { id: req.body.session.user.id },
    data: {
      credits: req.body.session.user.credits-300
    },
  });

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput, user: prismaUser });
};

export default generateListicle;
