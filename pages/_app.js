import { ThemeProvider } from 'next-themes'
import './styles.css';
import Head from 'next/head';
import Script from "next/script"
import { useTheme } from 'next-themes'
import { SessionProvider } from "next-auth/react"
import Header from "./components/header.js";
import Alert from "./components/alert.js";

function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return <SessionProvider session={session}>
    <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"/>
    <Script async src="https://www.googletagmanager.com/gtag/js?id=G-06XXTYDPPJ"></Script>
    <Script
     id='google-analytics'
     strategy="afterInteractive"
     dangerouslySetInnerHTML={{
      __html: `
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'G-06XXTYDPPJ', {
        page_path: window.location.pathname,
       });
      `,
      }}
    />
    <div className="root">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/public/apple-touch-icon.png"></link>
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"/>
        <link rel="shortcut icon" href="/favicon.ico"></link>
        <link rel="manifest" href="/site.webmanifest"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Head>
      <div className="container">
        <Alert />
        <Header />
        <Component {...pageProps} />
      </div>
    </div>
  </SessionProvider>
}

export default App;
