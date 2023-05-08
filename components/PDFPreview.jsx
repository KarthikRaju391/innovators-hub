import dynamic from "next/dynamic";

const PDFView = dynamic(
	() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
	{
		ssr: false,
	}
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
		width: "80%",
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

const PDFPreview = ({ data = {} }) => {
	return (
		<PDFView style={styles.viewer}>
			<Document>
				<Page size="A4" style={styles.page}>
					<View style={styles.section}>
						<Text style={styles.title}>Executive Summary</Text>
						<Text style={styles.subtitle}>Problem</Text>
						<Text style={styles.text}>{data.problem}</Text>
						<Text style={styles.subtitle}>Solution</Text>
						<Text style={styles.text}>{data.solution}</Text>
						<Text style={styles.subtitle}>Target Market</Text>
						<Text style={styles.text}>{data.targetMarket}</Text>
						<Text style={styles.subtitle}>Competitive Advantage</Text>
						<Text style={styles.text}>{data.competitiveAdvantage}</Text>
						<Text style={styles.subtitle}>Financial Highlights</Text>
						<Text style={styles.text}>{data.financialHighlights}</Text>
						<Text style={styles.subtitle}>Funding Requirements</Text>
						<Text style={styles.text}>{data.fundingRequirements}</Text>
						<Text style={styles.subtitle}>Use of Funds</Text>
						<Text style={styles.text}>{data.useOfFunds}</Text>
						<Text style={styles.subtitle}>Exit Strategy</Text>
						<Text style={styles.text}>{data.exitStrategy}</Text>
					</View>
					<View style={styles.section}>
						<Text style={styles.title}>Company Overview</Text>
						<Text style={styles.subtitle}>Company Name</Text>
						<Text style={styles.text}>{data.companyName}</Text>
						<Text style={styles.subtitle}></Text>
					</View>
				</Page>
			</Document>
		</PDFView>
	);
};

export default PDFPreview;
// 	<Document>
// 		{sections.map((section, index) => {
// 			const sectionTitle = section.sectionTitle || "";
// 			const contentBlocks = section.contentBlocks || [];

// 			return (
// 				<Page key={index} style={styles.page}>
// 					<View style={styles.section}>
// 						<Text style={styles.title}>{sectionTitle}</Text>
// 						{contentBlocks.map((block, index) => {
// 							const contentTitle = block.contentTitle || "";
// 							const content = block.content || "";

// 							return (
// 								<View key={index}>
// 									<Text style={styles.subtitle}>{contentTitle}</Text>
// 									{block.image && (
// 										<View style={styles.imageContainer}>
// 											{console.log(block.image)}
// 											{block.image.map((image, index) => (
// 												<Image
// 													key={index}
// 													style={styles.image}
// 													src={image}
// 												/>
// 											))}
// 										</View>
// 									)}
// 									<Text style={styles.text}>{content}</Text>
// 								</View>
// 							);
// 						})}
// 					</View>
// 				</Page>
// 			);
// 		})}
// 	</Document>
