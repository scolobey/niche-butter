import Head from 'next/head';
import Link from "next/link"

import { useState } from 'react';

const ClusterGenerator = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...")

    const response = await fetch('/api/generateTopicCluster', {
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
        <title>NicheButter | Keyword Cluster Generator</title>
      </Head>

      <div className="container">
        {apiOutput? (
          <div className="header-subtitle">
            <h2>Here are your topic clusters.</h2>
          </div>
        ) :(
          <div className="header-subtitle">
            <h2>Now let's make a list of topics to cover. We'll group our topics under 3 parent clusters.</h2>
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
                <h2>Copy these and paste them somewhere safe. One by one, we'll go ahead and generate a nice article about each one.</h2>
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

export default ClusterGenerator;
