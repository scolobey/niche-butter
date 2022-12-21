---
title: 'How to Use GPT-3 in Google Sheets'
description: 'This post will show you how to incorporate GPT-3 into Google Sheets to supercharge your niche blogging workflows.'
date: '2022-12-02'
---

If you're not integrating AI into your basic work tasks, you're simply throwing away time. And we all know time is precious. One of the easiest ways to start pulling artificially generated data and content into your work pipeline is to start using OpenAi API calls to add GPT-3 data to your Google Sheets.  

I've found this technique incredibly helpful in developing my niche blogging content pipeline. In fact, that's what this site is all about. You can checkout the [homepage](www.nichebutter.com) right now and start using AI to guide your content planning.

GPT-3 can quickly and easily generate all kinds of information, from customized data visualizations, predictions, and insights to straight up blog posts. But you're probably interested in the nuts and bolts, so let's get you going as quickly as possible on using GPT-3 in your Google Sheets.

#How to Add an OpenAi API call to a Google Sheets Cell

## 1. Get your OpenAI API key [here](https://beta.openai.com/signup).

OpenAI is the artificial intelligence company that developed the GPT-3 language model. They offer access to this model via applications such as ChatGPT. But they also let you develop your own systems via their API, which is pretty easy to access. You do need to pay to use the API, but signing up for an OpenAI account gets you a ton of starter credits to play with.

So, signup and get yourself all logged in. Then, click your account icon in the upper right corner. In the menu that pops up, choose 'View API keys'.

You'll see a button that says 'Create new secret key'. Click that button and click the little green button in the resulting popup to copy your key to your clipboard. Paste it somewhere safe. You won't be able to see it again. If anyone gets ahold of your key, they can use it to make calls to the API at your expense.

## 2. Add your OpenAI API script to Google Sheets

Now head on over to [this Link](https://docs.google.com/spreadsheets/d/1XW_2up-pCZOJSVZaCv2QWbBFG47b7HNmjBznOjBsbN8/edit#gid=0).

That's a Google Sheet that was built by Harish Garg over at [HarishGarg.com](https://harishgarg.com/). [His Post](https://harishgarg.com/writing/using-gpt-3-in-google-sheets/) is also very good on this topic. We're going to use his script to power our API calls. Thanks Harish!

Now, you can follow the directions in that Sheet if you like, but I want to show you how to extract that script and place it in your own sheets so that you can use it to fuel your Niche Blogging workflows.

First, open up your own Google Sheet, one where you want to start importing AI-generated data. Click Extensions > Apps Script on the top menu. Delete everything in the editor that pops up and paste in the following code. Get your secret key and paste it between the quotes on that first line.

### The Code

```
const OPENAI_API_KEY = "";
// ^ PASTE YOUR SECRET KEY HERE ^
const OPENAI_API_URL = "https://api.openai.com/v1/completions";

/**
 * Submits a prompt to GPT-3 and returns the completion
 */
function INTRO(
  input,
  temperature = 0.7,
  model = "text-davinci-003",
  maxTokens = 456
) {

  prompt = `In the style of Anthony Bourdain, write a description of ${input}, the character from the DC universe. Mention the characters first appearance and several notable appearances.`;

  var data = {
    prompt: prompt,
    temperature: temperature,
    model: model,
    max_tokens: maxTokens,
  };

  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data),
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
  };

  console.log("sending req: " + options.payload);

  var response = UrlFetchApp.fetch(
    OPENAI_API_URL,
    options
  );

  console.log("resp received");

  return JSON.parse(response.getContentText()).choices[0].text.trim();
}
```

## Setup your Cloud Project

Once you've pasted your API key into the right spot, click that blue 'deploy' button at the upper right. Then click New Deployment. You probably have no deployments, so I'll walk you through that. If you do have deployments, you probably already know what you're doing ;). You can skip ahead to the next heading.

This is the annoying part. Google's documentation is remarkably bad. And the cloud project dashboards are horrendously confusing. It's almost as though they paid technical writers by the word or something. You know things are really really bad when the hardest part of a programming tutorial is explaining how to navigate a bad dashboard UI.

At any rate, take a look at [this link](https://console.cloud.google.com/cloud-resource-manager). That should be a list of your cloud resources. If not, you probably have to login.

Pick an existing project or add a new one. A new project can take a little bit to fire up. But once you've clicked on the project you want to use, make sure that you have the proper permissions. If you're the owner, you should see something like this.

![Permissions](/images/Owner.png "Permissions")

If you're not the owner, you need to make sure you at least have 'Project Browser' and 'OAuth Config Editor' roles. You can add a role by clicking 'Add Principal' and using the dropdown in the 'Assign Roles' section to filter for those 2 roles. If you're the owner, don't even worry about it, you've inherited those roles already as part of your vaunted 'Owner' status.

Now, your project name should have the 3 vertical dots to the right of it in the projects list. Click that and select settings.
- Copy the 'Project Number'.
- Return to the Apps Script editor where you pasted all of that code.
- Click on the sprocket thing again, this time it will be on the left side of the script editor.
- Scroll down to the button labeled 'Change project'. It's got some blue text, so it should be easy to spot. Click that.
- You should now see a field. Paste in the project number. Click 'set project'.

# Deploy

You should now, finally, be able to deploy your own project on your own account. Thanks for making things complicated Big-G.

- Click that blue 'deploy' button at the upper right. Then click New Deployment
- Click the settings icon. You know, the little sprocket thingy. Then, click 'Add-On'.
- Click 'Deploy'. Give your add-on a cool name.
- Click 'Deploy'. It's great how all of these new buttons have the same label, huh?

You should finally be able to use your app though. Except...
You may need to setup permissions for your Google Cloud Project.
So, on the apps script page, click 'run'.
If Google tells you that you're not authorized to run your app, setup permissions.
If you authorize your account and there are no warnings. You are good to skip to this next section.

# Setup Permissions

Go back to the [Google Cloud Project Manager](https://console.cloud.google.com/cloud-resource-manager).
- Click the menu button at top left.
- Click OAuth consent screen.
- Make sure that your app is set to 'Testing'. There should be a button that says 'PUBLISH APP' under the 'Testing' heading. If not, send it back to testing.
- Scroll down to the 'Test Users' heading and add your account email as a test user.

# Run the APP

Whisper to yourself a quiet coding incantation, for now, should it favor the JavaScript Gods, you are but moments from the sweet flavor of victory.

Click on a cell in your Google Sheet. In the formula field for the cell, input the following:
`=INTRO("Batman")`
Then click Enter.

You should see a little loading signal. But after a brief wait, your cell should get filled up with a nice little blurb about the Dark Knight. Pretty sweet.

#Generating New Prompts.

Okay, so you got GPT-3 to tell you about batman. Great! What else can it do?

Well, you need to structure some prompts in order to get GPT-3 to deliver the output you're looking for. There's a line in your app script that looks like this:

`prompt = `In the style of Anthony Bourdain, write a description of ${input}, the character from the DC universe. Mention the characters first appearance and several notable appearances.`;`

You can edit this to ask GPT-3 the questions that you want answered. The `${input}` part references whatever you put into the prompt. In our example above, we just fed the word "Batman" into the prompt. But you can also use the contents of a cell in your sheet, and just drag the function to apply down a column in the same way you would with other GSheets functions.

For example, let's say you have a list of topics for blog posts that you want to write. You can create a prompt that loos something like this...

`prompt = `In the style of Ernest Hemmingway, write an introduction to a blog post about ${input}.`;`

Then, apply your script to a cell alongside the top of your list, and replace the input with the cell containing your first topic. Something like this maybe?

`=INTRO(A2)`

Let it populate, then click the corner and drag it down to the bottom of the list to apply the script to all of your topics. Pretty quickly, you should have a full list of introductions for all of your posts. Noice!

If your list is too long, you might get some errors. This is just because your OpenAI account has some limits so that you can't just suck it dry all day. Give it a rest for a bit, then just delete the contents of the error cell and drag a a working cell over it again to repeat the action. If you get nothing but errors, there's something else going wrong and all I can say is good luck.

You can try different prompts. Maybe try getting GPT-3 to lay out your article outlines, or write a few engaging titles. You can practice your prompts until you find what you're looking for. Check the OpenAI Playground [here](https://beta.openai.com/playground) to practice. Enter different questions and structures into the prompt and see what you get back.

Now, don't expect this thing to pump out perfectly crafted and researched content. You need to read and review all of this before you try publishing. First of all, Google has openly stated its desire to mitigate the spread of AI-generated content. So pumping this directly into your blog is not a great idea.

But this is a helpful way to structure your content production. You can spend an afternoon and 20$ worth of API credits building out your content plan for the month. Then, the rest of the month is just editing, cleaning it all up, adding images, working on your interlinking, etc. Googles bread and butter is finding good content and kicking out bad content. Don't use AI to make bad content. Use it to structure content that you inject with your own flare, research and unique perspective, and you should be alright.
