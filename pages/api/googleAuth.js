import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";
import { google } from "googleapis";

const googleAuth = async (req, res) => {

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({
      error: true,
      message: "No session detected."
    });
  }

  const clientId = process.env.DISCORD_CLIENT_ID
  const clientSecret = process.env.DISCORD_CLIENT_SECRET
  const accessToken = session?.accessToken
  const refreshToken = session?.refreshToken

  console.log("accessToken: " + accessToken);
  console.log("refreshToken: " + refreshToken);

  if (!accessToken || !refreshToken) {
    return res.status(401).json({
      error: true,
      message: "No access."
    });
  }

  const auth = new google.auth.OAuth2({
    clientId,
    clientSecret,
  });

  console.log("auth: " + JSON.stringify(auth));

  auth.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const searchconsole = google.searchconsole('v1');

  await searchconsole.searchanalytics.query({
    siteUrl: "https://peakrover.com",
    requestBody: {
      startDate: "2023-02-01",
      endDate: "2023-02-10",
    },
  })
  .then(function(response) {
    res.json(response)
  })
  .catch(function(error) {
    let errObject = {
      error: true,
      message: error.errors[0].message || "GSC auth failed."
    }

    res.status(500).json(errObject);
  });

}

export default googleAuth;
