import { useContext, useState } from "react";
import { Formik, FieldArray, Field, Form, useFormikContext } from "formik";
import FileUpload from "../../../components/FileUpload";
import DynamicFieldButtons from "../../../components/DynamicFieldButtons";
import { initialValues } from "../../../InitialValues";
import { app } from "../../../firebase";
import PDFPreview from "../../../components/PDFPreview";
import { getStorage, ref, deleteObject } from "firebase/storage";
import SubmitContext from "../../../context/SubmitContext";
import { useRouter } from "next/router";

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
								<label htmlFor={fieldName}>{name}</label>
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
					<div key={fieldName}>
						<label className="block text-xl font-bold">{name}</label>
						<Field name={fieldName} />
						{renderFields(field, fieldName)}
					</div>
				);
			}
		})
	);
};

const DynamicForm = () => {
	const { submitted, setSubmitted, updateProject, project } =
		useContext(SubmitContext);
	const router = useRouter();
	const [pdfValues, setPdfValues] = useState(
		project.projectReport.length > 0 ? project.projectReport : initialValues
	);

	const handleSubmit = async (values) => {
		updateProject({ projectReport: values });
		setSubmitted(true);
	};

	const handleBack = (values) => {
		!submitted && updateProject({ projectReport: values });
		router.back();
	};

	return (
		<div>
			<Formik initialValues={pdfValues} onSubmit={handleSubmit}>
				{({ values }) => (
					<Form className="flex justify-around">
						<div>
							{renderFields(values)}
							<button type="submit">Save</button>
							<button onClick={() => handleBack(values)} type="button">
								Go Back
							</button>
						</div>
						<div className="p-4">
							<PDFPreview data={pdfValues} />
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default DynamicForm;