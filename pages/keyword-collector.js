import Head from 'next/head';
import Link from "next/link"
import Image from 'next/image'

import { useState, useEffect } from 'react';
import { useSession, signIn } from "next-auth/react"

const KeywordCollector = () => {
  const [userInput, setUserInput] = useState('');
  const [keywordOutput, setKeywordOutput] = useState('');
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const { data: session } = useSession()

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  const copyOutput = () => {
    console.log("export? ");
  };

  const goToCheckout = async () => {
    setIsCheckoutLoading(true);

    const res = await fetch(`/api/stripe/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { redirectUrl } = await res.json();

    if (redirectUrl) {
      window.location.assign(redirectUrl);
    } else {
      setIsCheckoutLoading(false);
      console.log("Error creating checkout session");
    }
  };

  const callEndpoint = async () => {
    setIsLoadingKeywords(true);

    const response = await fetch('/api/keywordCollector', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!data) {
      setIsLoadingKeywords(false);
      console.log("Error CALLING API");
    } else {
      const { output, user } = data;

      reloadSession();

      setKeywordOutput(`${data.keywords[0]}`);
      setIsLoadingKeywords(false);
    }
  }

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  return (
    <div>
      <Head>
        <title>NicheButter | Keyword Collector</title>
      </Head>

      <div className="container">
        {keywordOutput? (
          <div className="header-subtitle">
            <h2>Here are your keywords.</h2>
            <Image
              className="copy-button"
              src="/images/copy.svg"
              alt="Copy Icon"
              width="32"
              height="32"
              onClick={copyOutput}
            />
          </div>
        ) : (
          <div className="header-subtitle">
            <h2>Let's collect some keywords.</h2>
          </div>
        )}

        <div>
          { keywordOutput ? (
            <div className="output">
            <textarea
              className="prompt-box-tall"
              value={keywordOutput}
            />
              <div className="header-subtitle">
                <h2>Should we generate some posts?</h2>
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
                {session ? (
                  <div>
                    {session.user.credits >= 100 ? (
                      <div>
                        <a
                          className={isLoadingKeywords ? 'generate-button loading' : 'generate-button'}
                          onClick={callEndpoint}
                        >
                          <div className="generate">
                            {isLoadingKeywords ? <span className="loader"></span> : <p>Submit</p>}
                          </div>
                        </a>
                        <div className="header-subtitle">
                          <h2>-100 Credits</h2>
                        </div>
                      </div>
                    ) : (
                      <a className='generate-button'
                        onClick={() => {
                          if (isCheckoutLoading) return;
                          else goToCheckout();
                        }}
                      >
                        {isCheckoutLoading ? (
                          <div className="generate">
                            <p>Loading...</p>
                          </div>
                        ) : (
                          <div className="generate">
                            <p>GetCredits</p>
                          </div>
                        )}
                      </a>
                    )}
                  </div>
                ) : (
                  <a className='generate-button' onClick={() => signIn()}>SignIn</a>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeywordCollector;
