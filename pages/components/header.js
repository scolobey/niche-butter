import React from "react";
import Image from 'next/image';
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from 'react';
import nicheButterLogo from '../../assets/niche-butter-light.png';

export default function Header() {
  const { data: session, status } = useSession()
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

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

  return (
    <div className="header">
      <div className="header-title">
        <a href="/">
          <Image
            src={nicheButterLogo}
            alt="NicheButter Logo"
            width={275}
            height={187}
          />
        </a>

        <div className="control-panel">
          {status === 'loading' && <div className="auth-button">
            <button>Loading...</button>
          </div>}

          {status === 'unauthenticated' && <div className="auth-button">
            <button onClick={() => signIn()}>SignIn</button>
          </div>}

          {status === 'authenticated' && <div className="signout-button">
            <button onClick={() => signOut()}>
              <div>
                SignOut
              </div>
              <div>
                {session?.user && <Image src={session.user.image} alt="Avatar" width={25} height={25}/>}
              </div>
            </button>

            <div className="credits-report">
              {session?.user && <div>
                Credits
                Remaining:
                <p>{JSON.stringify(session.user.credits)}</p>
                {session?.user.credits == 0 && <div>
                  <a className="buy-button"
                    onClick={() => {
                      if (isCheckoutLoading) return;
                      else goToCheckout();
                    }}
                  >
                  {isCheckoutLoading ? (
                    <p>Loading...</p>
                  ) : (
                    <div>Top Up!</div>
                  )}
                  </a>
                </div>}
              </div>}
            </div>

          </div>}

        </div>
      </div>

      <div className="header-links">
        <hr></hr>
        <a href="/">Home</a>
        <a href="/tools">Tools</a>
        <a href="/blog">Blog</a>
        <a href="/about">About</a>
        <hr></hr>
      </div>

    </div>
  );
}
