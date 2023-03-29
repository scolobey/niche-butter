import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";
import { google } from "googleapis";

const secret = process.env.SECRET;

const siteList = async (req, res) => {

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({
      error: true,
      message: "No session detected."
    });
  }

  const clientId = process.env.DISCORD_CLIENT_ID
  const clientSecret = process.env.DISCORD_CLIENT_SECRET
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

  auth.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  });

  const searchconsole = google.searchconsole({version: 'v1', auth: auth});

  await searchconsole.sites.list()
  .then(function(response) {
    console.log("a response " + JSON.stringify(response));
    res.json(response)
  })
  .catch(function(error) {
    console.log("error response " + JSON.stringify(error));

    let errorMsg = "listing sites failed."

    if (error.errors && error.errors[0].message) {
      error.errors[0].message
    }

    let errObject = {
      error: true,
      message: errorMsg
    }

    res.status(500).json(errObject);
  });
}

export default siteList;
