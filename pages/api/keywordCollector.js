// import SEO from "seo-keywords";

import { GoogleAdsApi, enums, parse } from "google-ads-api";
import { getSession } from "next-auth/react";

const collectKeywords = async (req, res) => {

  const session = await getSession({ req });

  const accessToken = session?.user.token
  const refreshToken = session?.user.refreshToken


// The caller does nto have permission
  const devToken = "KjJO5xwVWj55IP4t86CxJQ"

  if (!accessToken && !refreshToken) {
    return res.status(401).json({
      error: true,
      message: "No access."
    });
  }

  console.log("the user: " + JSON.stringify(session.user));

  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ID,
    client_secret: process.env.GOOGLE_SECRET,
    developer_token: devToken,
  });

  const customer = client.Customer({
    customer_id: "6895958627",
    refresh_token: refreshToken,
  });

  console.log("let's collect some keywords.");

  const reportOptions = {
    entity: "ad_group_criterion",
    attributes: [
      "ad_group_criterion.keyword.text",
      "ad_group_criterion.status",
    ],
    constraints: {
      "ad_group_criterion.type": enums.CriterionType.KEYWORD,
    },
  };

  const stream = customer.reportStreamRaw(reportOptions);

  // Rows are streamed in 10,000 row chunks
  stream.on("data", (chunk) => {
    const parsedResults = parse({
      results: chunk.results,
      reportOptions,
    });
  });

  stream.on("error", (error) => {
    throw new Error(error);
  });

  stream.on("end", () => {
    console.log("stream has finished");
  });

  // // let serpKey  = process.env.SERPAPI_KEY
  // // let query = "basketball insoles"
  //
  // // (async () => {
  // //
  // //   (async () => {
  // //     console.log(await SEO.getAll("minecraft"));
  // //   })();
  //
  //   // let keywords = await SEO.getAll(query);
  //   // console.log("keywords: " + keywords);
  //   // res.status(200).json({ keywords: ["buckets", "snakes"] });
  // })();
};

export default collectKeywords;
