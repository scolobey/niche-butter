import Head from 'next/head';
import Link from "next/link"
import Image from 'next/image'

import { useState } from 'react';
import { useSession, signIn } from "next-auth/react"

const ClusterGenerator = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const { data: session } = useSession()

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  const copyOutput = () => {
    console.log("copying: " + apiOutput);
    navigator.clipboard.writeText(apiOutput)
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
    setIsGenerating(true);

    const response = await fetch('/api/generateTopicCluster', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput, session }),
    });

    const data = await response.json();
    const { output, user } = data;

    reloadSession();

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
            <Image
              src="/images/copy.svg"
              alt="Copy Icon"
              width="32"
              height="32"
              onClick={copyOutput}
            />
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
                {session ? (
                  <div>
                    {session.user.credits >= 100 ? (
                      <div>
                        <a
                          className={isGenerating ? 'generate-button loading' : 'generate-button'}
                          onClick={callEndpoint}
                        >
                          <div className="generate">
                            {isGenerating ? <span className="loader"></span> : <p>Submit</p>}
                          </div>
                        </a>
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

export default ClusterGenerator;
