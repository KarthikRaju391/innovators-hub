import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Textarea } from "baseui/textarea";
import { useState } from "react";
import BackButton from "../../../components/BackButton";
import LoginHeader from "../../../components/LoginHeader";
import { Button, SHAPE } from "baseui/button";
import { useRouter } from "next/router";
import FileUpload from "../../../components/FileUpload";
import { MdOutlineDeleteForever } from "react-icons/md";

function createproduct() {
	const router = useRouter();

	const [productName, setProductName] = useState("");
	const [productDescription, setProductDescription] = useState("");
	const [productImages, setProductImages] = useState([]);
	const [build, setBuild] = useState("");
	const [quality, setQuality] = useState("");
	const [price, setPrice] = useState("");
	const [category, setCategory] = useState("");
	const [load, setLoad] = useState(false);

	// var img1 = (f) => {
	// 	setFile1(f);
	// };
	// var img2 = (f) => {
	// 	setFile2(f);
	// };
	// var img3 = (f) => {
	// 	setFile3(f);
	// };
	// var img4 = (f) => {
	// 	setFile4(f);
	// };

	const submit = async (e) => {
		//submit from here
		e.preventDefault();
		if (productImages && productImages.length > 0) {
			setLoad(true);
			const productData = {
				productName,
				productDescription,
				build,
				quality,
				price,
				category,
				images: [...productImages],
			};
			const product = await fetch("/api/products/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(productData),
			});
			router.back();
		} else {
			alert("Inserting image 1 is compulsory"); //modal
		}
	};

	return (
		<>
			<LoginHeader />
			<BackButton />
			<p className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">
				Create Product
			</p>

			<form
				onSubmit={(e) => submit(e)}
				className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]"
			>
				<div className="flex flex-wrap gap-2 grid-cols-2">
					<div className="mx-auto" style={{ width: "18rem" }}>
						<FormControl label={() => "Product Name: "}>
							<Input
								value={productName}
								onChange={(e) => setProductName(e.target.value)}
								placeholder="Eg. Hand Pump"
								pattern="^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$"
								autoFocus
								clearable
								required
								clearOnEscape
								overrides={{
									Root: {
										style: ({ $theme }) => ({ width: "18rem" }),
									},
								}}
							/>
						</FormControl>

						<FormControl label={() => "Product Description: "}>
							<Textarea
								value={productDescription}
								onChange={(e) => setProductDescription(e.target.value)}
								placeholder={`Modern day hand pump that can work manually by hand as well as on electricity.`}
								clearOnEscape
								required
							/>
						</FormControl>

						<FormControl label={() => "Price Of The Product: "}>
							<Input
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								placeholder="Eg. Hand Pump"
								type="number"
								min={1}
								pattern="^[0-9]$"
								clearable
								required
								clearOnEscape
								overrides={{
									Root: {
										style: ({ $theme }) => ({ width: "18rem" }),
									},
								}}
							/>
						</FormControl>

						<FormControl label={() => "Category Of The Product: "}>
							<Textarea
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								placeholder={`Eg. Hardware Device, Hand Pump, Pump, Portable Device.`}
								clearOnEscape
								required
							/>
						</FormControl>
					</div>

					<div className="mx-auto" style={{ width: "18rem" }}>
						<FileUpload
							productImages={productImages}
							setProductImages={setProductImages}
						/>
						{productImages?.map((image, i) => (
							<div key={i} className="flex justify-between items-center">
								<img src={image} alt="Product Image" width="100" height="100" />
								<MdOutlineDeleteForever
									onClick={() =>
										setProductImages(
											productImages.filter((img, index) => index !== i)
										)
									}
									className="cursor-pointer"
									size={30}
								/>
							</div>
						))}
						{/* <FormControl
							label={() => "Image 1 Of The Product: "}
							caption={() => "Required*"}
						>
							<>
								<FileInput file={file1} setFiles={img1} type={"image/*"} />
								<p className="flex justify-center gap-4">
									{file1 && (
										<>
											{file1.path}{" "}
											<MdOutlineDeleteForever
												title="Delete Image"
												style={{ fontSize: "1.5rem" }}
												onClick={() => {
													setFile1(undefined);
												}}
											/>
										</>
									)}
								</p>
							</>
						</FormControl>

						<FormControl label={() => "Image 2 Of The Product: "}>
							<>
								<FileInput file={file2} setFiles={img2} type={"image/*"} />
								<p className="flex justify-center gap-4">
									{file2 && (
										<>
											{file2.path}{" "}
											<MdOutlineDeleteForever
												title="Delete Image"
												style={{ fontSize: "1.5rem" }}
												onClick={() => {
													setFile2(undefined);
												}}
											/>
										</>
									)}
								</p>
							</>
						</FormControl>

						<FormControl label={() => "Image 3 Of The Product: "}>
							<>
								<FileInput file={file3} setFiles={img3} type={"image/*"} />
								<p className="flex justify-center gap-4">
									{file3 && (
										<>
											{file3.path}{" "}
											<MdOutlineDeleteForever
												title="Delete Image"
												style={{ fontSize: "1.5rem" }}
												onClick={() => {
													setFile3(undefined);
												}}
											/>
										</>
									)}
								</p>
							</>
						</FormControl>

						<FormControl label={() => "Image 4 Of The Product: "}>
							<>
								<FileInput file={file4} setFiles={img4} type={"image/*"} />
								<p className="flex justify-center gap-4">
									{file4 && (
										<>
											{file4.path}{" "}
											<MdOutlineDeleteForever
												title="Delete Image"
												style={{ fontSize: "1.5rem" }}
												onClick={() => {
													setFile4(undefined);
												}}
											/>
										</>
									)}
								</p>
							</>
						</FormControl> */}
					</div>
				</div>
				<div className="grid justify-center">
					<Button
						type="Submit"
						shape={SHAPE.pill}
						isLoading={load}
						title="Submit Form"
					>
						Submit
					</Button>
				</div>
			</form>
		</>
	);
}

export default createproduct;
