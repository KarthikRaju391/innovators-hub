import BackButton from "../../components/BackButton";
import LoginHeader from "../../components/LoginHeader";
import React, { useState, useCallback } from "react";
import ImageViewer from "react-simple-image-viewer";
import Image from "next/image";
import { Button } from "baseui/button";
import { GrCart } from "react-icons/gr";
import { BsFillCreditCard2BackFill } from "react-icons/bs";
import { useSession, signIn } from "next-auth/react";
import { makeSerializable } from "../../lib/util";
import { usePageLoading } from "../../lib/usePageLoading";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";

function productId({ product }) {
	const session = useSession();
	const { isPageLoading } = usePageLoading();

	const [currentImage, setCurrentImage] = useState(0);
	const [isViewerOpen, setIsViewerOpen] = useState(false);

	const router = useRouter();

	if(!session.data) {
		signIn();
	}
	const openImageViewer = useCallback((index) => {
		setCurrentImage(index);
		setIsViewerOpen(true);
	}, []);

	const closeImageViewer = () => {
		setCurrentImage(0);
		setIsViewerOpen(false);
	};

	const cartHandler = async () => {
		// handle add to cart
		const res = await fetch("/api/cart", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				productId: product.id,
				quantity: 1,
			}),
		});

		if (!res.ok) {
			alert("Error adding to cart");
		} else {
			await res.json();
		}
	};

	if (isPageLoading) return <Loading />

	return (
		<>
			<BackButton />
			<LoginHeader />

			<div className="h-[80vh] grid place-items-center">
				{product && (
					<div className="grid md:grid-cols-2">
						<div className="flex justify-center flex-wrap gap-2 animate__animated animate__fadeInUp">
							{product?.image?.map(
								(src, index) =>
									src &&
									index === 0 && (
										<Image
											src={src}
											className="object-contain"
											onClick={() => openImageViewer(index)}
											width={350}
											height={50}
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
						<div className="md:w-3/4 mx-auto md:py-20 cursor-default">
							<h1 className="text-2xl text-left">{product.name}</h1>
							<p>By {product.startup.name}</p>
							{product.category && (
								<>
									<p className="font-light text-left cursor-default">
										{product.category.map((item) => item.name).join(", ")}
									</p>
								</>
							)}
							<p className="font-medium text-left mt-2 break-all">
								{product.description}
							</p>
							<p
								className="text-left mt-2 break-all cursor-pointer"
								onClick={() => {
									router.push(`/user/startup/${product.startup.id}`);
								}}
							>
								Startup - {product.startup.name}
							</p>
							<p className="font-bold text-xl text-left mt-2">
								₹{product.price}
							</p>
							<div className="flex">
								<button
									className="mt-4 bg-gray-800 hover:bg-gray-700 rounded-md text-slate-200 p-4"
									onClick={cartHandler}
								>
									{/* {added ? "Added to cart" : "Add to cart"} */}
									Add to cart
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

export async function getServerSideProps(context) {
	const { productId } = context.query;
	const res = await fetch(
		`${process.env.NEXT_APP_URL}/api/products/${productId}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: context.req.headers.cookie,
			},
		}
	);
	const product = await res.json();
	return {
		props: {
			product: makeSerializable(product),
		},
	};
}

export default productId;
