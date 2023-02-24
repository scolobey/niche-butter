import Head from 'next/head';

import { alertService } from './services/alert.service.js';
import { useState } from 'react';
import { useSession, signIn } from "next-auth/react"

const GoogleAuth = () => {
  const [options, setOptions] = useState({
    autoClose: true,
    keepAfterRouteChange: false
  });

  const [googleData, setGoogleData] = useState({});

  const { data: session } = useSession()

  const authorizeGoogle = async () => {

    const response = await fetch('/api/googleAuth', { method: 'POST' });

    const data = await response.json();

    console.log("thing: " + JSON.stringify(data));

    if (data.error) {
      alertService.success(data.message, options)
    } else {
      setGoogleData(data)
    }
  };

  return (
    <div>
      <Head>
        <title>NicheButter </title>
      </Head>

      <div className="text-content">

        {session ? (
          <a className='generate-button' onClick={() =>  authorizeGoogle()}>Connect Google Search Console</a>
        ) : (
          <a className='generate-button' onClick={() => signIn()}>SignIn</a>
        )}

      </div>
    </div>
  );
};

export default GoogleAuth;
