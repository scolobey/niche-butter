import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta property="og:title" content="Niche Butter Blogging Assistant" key="title"/>
        <meta property="og:description" content="AI powered keyword and niche blogging planner." key="description"/>
        <meta property="og:image" content="/images/niche-butter-banner.jpg"/>
        <meta name="twitter:image" content="/images/niche-butter-banner.jpg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
