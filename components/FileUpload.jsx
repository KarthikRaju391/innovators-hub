import Dropzone from "react-dropzone";
import React, { useCallback, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import app from "../firebase";

const FileUpload = ({ sectionIndex, contentIndex }) => {
	const { values, setFieldValue } = useFormikContext();
	const value = values.sections[sectionIndex].contentBlocks[contentIndex].image;
	const storage = getStorage(app);
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
		const imageURLs = await uploadImages(files);
		const fieldPath = `sections.${sectionIndex}.contentBlocks.${contentIndex}.image`;
		if (value && value.length > 0) {
			const newValue = [...value, ...imageURLs];
			setFieldValue(fieldPath, newValue);
		} else {
			setFieldValue(fieldPath, imageURLs);
		}
	};

	return (
		<Dropzone onDrop={onDrop} multiple={true}>
			{({ getRootProps, getInputProps }) => (
				<div {...getRootProps()}>
					<input {...getInputProps()} />
					<p>Drag'n'drop files, or click to select files</p>
				</div>
			)}
		</Dropzone>
	);
};

export default FileUpload;
