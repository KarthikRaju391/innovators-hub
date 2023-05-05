import dynamic from "next/dynamic";

const PDFView = dynamic(
	() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
	{
		ssr: false,
	}
);

const PDFDownloadLink = dynamic(
	() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
	{ ssr: false }
);

import {
	Text,
	Image,
	Page,
	Document,
	StyleSheet,
	View,
} from "@react-pdf/renderer";

let windowHeight = 0;
let windowWidth = 0;

if (typeof window !== "undefined") {
	windowWidth = window.innerWidth / 2;
	windowHeight = window.innerHeight;
}
const styles = StyleSheet.create({
	page: {
		fontFamily: "Helvetica",
		fontSize: 12,
		paddingTop: 50,
		paddingLeft: 60,
		paddingRight: 60,
		paddingBottom: 60,
		textAlign: "justify",
	},
	title: {
		fontSize: 24,
		marginBottom: 20,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 18,
		marginBottom: 10,
		textAlign: "center",
	},
	text: {
		margin: 10,
		fontSize: 12,
		textAlign: "justify",
	},
	bold: {
		fontWeight: "bold",
	},
	italic: {
		fontStyle: "italic",
	},
	underline: {
		textDecoration: "underline",
	},
	list: {
		margin: 10,
		fontSize: 12,
		textAlign: "justify",
	},
	listItem: {
		margin: "5px 0",
	},
	imageContainer: {
		width: "100%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		width: "50%",
		objectFit: "cover",
	},
	section: {
		margin: 10,
		padding: 10,
	},
	viewer: {
		width: windowWidth,
		height: windowHeight,
	},
});

const PDFPreview = ({ values = {} }) => {
	const sections = values.sections || [];

	return (
		<PDFView style={styles.viewer}>
			<Document>
				{sections.map((section, index) => {
					const sectionTitle = section.sectionTitle || "";
					const contentBlocks = section.contentBlocks || [];

					return (
						<Page key={index} style={styles.page}>
							<View style={styles.section}>
								<Text style={styles.title}>{sectionTitle}</Text>
								{contentBlocks.map((block, index) => {
									const contentTitle = block.contentTitle || "";
									const content = block.content || "";

									return (
										<View key={index}>
											<Text style={styles.subtitle}>{contentTitle}</Text>
											{block.image && (
												<View style={styles.imageContainer}>
													{block.image.map((image, index) => (
														<Image
															key={index}
															style={styles.image}
															src={image}
														/>
													))}
												</View>
											)}
											<Text style={styles.text}>{content}</Text>
										</View>
									);
								})}
							</View>
						</Page>
					);
				})}
			</Document>
		</PDFView>
	);
};

export default PDFPreview;
