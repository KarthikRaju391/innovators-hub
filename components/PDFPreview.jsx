import React from "react";
import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	PDFViewer,
} from "@react-pdf/renderer";
import { Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
	page: {
		backgroundColor: "#d11fb6",
		color: "#fff",
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
		width: typeof window !== "undefined" && window.innerWidth / 2,
		height: typeof window !== "undefined" && window.innerHeight,
	},
});

function PDFPreview({ values }) {
	if (values === null) {
		return (
			<PDFViewer style={styles.viewer}>
				<Document>
					<Page style={styles.page}>
						<Text>Nothing to preview</Text>
					</Page>
				</Document>
			</PDFViewer>
		);
	}
	return (
		<PDFViewer style={styles.viewer}>
			<Document>
				{values.sections.map((section, index) => (
					<Page key={index}>
						<View>
							<Text>{section.sectionTitle}</Text>
							{section.contentBlocks.map((block, index) => (
								<View key={index}>
									<Text>{block.contentTitle}</Text>
									{block.image && (
										<View style={styles.imageContainer}>
											<Image
												style={styles.image}
												src={URL.createObjectURL(block.image)}
											/>
											)
										</View>
									)}
									<Text>{block.content}</Text>
								</View>
							))}
						</View>
					</Page>
				))}
			</Document>
		</PDFViewer>
	);
}

export default PDFPreview;
