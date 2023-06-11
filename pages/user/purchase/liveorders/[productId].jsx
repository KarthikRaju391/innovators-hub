import BackButton from "../../../../components/BackButton";
import LoginHeader from "../../../../components/LoginHeader";
import React, { useState, useCallback } from "react";
import ImageViewer from "react-simple-image-viewer";
import Image from "next/image";
import { Button } from "baseui/button";
import { MdCancelScheduleSend } from "react-icons/md";
import dynamic from "next/dynamic";

const MyAwesomeMap = dynamic(() => import("../../../../components/OrderMap"), {
	ssr: false,
});

function productId() {
	const [currentImage, setCurrentImage] = useState(0);
	const [isViewerOpen, setIsViewerOpen] = useState(false);
	const [load1, setLoad1] = useState(false);

	const openImageViewer = useCallback((index) => {
		setCurrentImage(index);
		setIsViewerOpen(true);
	}, []);

	const closeImageViewer = () => {
		setCurrentImage(0);
		setIsViewerOpen(false);
	};

	const buyHandler = async () => {
		setLoad1(true);
		console.log(data.productId);
		setLoad1(false);
	};

	return (
		<>
			<BackButton />
			<LoginHeader />
            ProductId Page
			{/* <p className="select-none my-[.5rem] py-[.5rem] text-3xl cursor-default text-center">
				{data.productName}
			</p>
			<div className="my-2 py-2 ml-5 pl-5 flex justify-center flex-wrap gap-2 grid-cols-2 animate__animated animate__fadeInUp">
				{data.images.map(
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
								alt=""
							/>
						)
				)}

				{isViewerOpen && (
					<ImageViewer
						src={data.images.filter((el) => el !== undefined)}
						currentIndex={currentImage}
						disableScroll={false}
						closeOnClickOutside={true}
						onClose={closeImageViewer}
					/>
				)}
			</div>

			{data.description && (
				<>
					<p className="mx-10 cursor-default select-none break-all text-center animate__animated animate__fadeInUp">
						<span className="text-xl cursor-default select-none">
							Description:
						</span>{" "}
						<br />
						{data.description}
					</p>
					<br />
				</>
			)}
			<div className="flex gap-2 flex-wrap mb-2 pb-5 justify-center animate__animated animate__fadeInUp">
				{data.build && (
					<>
						<p className="mx-10 cursor-default select-none">
							<span className="text-xl cursor-default select-none">Build:</span>{" "}
							<br />
							{data.build}
						</p>
						<br />
					</>
				)}
				{data.quality && (
					<>
						<p className="mx-10 cursor-default select-none">
							<span className="text-xl cursor-default select-none">
								Quality:
							</span>{" "}
							<br />
							{data.quality}
						</p>
						<br />
					</>
				)}
				{data.productPrice && (
					<>
						<p className="mx-10 cursor-default select-none">
							<span className="text-xl cursor-default select-none">Price:</span>{" "}
							<br /> ₹{data.productPrice}
						</p>
						<br />
					</>
				)}
				{data.category && (
					<>
						<p className="mx-10 cursor-default select-none">
							<span className="text-xl cursor-default select-none">
								Category:
							</span>{" "}
							<br />
							{data.category}
						</p>
						<br />
					</>
				)}
				{data.startupName && (
					<>
						<p className="mx-10 cursor-default select-none">
							<span className="text-xl cursor-default select-none">
								Startup:
							</span>{" "}
							<br />
							{data.startupName}
						</p>
						<br />
					</>
				)}
				{data.lastTranked && (
					<>
						<p className="mx-10 cursor-default select-none">
							<span className="text-xl cursor-default select-none">
								Last Traked At:
							</span>{" "}
							<br />
							{data.lastTranked}
						</p>
						<br />
					</>
				)}

				<span className="mt-2 pt-2 animate__animated animate__fadeInUp">
					<MyAwesomeMap />
				</span>
			</div>

			<div className="flex justify-center gap-5 mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
				<Button
					onClick={buyHandler}
					isLoading={load1}
					overrides={{
						BaseButton: {
							style: ({ $theme }) => ({
								backgroundColor: $theme.colors.negative400,
							}),
						},
					}}
					startEnhancer={
						<MdCancelScheduleSend style={{ fontSize: "1.5rem" }} />
					}
				>
					Cancel Order
				</Button> 
                </div> */}
		</>
	);
}

export default productId;
