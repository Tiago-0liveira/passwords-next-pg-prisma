import { AppProps } from 'next/app';
import "../styles/styles.scss"

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return <Component {...pageProps} />
}