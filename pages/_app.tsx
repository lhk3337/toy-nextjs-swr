import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then((response) => response.json()),
      }}
    >
      <div className="w-full max-w-3xl mx-auto my-12">
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}
