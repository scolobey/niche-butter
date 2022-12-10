import Head from 'next/head';
import Link from "next/link"

import { useState } from 'react';

const TopicSelector = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...")

    const response = await fetch('/api/selectTopic', {
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
        <title>NicheButter | Topic Selector</title>
      </Head>
      <div className="container">
        {apiOutput? (
          <div className="header-subtitle">
            <h2>And here's your recommended topic...</h2>
          </div>
        ) :(
          <div className="header-subtitle">
            <h2>First we need to pick a topic. Make a list of things you're interested in. Then scroll down and click submit.</h2>
          </div>
        )}

        <div>
          {apiOutput? (
            <div className="output">
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
              <div className="header-subtitle">
                <h2>Now let's generate some associated topic clusters.</h2>
                <div className="prompt-buttons">
                  <a
                    className='generate-button'
                    href="cluster-generator"
                  >
                    <div className="generate">
                      <p>OK!</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="prompt-container">
              <textarea
                className="prompt-box-tall"
                placeholder="Enter 8 or more of your favorite topics..."
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

export default TopicSelector;
