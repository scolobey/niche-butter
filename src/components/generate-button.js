import React from "react";
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from 'react';

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
    <a
      className={isGenerating ? 'generate-button loading' : 'generate-button'}
      onClick={callEndpoint}
    >
      <div className="generate">
        {isGenerating ? (<span className="loader"></span>) : (<p>Submit</p>)}
      </div>
    </a>
  );
}
