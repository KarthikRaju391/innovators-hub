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
		fontFamily: "Times-Roman",
		fontSize: 12,
		paddingTop: 50,
		paddingLeft: 60,
		paddingRight: 60,
		paddingBottom: 60,
		textAlign: "justify",
	},
	sectionTitle: {
		fontSize: 24,
		marginBottom: 20,
	},
	title: {
		fontSize: 20,
		textAlign: "left",
	},
	subtitle: {
		fontSize: 18,
		textAlign: "left",
		// marginBottom: 10,
	},

	text: {
		// margin: 10,
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
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	firstPage: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		width: "60%",
		objectFit: "cover",
		marginBottom: 10,
	},
	section: {
		// margin: 10,
		// padding: 10,
	},
	viewer: {
		width: windowWidth,
		height: windowHeight,
	},
});

const recursivePDFComponent = (field, index) => {
	if (field.fields && Array.isArray(field.fields) && field.fields.length > 0) {
		return (
			<View key={index} style={styles.section}>
				{!field.level ? (
					<Text style={{ fontSize: "20" }}>{field.name}</Text>
				) : field.level === 0 ? (
					<Text
						style={[
							styles.sectionTitle,
							{ textAlign: "center", fontWeight: "ultrabold" },
						]}
					>
						{field.name}
					</Text>
				) : field.level === 1 ? (
					<Text style={[styles.title]}>{field.name}</Text>
				) : field.level === 2 ? (
					<Text style={[styles.subtitle, {}]}>{field.name}</Text>
				) : null}
				{field.fields.map((subField, index) => (
					<View key={index}>{recursivePDFComponent(subField, `${index}`)}</View>
				))}
			</View>
		);
	} else {
		return (
			<View key={index} style={styles.section}>
				<Text style={{ fontSize: "16" }}>{field.name}</Text>
				{field.value && <Text style={styles.text}>{field.value}</Text>}
			</View>
		);
	}
};

const PDFPreview = ({ data = {} }) => {
	const companyData = data[1]?.fields;

	return (
		<PDFView style={styles.viewer}>
			<Document>
				<Page size="A4" style={styles.page}>
					<View style={styles.firstPage}>
						<Text
							style={[styles.sectionTitle, { textDecoration: "underline" }]}
						>
							{data[1].name}
						</Text>
						<View style={styles.imageContainer}>
							{companyData[5].value &&
								companyData[5].value.map((imageURL, index) => (
									<Image key={index} style={styles.image} src={imageURL} />
								))}
						</View>
						<View>
							{companyData.map((field, index) => (
								<View key={index}>
									{field.name !== "Image" && (
										<View
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
											}}
										>
											<Text style={[styles.text]}>{field.name}</Text>
											<Text style={styles.title}>{field.value}</Text>
										</View>
									)}
								</View>
							))}
						</View>
					</View>
				</Page>
				<Page size="A4" style={styles.page}>
					{data.map((field, index) => {
						if (field.name !== "Company Overview") {
							return (
								<View key={index} style={styles.section}>
									{recursivePDFComponent(field, `${index}`)}
								</View>
							);
						}
					})}
				</Page>
			</Document>
		</PDFView>
	);
};

export default PDFPreview;
