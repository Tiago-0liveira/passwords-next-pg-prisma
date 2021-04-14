import { AppProps } from 'next/app';
import "../styles/styles.css"
import 'react-notifications/lib/notifications.css';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return <Component {...pageProps} />
}