import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";
import { google } from "googleapis";

const secret = process.env.SECRET;

const siteList = async (req, res) => {

  console.log("calling for queries: " + req);

  const { property } = req.query

  console.log("property: " + property);

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

  let today = new Date();
  let todayString = today.toISOString().split('T')[0]
  let threeMonthsAgo = new Date(today.getMonth() - 3);
  let threeMonthsAgoString = threeMonthsAgo.toISOString().split('T')[0];

  console.log(todayString + " : " + threeMonthsAgoString);

  await searchconsole.searchanalytics.query({
    siteUrl: property,
    requestBody: {
      startDate: "2023-02-01",
      endDate: "2023-02-10",
      dimensions: ["query"]
    },
  })
  .then(function(response) {
    console.log("queries response " + JSON.stringify(response));
    res.json(response)
  })
  .catch(function(error) {
    console.log("queries error response " + JSON.stringify(error));

    let errorMsg = "Query collection failed."

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
