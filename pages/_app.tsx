import "../styles/globals.css";
import "../styles/markdown.css";
import Head from "next/head";

function MyApp({ Component, pageProps }: any) {
	return (
		<>
			<Head>
				<title>Innovators' Hub</title>
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
