import Head from 'next/head';
import Link from "next/link"

import { useState } from 'react';

const PostGenerator = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...")
    const response = await fetch('/api/generateBlogPost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text)

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  return (
    <div>
      <Head>
        <title>NicheButter | Blog Post Generator</title>
      </Head>

      <div className="container">
        {apiOutput? (
          <div className="header-subtitle">
            <h2>Look, this isn't going to be the greatest content, but it's a strong start...</h2>
          </div>
        ) : (
          <div className="header-subtitle">
            <h2>Write an entire blog post on a given topic.</h2>
          </div>
        )}

        <div>
          {apiOutput? (
            <div className="output">
            <textarea
              className="prompt-box-tall"
              value={apiOutput}
            />
              <div className="header-subtitle">
                <h2>
                  Copy this post and move it to whatever blogging platform you use.
                  These posts will often include incorrect or incomplete information.
                  Spending some time editing, fact checking, filling this content out
                  and making it your own is going to greatly improve your chances of
                  ranking organically.
                </h2>
                <div className="prompt-buttons">
                  <a
                    className='generate-button'
                    href="post-generator"
                  >
                    <div className="generate">
                      <p>Next!</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="prompt-container">
              <textarea
                className="prompt-box"
                placeholder="What's your topic?"
                value={userInput}
                onChange={onUserChangedText}
              />
              <div className="prompt-buttons">
                <a
                  className={isGenerating ? 'generate-button loading' : 'generate-button'}
                  onClick={callEndpoint}
                >
                  <div className="generate">
                    {isGenerating ? <span className="loader"></span> : <p>Submit</p>}
                  </div>
                </a>
              </div>
              </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default PostGenerator;
