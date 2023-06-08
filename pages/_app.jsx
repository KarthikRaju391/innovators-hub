import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { styletron } from "../styletron";
import { Provider as StyletronProvider } from "styletron-react";
import { DarkTheme, LightTheme, BaseProvider } from "baseui";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import SubmitContext from "../context/SubmitContext";
import { initialValues } from "../InitialValues";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	const [role, setRole] = useState(["USER"]);
	const [updated, setUpdated] = useState(false);
	const [project, setProject] = useState({
		projectName: "",
		projectDescription: "",
		projectImages: [],
		projectReport: [],
	});

	const updateProject = (updatedFields) => {
		setProject((prevState) => ({ ...prevState, ...updatedFields }));
	};

	const [theme, setTheme] = useState();
	const router = useRouter();

	useEffect(() => {
		function handleLocalStorage() {
			var currentTheme = JSON.parse(localStorage.getItem("theme"));
			if (currentTheme === null || currentTheme === undefined) {
				localStorage.setItem("theme", JSON.stringify(1));
			}
			if (currentTheme === 1) {
				setTheme(1);
			} else if (currentTheme === 0) {
				setTheme(0);
			}
		}
		handleLocalStorage();
	});

	var path = router.pathname;
	const pag = ["/", "/login", "/verify", "/contact us"];

	useEffect(() => {
		pag.includes(path)
			? document.body.classList.add("opback")
			: document.body.classList.remove("opback");
	}, [path]);

	useEffect(() => {
		if (theme === 0) {
			document.body.classList.remove("insideLight");
			document.body.classList.add("insideBlack");
		} else {
			document.body.classList.remove("insideBlack");
			document.body.classList.add("insideLight");
		}
	}, [theme]);

	return (
		<>
			<Head>
				<link
					rel="stylesheet"
					href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
					integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
					crossorigin=""
				/>
				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
				/>
				<title>Innovators' Hub</title>
			</Head>
			<SessionProvider session={session}>
				<StyletronProvider value={styletron}>
					<BaseProvider theme={theme === 1 ? LightTheme : DarkTheme}>
						<SubmitContext.Provider
							value={{ updated, project, setUpdated, updateProject }}
						>
							<Component {...pageProps} />
						</SubmitContext.Provider>
					</BaseProvider>
				</StyletronProvider>
			</SessionProvider>
		</>
	);
}

export default MyApp;
