import { Formik, FieldArray, Field } from "formik";
import { useState } from "react";
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
					image: null,
					content: "",
					image: null,
				},
			],
		},
	],
};

function ProjectReportForm() {
	const [pdfValues, setPdfValues] = useState(initialValues);
	const handleSubmit = async (values) => {
		setPdfValues(values);
		// console.log(values);
	};

	return (
		<div>
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
																							<Dropzone
																								className="border-3 border-black"
																								onDrop={(acceptedFiles) =>
																									setFieldValue(
																										`sections.${sectionIndex}.contentBlocks.${contentIndex}.image`,
																										acceptedFiles[-1]
																									)
																								}
																							>
																								{({
																									getRootProps,
																									getInputProps,
																								}) => (
																									<div {...getRootProps()}>
																										<input
																											{...getInputProps()}
																										/>
																										<p>
																											Drag and drop an image
																											here, or click to select
																											an image
																										</p>
																									</div>
																								)}
																							</Dropzone>
																							{value && (
																								<img
																									width="199"
																									src={URL.createObjectURL(
																										value
																									)}
																									alt={`Content Block ${
																										contentIndex > 0
																											? contentIndex + 1
																											: null
																									}`}
																								/>
																							)}
																						</div>
																					)}
																				</Field>

																				<label
																					htmlFor={`sections.${sectionIndex}.contentBlocks.${contentIndex}.image`}
																					className="block text-xl font-medium text-gray-700"
																				>
																					Content Block Image
																				</label>
																				<Field
																					name={`sections.${sectionIndex}.contentBlocks.${contentIndex}.image`}
																					className="w-full py-2 px-3 text-base border-gray-300 rounded-md"
																				>
																					{({
																						field: { value },
																						form: { setFieldValue },
																					}) => (
																						<div>
																							{/* Image upload */}
																							{value && (
																								<img
																									width="199"
																									src={URL.createObjectURL(
																										value
																									)}
																									alt={`Content Block ${
																										contentIndex > 0
																											? contentIndex + 1
																											: null
																									}`}
																								/>
																							)}
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
																				<label
																					htmlFor={`sections.${sectionIndex}.contentBlocks.${contentIndex}.image`}
																					className="block text-xl font-medium text-gray-700"
																				>
																					Content Block Image
																				</label>
																				<Field
																					name={`sections.${sectionIndex}.contentBlocks.${contentIndex}.image`}
																					className="w-full py-2 px-3 text-base border-gray-300 rounded-md"
																				>
																					{({
																						field: { value },
																						form: { setFieldValue },
																					}) => (
																						<div>
																							{/*image upload  */}
																							{value && (
																								<img
																									width="199"
																									src={URL.createObjectURL(
																										value
																									)}
																									alt={`Content Block ${
																										contentIndex > 0
																											? contentIndex + 1
																											: null
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
																							image: null,
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
																image: null,
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

export default ProjectReportForm;
