import type { AppProps } from 'next/app'
 
import "./../../public/assets/css/fonts.css";
import "./../../public/assets/css/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}