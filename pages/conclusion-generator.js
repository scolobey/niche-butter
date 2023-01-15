import Head from 'next/head';
import Link from "next/link"

import { useState } from 'react';
import { useSession, signIn } from "next-auth/react"

const ConclusionGenerator = () => {

  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const { data: session } = useSession()

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
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

    const response = await fetch('/api/conclusionGenerator', {
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
        <title>NicheButter | AI Blog Conclusion Generator</title>
        <meta name="description" content="Generate blog conclusions with the help of ChatGPT."/>
      </Head>

      <div className="container">
        {apiOutput? (
          <div className="header-subtitle">
            <h2>And here's your conclusion...</h2>
          </div>
        ) :(
          <div className="header-subtitle">
            <h2>Enter a topic and we'll write you a conclusion for your blog post.</h2>
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
                <h2>You can also get a full outline for your article if you like</h2>
                <div className="prompt-buttons">
                  <a
                    className='generate-button'
                    href="outline-generator"
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
                className="prompt-box"
                placeholder="Enter your article topic."
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

export default ConclusionGenerator;
