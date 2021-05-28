import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <div>
      <Head>
        <script src="https://kit.fontawesome.com/476c89e3e9.js" crossOrigin="anonymous"></script>
      </Head>
      <SWRConfig
        value={{
          fetcher: (url: string): unknown => fetch(url).then((response) => response.json()),
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}

export default MyApp;
