import Head from 'next/head';
import Link from "next/link"

import { useState } from 'react';

const CompetitionAnalyzer = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...")
    const response = await fetch('/api/getCompetitors', {
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
        <title>NicheButter | Competition Analyzer</title>
      </Head>

      <div className="container">
        {apiOutput? (
          <div className="header-subtitle">
            <h2>Some possible competitors in your niche. Not all of these site exist. The ones that do, study their content. Make yours better. Reach out for guest posts. The ones that don't exist, think about using the domain name yourself.</h2>
          </div>
        ) : (
          <div className="header-subtitle">
            <h2>Collect a list of competitors in your niche.</h2>
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
                <div className="prompt-buttons">
                  <a
                    className='generate-button'
                    href="/"
                  >
                    <div className="generate">
                      <p>Home!</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="prompt-container">
              <textarea
                className="prompt-box"
                placeholder="What's your niche topic?"
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

export default CompetitionAnalyzer;
