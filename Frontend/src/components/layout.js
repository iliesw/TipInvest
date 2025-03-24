import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>Tips Invest</title>
      </Head>
      {children}
    </div>
  );
}
