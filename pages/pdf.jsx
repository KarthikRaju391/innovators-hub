import { Formik, FieldArray, Field } from "formik";
import { useState } from "react";
import PDFPreview from "../components/PDFPreview";
import FileUpload from "../components/FileUpload";
import { app } from "../firebase";
import { getStorage, ref, deleteObject } from "firebase/storage";

const initialValues = {
	projectTitle: "",
	sections: [
		{
			sectionTitle: "",
			contentBlocks: [
				{
					contentTitle: "",
					image: [],
					content: "",
				},
			],
		},
	],
};

function ProjectReportForm({ projectReport = null }) {
	const [pdfValues, setPdfValues] = useState(
		projectReport?.report || initialValues
	);
	const storage = getStorage(app);

	const handleDelete = async (url) => {
		const imageRef = ref(storage, url);
		const res = await deleteObject(imageRef);
		console.log(res);
	};

	const handleSubmit = async (values) => {
		setPdfValues(values);
		console.log(values);

		const res = await fetch("/api/project", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});

		await res.json();
	};

	return (
		<div>
			<Formik initialValues={pdfValues} onSubmit={handleSubmit}>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleBlur,
					handleSubmit,
					isSubmitting,
				}) => (
					<form
						onSubmit={handleSubmit}
						className="px-5 grid place-items-center space-y-4"
					>
						<label
							htmlFor="projectTitle"
							className="block text-2xl font-medium text-gray-700"
						>
							Project Title
						</label>
						<input
							type="text"
							name="projectTitle"
							value={values.projectTitle}
							onChange={handleChange}
							onBlur={handleBlur}
							className="w-full py-2 px-3 text-base border-gray-300 rounded-md"
						/>
						{errors.projectTitle && touched.projectTitle && (
							<div className="text-red-500 text-sm">{errors.projectTitle}</div>
						)}
						<div className="container flex justify-between">
							<div>
								<FieldArray name="sections">
									{({ push: pushSection, remove }) => (
										<>
											{values.sections.map((section, sectionIndex) => (
												<div key={sectionIndex}>
													<div className="flex justify-between">
														<h2>
															Section{" "}
															{sectionIndex > 0 ? sectionIndex + 1 : null}
														</h2>
														{sectionIndex > 0 && (
															<button
																type="button"
																onClick={() => remove(sectionIndex)}
															>
																Remove Section
															</button>
														)}
													</div>
													<label
														htmlFor={`sections.${sectionIndex}.sectionTitle`}
														className="block text-xl font-medium text-gray-700"
													>
														Section Title
													</label>
													<Field
														type="text"
														className="w-full py-2 px-3 text-base border-gray-300 rounded-md"
														name={`sections.${sectionIndex}.sectionTitle`}
													/>
													{errors.sections &&
														errors.sections[sectionIndex] &&
														errors.sections[sectionIndex].sectionTitle && (
															<div className="text-red-500 text-sm">
																{errors.sections[sectionIndex].sectionTitle}
															</div>
														)}
													{
														<FieldArray
															name={`sections.${sectionIndex}.contentBlocks`}
														>
															{({ push: pushContentBlock, remove }) => (
																<>
																	{values.sections[
																		sectionIndex
																	].contentBlocks.map(
																		(contentBlock, contentIndex) => (
																			<div key={contentIndex}>
																				<div className="flex justify-between">
																					<h2>
																						Content Block{" "}
																						{contentIndex > 0
																							? contentIndex + 1
																							: null}
																					</h2>
																					{contentIndex > 0 && (
																						<button
																							type="button"
																							onClick={() =>
																								remove(contentIndex)
																							}
																						>
																							Remove Content Block
																						</button>
																					)}
																				</div>
																				<label
																					htmlFor={`sections.${sectionIndex}.contentBlocks.${contentIndex}.contentTitle`}
																					className="block text-xl font-medium text-gray-700"
																				>
																					Content Block Title
																				</label>
																				<Field
																					name={`sections.${sectionIndex}.contentBlocks.${contentIndex}.contentTitle`}
																					className="w-full py-2 px-3 text-base border-gray-300 rounded-md"
																				/>

																				<Field
																					name={`sections.${sectionIndex}.contentBlocks.${contentIndex}.image`}
																					className="w-full py-2 px-3 text-base border-gray-300 rounded-md"
																				>
																					{({
																						field: { value },
																						form: { setFieldValue },
																					}) => (
																						<div>
																							{/* <FileUpload
																								sectionIndex={sectionIndex}
																								contentIndex={contentIndex}
																							/> */}
																							{value &&
																								value.map((imageURL, index) => (
																									<img
																										onClick={() => {
																											setFieldValue(
																												`sections.${sectionIndex}.contentBlocks.${contentIndex}.image`,
																												value.filter(
																													(image, i) =>
																														i !== index
																												)
																											);
																											handleDelete(imageURL);
																										}}
																										key={index}
																										width="199"
																										src={imageURL}
																										alt={`Content Block ${
																											contentIndex > 0
																												? contentIndex + 1
																												: null
																										}`}
																									/>
																								))}
																						</div>
																					)}
																				</Field>
																				<label
																					htmlFor={`sections.${sectionIndex}.contentBlocks.${contentIndex}.content`}
																					className="block text-xl font-medium text-gray-700"
																				>
																					Content Block Content
																				</label>
																				<Field
																					as="textarea"
																					className="w-full py-2 px-3 text-base border-gray-300 rounded-md"
																					name={`sections.${sectionIndex}.contentBlocks.${contentIndex}.content`}
																				/>
																				{errors.sections &&
																					errors.sections[sectionIndex] &&
																					errors.sections[sectionIndex]
																						.contentBlocks &&
																					errors.sections[sectionIndex]
																						.contentBlocks[contentIndex] &&
																					errors.sections[sectionIndex]
																						.contentBlocks[contentIndex]
																						.content && (
																						<div className="text-red-500 text-sm">
																							{
																								errors.sections[sectionIndex]
																									.contentBlocks[contentIndex]
																									.content
																							}
																						</div>
																					)}
																				<button
																					type="button"
																					onClick={() =>
																						pushContentBlock({
																							contentTitle: "",
																							image: null,
																							content: "",
																						})
																					}
																				>
																					Add Content Block
																				</button>
																			</div>
																		)
																	)}
																</>
															)}
														</FieldArray>
													}
												</div>
											))}
											<hr />
											<button
												type="button"
												onClick={() =>
													pushSection({
														sectionTitle: "",
														contentBlocks: [
															{
																contentTitle: "",
																image: null,
																content: "",
															},
														],
													})
												}
											>
												Add Section
											</button>
										</>
									)}
								</FieldArray>
							</div>
							<div className="pdf-view">
								<PDFPreview values={pdfValues} />
							</div>
						</div>
						<button type="submit" disabled={isSubmitting}>
							Submit
						</button>
					</form>
				)}
			</Formik>
		</div>
	);
}

export async function getServerSideProps(context) {
	const res = await fetch(`${process.env.NEXT_APP_URL}/api/project/`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Cookie: context.req.headers.cookie,
		},
	});
	const projectReport = await res.json();

	return {
		props: {
			projectReport,
		},
	};
}

export default ProjectReportForm;
