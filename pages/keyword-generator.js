import Head from 'next/head';
import Link from "next/link"

import { useState } from 'react';

const KeywordGenerator = () => {

  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...")
    const response = await fetch('/api/generate', {
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
        <title>NicheButter | Home</title>
      </Head>
      <div className="container">
          <div className="header-links">
            <a href="">Home</a>
            <a href="keyword-generator">Keyword Generator</a>
            <a href="">Post Generator</a>
            <a href="">Blog</a>
            <Link href="/about">
              About
            </Link>
          </div>

          <div className="prompt-container">
            <textarea
              className="prompt-box"
              placeholder="enter your niche topic"
              value={userInput}
              onChange={onUserChangedText}
            />
            <div className="prompt-buttons">
              <a
                className={isGenerating ? 'generate-button loading' : 'generate-button'}
                onClick={callGenerateEndpoint}
              >
                <div className="generate">
                {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
                </div>
              </a>
            </div>
            {apiOutput && (
              <div className="output">
                <div className="output-header-container">
                  <div className="output-header">
                    <h3>Output</h3>
                  </div>
                </div>
                <div className="output-content">
                  <p>{apiOutput}</p>
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default KeywordGenerator;
