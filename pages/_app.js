import { ThemeProvider } from 'next-themes'
import './styles.css';
import Head from 'next/head';
import Link from "next/link"
import Image from 'next/image'
import nicheButterLogo from '../assets/niche-butter-dark.png';
import { useTheme } from 'next-themes'

function App({ Component, pageProps }) {

  return <div className="root">
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href="/public/apple-touch-icon.png"></link>
      <link rel="icon" type="image/png" sizes="32x32" href="/public/favicon-32x32.png"></link>
      <link rel="icon" type="image/png" sizes="16x16" href="/public/favicon-16x16.png"></link>
      <link rel="shortcut icon" href="/favicon.ico"></link>
      <link rel="manifest" href="/public/site.webmanifest"></link>
    </Head>
    <div className="container">
      <div className="header">
        <div className="header-title">
        <a href="/">
          <Image
            src={nicheButterLogo}
            alt="NicheButter logo"
            width={275}
            height={187}
          />
        </a>

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
      <Component {...pageProps} />
    </div>
  </div>
}
export default App;
