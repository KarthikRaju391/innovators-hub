import { Formik, FieldArray, Field } from "formik";
import { useState, useEffect } from "react";
import PDFPreview from "../components/PDFPreview";
import Dropzone from "react-dropzone";

const initialValues = {
	projectTitle: "",
	sections: [
		{
			sectionTitle: "",
			contentBlocks: [
				{
					contentTitle: "",
					content: "",
					image: null,
				},
			],
		},
	],
};

function ProjectReportForm() {
	const handleSubmit = (values) => {
		console.log(values);
	};

	return (
		<Formik initialValues={initialValues} onSubmit={handleSubmit}>
			{({
				values,
				errors,
				touched,
				handleChange,
				handleBlur,
				handleSubmit,
				isSubmitting,
			}) => (
				<form onSubmit={handleSubmit}>
					<label htmlFor="projectTitle">Project Title</label>
					<input
						type="text"
						name="projectTitle"
						value={values.projectTitle}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
					{errors.projectTitle && touched.projectTitle && (
						<div>{errors.projectTitle}</div>
					)}

					<div className="container">
						<div>
							<FieldArray name="sections">
								{({ push: pushSection, remove }) => (
									<>
										{values.sections.map((section, sectionIndex) => (
											<div key={sectionIndex}>
												<h2>Section {sectionIndex + 1}</h2>
												<button
													type="button"
													onClick={() => remove(sectionIndex)}
												>
													-
												</button>
												<label
													htmlFor={`sections.${sectionIndex}.sectionTitle`}
												>
													Section Title
												</label>
												<Field
													type="text"
													name={`sections.${sectionIndex}.sectionTitle`}
												/>
												{errors.sections &&
													errors.sections[sectionIndex] &&
													errors.sections[sectionIndex].sectionTitle && (
														<div>
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
																			<h3>Content Block {contentIndex + 1}</h3>
																			<button
																				type="button"
																				onClick={() => remove(contentIndex)}
																			>
																				-
																			</button>

																			<label
																				htmlFor={`sections.${sectionIndex}.contentBlocks.${contentIndex}.contentTitle`}
																			>
																				Content Block Title
																			</label>
																			<Field
																				name={`sections.${sectionIndex}.contentBlocks.${contentIndex}.contentTitle`}
																			/>
																			<label
																				htmlFor={`sections.${sectionIndex}.contentBlocks.${contentIndex}.content`}
																			>
																				Content Block Content
																			</label>
																			<Field
																				as="textarea"
																				name={`sections.${sectionIndex}.contentBlocks.${contentIndex}.content`}
																			/>
																			<label
																				htmlFor={`sections.${sectionIndex}.contentBlocks.${contentIndex}.image`}
																			>
																				Content Block Image
																			</label>
																			<Field
																				name={`sections.${sectionIndex}.contentBlocks.${contentIndex}.image`}
																			>
																				{({
																					field: { value },
																					form: { setFieldValue },
																				}) => (
																					<div>
																						<Dropzone
																							onDrop={(acceptedFiles) =>
																								setFieldValue(
																									`sections.${sectionIndex}.contentBlocks.${contentIndex}.image`,
																									acceptedFiles[0]
																								)
																							}
																						>
																							{({
																								getRootProps,
																								getInputProps,
																							}) => (
																								<div {...getRootProps()}>
																									<input {...getInputProps()} />
																									<p>
																										Drag and drop an image here,
																										or click to select an image
																									</p>
																								</div>
																							)}
																						</Dropzone>
																						{value && (
																							<img
																								width="200"
																								src={URL.createObjectURL(value)}
																								alt={`Content Block ${
																									contentIndex + 1
																								}`}
																							/>
																						)}
																					</div>
																				)}
																			</Field>
																			{errors.sections &&
																				errors.sections[sectionIndex] &&
																				errors.sections[sectionIndex]
																					.contentBlocks &&
																				errors.sections[sectionIndex]
																					.contentBlocks[contentIndex] &&
																				errors.sections[sectionIndex]
																					.contentBlocks[contentIndex]
																					.content && (
																					<div>
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
																						content: "",
																						image: null,
																					})
																				}
																			>
																				+
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
										<button
											type="button"
											onClick={() =>
												pushSection({
													sectionTitle: "",
													contentBlocks: [
														{
															content: "",
															image: null,
														},
													],
												})
											}
										>
											+
										</button>
									</>
								)}
							</FieldArray>
						</div>

						<div className="pdf-view">
							<PDFPreview values={values} />
						</div>
					</div>
					<button type="submit" disabled={isSubmitting}>
						Submit
					</button>
				</form>
			)}
		</Formik>
	);
}

export default ProjectReportForm;
