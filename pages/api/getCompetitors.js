import { Configuration, OpenAIApi } from 'openai';

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
    max_tokens: 1500,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: basePromptOutput });
};

export default getCompetitors;
