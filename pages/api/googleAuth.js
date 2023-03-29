import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";
import { getToken } from 'next-auth/jwt';
import { google } from "googleapis";

const secret = process.env.SECRET;

const googleAuth = async (req, res) => {

  // const token = await getToken({ req, secret });
  // console.log("also have this with" + JSON.stringify(token));
  // // let accessToken = token.accessToken;

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({
      error: true,
      message: "No session detected."
    });
  }

  const clientId = process.env.GOOGLE_ID
  const clientSecret = process.env.GOOGLE_SECRET
  const accessToken = session?.user.token
  const refreshToken = session?.user.refreshToken

  if (!accessToken && !refreshToken) {
    return res.status(401).json({
      error: true,
      message: "No access."
    });
  }

  const auth = new google.auth.OAuth2({
    clientId,
    clientSecret,
  });

  console.log("accessToken: " + accessToken);
  console.log("refreshToken: " + refreshToken);

  //
  // (async () => {
  //   const params = {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Access-Control-Allow-Origin': '*',
  //       'Authorization': 'Bearer ' + accessToken
  //     }
  //   };
  //   try {
  //     const response = await got('GET https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fpeakrover.com', params);
  //     console.log('***** RESPONSE WORKED:', response.body);
  //   } catch (error) {
  //     console.log('***** RESPONSE FAILED:', JSON.stringify(error));
  //   }
  // })();

  auth.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  });

  const searchconsole = google.searchconsole({version: 'v1', auth: auth});

  await searchconsole.searchanalytics.query({
    siteUrl: "https://peakrover.com",
    requestBody: {
      startDate: "2023-02-01",
      endDate: "2023-02-10",
      dimensions: ["query"]
    },
  })
  .then(function(response) {
    console.log("a response " + JSON.stringify(response));
    res.json(response)
  })
  .catch(function(error) {
    console.log("a response " + error.response.config.body.refresh_token);
    let errObject = {
      error: true,
      message: error.errors[0].message || "GSC auth failed."
    }

    res.status(500).json(errObject);
  });

}

export default googleAuth;
