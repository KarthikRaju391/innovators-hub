import { useEffect, useContext, useState } from "react";
import { Formik, FieldArray, Field, Form } from "formik";
import FileUpload from "../../../../components/FileUpload";
import DynamicFieldButtons from "../../../../components/DynamicFieldButtons";
import { initialValues } from "../../../../InitialValues";
import { app } from "../../../../firebase";
import PDFPreview from "../../../../components/PDFPreview";
import { getStorage, ref, deleteObject } from "firebase/storage";
import SubmitContext from "../../../../context/SubmitContext";
import { useRouter } from "next/router";
import LoginHeader from "../../../../components/LoginHeader";
import BackButton from "../../../../components/BackButton";
import { Button } from "baseui/button";
import { RiArrowGoBackLine, RiBookmarkFill } from "react-icons/ri";

const Product = {
	name: "Product",
	fields: [
		{
			name: "Product Name",
			value: "",
		},
		{
			name: "Description",
			value: "",
		},
		{
			name: "Features",
			value: "",
		},
		{
			name: "Benefits",
			value: "",
		},
		{
			name: "Pricing Strategy",
			value: "",
		},
		{
			name: "Development Timeline",
			value: "",
		},
		{
			name: "Image",
			value: "",
		},
	],
};

const CompetitiveAnalysis = {
	name: "Competitor",
	fields: [
		{
			name: "Competitor Name",
			value: "",
		},
		{
			name: "Competitor Strengths",
			value: "",
		},
		{
			name: "Competitor Weaknesses",
			value: "",
		},
	],
};

const TeamMember = {
	name: "Team Member",
	fields: [
		{
			name: "Name",
			value: "",
		},
		{
			name: "Title",
			value: "",
		},
		{
			name: "Experience",
			value: "",
		},
		{
			name: "Role",
			value: "",
		},
		{
			name: "Image",
			value: [],
		},
	],
};

const renderFields = (fields, parentKey = "") => {
	const handleDelete = async (url) => {
		const storage = getStorage(app);
		const imageRef = ref(storage, url);
		await deleteObject(imageRef);
	};

	return (
		fields.length > 0 &&
		fields.map((field, index) => {
			const { name, fields } = field;
			const fieldName =
				fields && Array.isArray(fields)
					? `${parentKey ? `${parentKey}.` : ""}${index}.fields` // Nested field
					: `${parentKey ? `${parentKey}.` : ""}${index}.value`; // Regular field

			if (fields && Array.isArray(fields) && fields.length > 0) {
				const fieldTemplate =
					name === "Products and Services"
						? Product
						: name === "Competitive Analysis"
						? CompetitiveAnalysis
						: name === "Team"
						? TeamMember
						: null;

				return (
					<FieldArray name={fieldName} key={fieldName}>
						{({ push, pop }) => (
							<>
								<label htmlFor={fieldName} className="font-bold text-xl underline">{name}</label>
								{renderFields(fields, fieldName)}
								{field.dynamic && (
									<DynamicFieldButtons
										name={name}
										fields={fields}
										fieldTemplate={fieldTemplate}
										push={push}
										pop={pop}
									/>
								)}
							</>
						)}
					</FieldArray>
				);
			} else if (typeof field === "object") {
				if (name === "Image") {
					return (
						<Field name={fieldName}>
							{({ field: { value }, form: { setFieldValue } }) => (
								<div>
									<FileUpload
										fieldName={fieldName}
										value={value}
										setFieldValue={setFieldValue}
									/>
									{value &&
										value.map((imageURL, index) => (
											<img
												onClick={() => {
													setFieldValue(
														fieldName,
														value.filter((image, i) => i !== index)
													);
													handleDelete(imageURL);
												}}
												key={index}
												width="199"
												src={imageURL}
												alt=""
											/>
										))}
								</div>
							)}
						</Field>
					);
				}
				return (
					<div key={fieldName} className="mb-3">
						<label className="block text-xl font-bold">{name}</label>
						<Field className="text-black rounded-lg p-2 bg-neutral-200" name={fieldName} />
						{renderFields(field, fieldName)}
					</div>
				);
			}
		})
	);
};

const DynamicForm = () => {
	const { updated, setUpdated, updateProject, project } =
		useContext(SubmitContext);
	const router = useRouter();
	const [pdfValues, setPdfValues] = useState(
		project.projectReport.length > 0 ? project.projectReport : initialValues
	);
	const [load, setLoad] = useState(false)

	// PdfReportGenerator
	const handleSubmit = async (values) => {
		const res = await fetch("/api/project", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...project, projectReport: values }),
		});

		setUpdated(true);
		updateProject({ projectReport: [] });
		await res.json();
	};

	useEffect(() => {
		// show the alert if the user tries to go back without saving
		const alertUser = (e) => {
			e.preventDefault();
			e.returnValue = "";
		};
		window.addEventListener("beforeunload", alertUser);
		return () => {
			window.removeEventListener("beforeunload", alertUser);
		};
	}, []);

	const handleBack = (values) => {
		!updated && updateProject({ projectReport: values });
		router.back();
	};

	return (
		<>
			<LoginHeader />
			<BackButton />
		<div>
			<Formik initialValues={pdfValues} onSubmit={handleSubmit}>
				{({ values }) => (
					<Form className="flex flex-wrap justify-around">
						<div>
							{renderFields(values)}
							{/* <button type="submit">Save</button>
							<button onClick={() => handleBack(values)} type="button">
								Go Back
							</button> */}
							<div className="flex flex-wrap gap-4 my-4">
							<Button
								type="submit"
								isLoading={load}
								overrides={{
									BaseButton: {
										style: ({ $theme }) => ({
											backgroundColor: $theme.colors.accent500,
										}),
									},
								}}
								startEnhancer={ <RiBookmarkFill style={{ fontSize: "1.5rem" }} /> }
								>
								Save
							</Button>
							<Button
								type="button"
								onClick={()=>handleBack(values)}
								isLoading={load}
								overrides={{
									BaseButton: {
										style: ({ $theme }) => ({
											backgroundColor: $theme.colors.negative400,
										}),
									},
								}}
								startEnhancer={ <RiArrowGoBackLine style={{ fontSize: "1.5rem" }} /> }
								>
								Go Back
							</Button>
							</div>
						</div>
						<div className="p-4">
							<PDFPreview data={pdfValues} />
						</div>
					</Form>
				)}
			</Formik>
		</div>
		</>
	);
};

export default DynamicForm;
