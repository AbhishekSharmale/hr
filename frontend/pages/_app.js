import { CompanyProvider } from '../context/CompanyContext';

export default function App({ Component, pageProps }) {
  return (
    <CompanyProvider>
      <Component {...pageProps} />
    </CompanyProvider>
  );
}