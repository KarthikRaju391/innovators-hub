import Dropzone from "react-dropzone";
import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../src/lib/supabase";

interface FileUploadProps {
	fieldName?: string | null;
	value?: any[] | null;
	setFieldValue?: (field: string, value: any) => void | null;
	productImages?: string[] | null;
	setProductImages?: (images: string[]) => void | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
	fieldName = null,
	value = null,
	setFieldValue = null,
	productImages = null,
	setProductImages = null,
}) => {
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

	const uploadImages = async (files: File[]) => {
		const uploadedImages: string[] = [];

		await Promise.all(
			files.map(async (image) => {
				const fileName = productImages && setProductImages ? `images/products/${image.name}` : `images/${image.name}`;
				const { data, error } = await supabase.storage.from('uploads').upload(fileName, image);

				if (error) {
					console.log(error);
					throw error;
				}

				const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(fileName);
				uploadedImages.push(publicUrl);
			})
		);

		return uploadedImages;
	};

	const onDrop = async (files: File[]) => {
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
			if (fieldName && setFieldValue) setFieldValue(fieldName, newValue);
			setIsLoading(false);
		} else {
			if (fieldName && setFieldValue) setFieldValue(fieldName, [...imageURLs]);
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
