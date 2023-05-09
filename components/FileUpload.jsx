import Dropzone from "react-dropzone";
import React, { useCallback, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

const FileUpload = ({ fieldName }) => {
	const storage = getStorage(app);
	const [isLoading, setIsLoading] = useState(false);
	const { values, setFieldValue } = useFormikContext();
	const fieldNames = fieldName.split(".");
	const indexes = fieldNames
		.filter((val) => !isNaN(val))
		.map((val) => parseInt(val));
	const currentValue = indexes.reduce(
		(acc, index) => (acc.fields ? acc.fields[index] : acc[index]),
		values
	);

	const uploadImages = async (files) => {
		const uploadedImages = [];

		await Promise.all(
			files.map((image) => {
				const imageRef = ref(storage, `images/${image.name}`);
				const uploadTasks = uploadBytesResumable(imageRef, image);

				return new Promise((resolve, reject) => {
					uploadTasks.on(
						"state_changed",
						(snapshot) => {
							const progress =
								(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
							console.log(`Upload is ${progress}% done`);
							switch (snapshot.state) {
								case "paused":
									console.log("Upload is paused");
									break;
								case "running":
									console.log("Upload is running");
									break;
							}
						},

						(error) => {
							console.log(error);
							reject(error);
						},

						() => {
							getDownloadURL(uploadTasks.snapshot.ref)
								.then((downloadURL) => {
									uploadedImages.push(downloadURL);
									resolve();
								})
								.catch((error) => {
									console.log(error);
									reject(error);
								});
						}
					);
				});
			})
		);

		return uploadedImages;
	};

	const onDrop = async (files) => {
		setIsLoading(true);
		const { value } = currentValue;
		const imageURLs = await uploadImages(files);
		if (value && value.length > 0) {
			const newValue = [...value, ...imageURLs];
			setFieldValue(fieldName, newValue);
			setIsLoading(false);
		} else {
			setFieldValue(fieldName, [...imageURLs]);
			setIsLoading(false);
			console.log(values);
		}
	};

	return (
		<Dropzone onDrop={onDrop} multiple={true}>
			{({ getRootProps, getInputProps }) => (
				<div {...getRootProps()}>
					<input {...getInputProps()} />
					{isLoading ? (
						<p>Loading...</p>
					) : (
						<p>Drag'n'drop files, or click to select files</p>
					)}
				</div>
			)}
		</Dropzone>
	);
};

export default FileUpload;
