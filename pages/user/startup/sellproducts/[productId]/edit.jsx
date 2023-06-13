import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Textarea } from "baseui/textarea";
import { useState } from "react";
import BackButton from "../../../../../components/BackButton";
import LoginHeader from "../../../../../components/LoginHeader";
import { Button, SHAPE } from "baseui/button";
import { useRouter } from "next/router";
import { MdOutlineDeleteForever } from "react-icons/md";
import { makeSerializable } from "../../../../../lib/util";
import FileUpload from "../../../../../components/FileUpload";

function edit({ product }) {
	const router = useRouter();

	const [productName, setProductName] = useState(product.name);
	const [productDescription, setProductDescription] = useState(
		product.description
	);
	const [productImages, setProductImages] = useState(product.image);
	const [price, setPrice] = useState(product.price);
	const [category, setCategory] = useState(product.category);
	const [load, setLoad] = useState(false);

	const submit = async (e) => {
		e.preventDefault();
		console.log(category.map((cat) => ({ name: cat.name })));
		if (productImages && productImages.length > 0) {
			setLoad(true);
			const productData = {
				productName,
				productDescription,
				price: Number(price),
				category,
				image: [...productImages],
			};
			const product = await fetch(`/api/products/${router.query.productId}`, {
				method: "PUT",
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
				Edit Product - {router.query.productId}
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
								value={category.map((cat) => cat.name).join(", ")}
								onChange={(e) =>
									setCategory(
										e.target.value
											.split(",")
											.map((cat) => ({ name: cat.trim() }))
									)
								}
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
					</div>
				</div>
				<div className="grid justify-center">
					<Button
						type="Submit"
						shape={SHAPE.pill}
						isLoading={load}
						title="Submit Form"
					>
						Update
					</Button>
				</div>
			</form>
		</>
	);
}

export default edit;

export async function getServerSideProps(context) {
	const product = await fetch(
		`http://localhost:3000/api/products/${context.params.productId}`
	);
	const data = await product.json();

	return {
		props: {
			product: makeSerializable(data),
		},
	};
}
