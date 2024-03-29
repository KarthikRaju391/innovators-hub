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

const FileUpload = ({
	fieldName = null,
	value = null,
	setFieldValue = null,
	productImages = null,
	setProductImages = null,
}) => {
	const storage = getStorage(app);
	const [isLoading, setIsLoading] = useState(false);
	// let currentValue = [];
	// let setFieldValue;
	// if (!productImages) {
	// 	const { values, setFieldValue } = useFormikContext();
	// 	const fieldNames = fieldName.split(".");
	// 	const indexes = fieldNames
	// 		.filter((val) => !isNaN(val))
	// 		.map((val) => parseInt(val));
	// 	currentValue = indexes.reduce(
	// 		(acc, index) => (acc.fields ? acc.fields[index] : acc[index]),
	// 		values
	// 	);
	// }

	const uploadImages = async (files) => {
		const uploadedImages = [];
		let imageRef = null;

		await Promise.all(
			files.map((image) => {
				if (productImages && setProductImages) {
					imageRef = ref(storage, `images/products/${image.name}`);
				} else {
					imageRef = ref(storage, `images/${image.name}`);
				}
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
		if (productImages && setProductImages) {
			const imageURLs = await uploadImages(files);
			setProductImages([...productImages, ...imageURLs]);
			setIsLoading(false);
			return;
		}
		// const { value } = currentValue;
		const imageURLs = await uploadImages(files);
		if (value && value.length > 0) {
			const newValue = [...value, ...imageURLs];
			setFieldValue(fieldName, newValue);
			setIsLoading(false);
		} else {
			setFieldValue(fieldName, [...imageURLs]);
			setIsLoading(false);
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
						<div className="h-[6rem] border-2 cursor-pointer border-dashed rounded-lg border-neutral-400 pl-[1.5rem] pt-[1rem] mb-2">
							<p className="text-neutral-400 text-sm font-bold">
								Drag'n'drop files, or click to select files
							</p>
							<button type="button" className="ml-[4.5rem] mt-3 font-semibold bg-neutral-400 py-1 px-3 rounded-2xl text-black">
								Browse File
							</button>
						</div>
					)}
				</div>
			)}
		</Dropzone>
	);
};

export default FileUpload;
