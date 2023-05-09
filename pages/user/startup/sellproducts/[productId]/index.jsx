import BackButton from "../../../../../components/BackButton";
import LoginHeader from "../../../../../components/LoginHeader";
import React, { useState, useCallback } from "react";
import ImageViewer from "react-simple-image-viewer";
import Image from "next/image";
import { FiEdit } from "react-icons/fi";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useRouter } from "next/router";
import { makeSerializable } from "../../../../../lib/util";

function productId({ product }) {
	const router = useRouter();
	const nxtpg = `/user/startup/sellproducts/${router.query.productId}/edit`;

	const [currentImage, setCurrentImage] = useState(0);
	const [isViewerOpen, setIsViewerOpen] = useState(false);

	const openImageViewer = useCallback((index) => {
		setCurrentImage(index);
		setIsViewerOpen(true);
	}, []);

	const closeImageViewer = () => {
		setCurrentImage(0);
		setIsViewerOpen(false);
	};

	const hide = () => {
		console.log("Hide the Content API");
	};

	const visible = () => {
		console.log("View the Content API");
	};

	return (
		<>
			<BackButton />
			<LoginHeader />
			<h2 className="select-none flex my-[.5rem] py-[.5rem] text-3xl cursor-default justify-center gap-4">
				{product.name}{" "}
				<span className="animate__animated animate__fadeInRight flex gap-4">
					{" "}
					<FiEdit
						title="Edit The Information"
						style={{ cursor: "pointer" }}
						onClick={() => router.push(nxtpg)}
					/>{" "}
					{product.visible ? (
						<AiOutlineEyeInvisible
							title="Make The Product Visible For Customers"
							onClick={visible}
							style={{ cursor: "pointer" }}
						/>
					) : (
						<AiOutlineEye
							title="Hide The Product For Customers"
							onClick={hide}
							style={{ cursor: "pointer" }}
						/>
					)}{" "}
				</span>
			</h2>
			<div className="my-2 py-2 ml-5 pl-5 flex justify-center flex-wrap gap-2 grid-cols-2 animate__animated animate__fadeInUp">
				{product.image.map(
					(src, index) =>
						src && (
							<Image
								src={src}
								onClick={() => openImageViewer(index)}
								width="400"
								height="200"
								key={index}
								quality={100}
								placeholder="blur"
								blurDataURL="blur"
								alt={product.name}
							/>
						)
				)}

				{isViewerOpen && (
					<ImageViewer
						src={product.image.filter((el) => el !== undefined)}
						currentIndex={currentImage}
						disableScroll={false}
						closeOnClickOutside={true}
						onClose={closeImageViewer}
					/>
				)}
			</div>

			{product.description && (
				<>
					<p className="mx-10 cursor-default select-none text-center animate__animated animate__fadeInUp">
						<span className="text-xl cursor-default select-none">
							Description:
						</span>{" "}
						<br />
						{product.description}
					</p>
					<br />
				</>
			)}
			<div className="flex gap-2 flex-wrap mb-1 pb-1 justify-center md:mb-3 md:pb-3 animate__animated animate__fadeInUp">
				{/* {product.build && (<><p className="mx-10 cursor-default select-none"><span className="text-xl cursor-default select-none">Build:</span> <br/>{product.build}</p><br/></>)} */}
				{/* {product.quality && (<><p className="mx-10 cursor-default select-none"><span className="text-xl cursor-default select-none">Quality:</span> <br/>{product.quality}</p><br/></>)} */}
				{product.price && (
					<>
						<p className="mx-10 cursor-default select-none">
							<span className="text-xl cursor-default select-none">Price:</span>{" "}
							<br /> ₹{product.price}
						</p>
						<br />
					</>
				)}
				{product.category && (
					<>
						<p className="mx-10 cursor-default select-none">
							<span className="text-xl cursor-default select-none">
								Category:
							</span>{" "}
							<br />
							{product.category.map((item) => item.name).join(", ")}
						</p>
						<br />
					</>
				)}
				{product.startup.name && (
					<>
						<p className="mx-10 cursor-default select-none">
							<span className="text-xl cursor-default select-none">
								Startup:
							</span>{" "}
							<br />
							{product.startup.name}
						</p>
						<br />
					</>
				)}
			</div>
		</>
	);
}

export async function getServerSideProps(context) {
	const { productId } = context.query;
	const res = await fetch(`${process.env.NEXT_APP_URL}/api/products/${productId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Cookie: context.req.headers.cookie,
		},
	});
	const product = await res.json();
	return {
		props: {
			product: makeSerializable(product),
		},
	};
}

export default productId;
