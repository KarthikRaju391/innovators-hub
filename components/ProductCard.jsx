// import * as React from "react";
// import {
// 	MessageCard,
// 	IMAGE_LAYOUT,
// 	//   BACKGROUND_COLOR_TYPE
// } from "baseui/message-card";
import { useRouter } from "next/router";
import { useState } from "react";

// {
// 	image: [],
// 	productName: "3",
// 	productId: "3",
// 	productPrice: "58",
// 	// url: "/user/purchase/cart/9",
// 	description:
// 		"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
// 	startupName: "E Raja",
// 	category: "andar tho aaja",
// },

function ProductCard(props) {

	const [showInfo, setShowInfo] = useState(false);
	const router = useRouter();
	// console.log(props)
	return (
		<div className="animate__animated animate__fadeInLeft">
			<div className="bg-white shadow-lg rounded-lg overflow-hidden w-[341px] ">
				<div
					className="relative cursor-pointer flex-grow-0 w-341 h-192 w-full"
					onMouseEnter={() => setShowInfo(true)}
					onMouseLeave={() => setShowInfo(false)}
					>
					<img
					className="h-[192px] w-[341px] object-contain"
					src={props?.data?.image && props?.data?.image[0]}
					alt="Product Image"
					/>
					<div className="absolute top-0 right-0 m-4">
					</div>
					{showInfo && (
					<div className="absolute inset-0 bg-violet-200 bg-opacity-90 flex justify-center items-center">
						<div className="p-4 max-w-md w-full">
							<p className="text-gray-700 font-semibold text-center text-lg break-all">Startup: {props.data.startup.name}</p>
							<p className="text-gray-700 mb-2 truncate text-center break-all">Category: {props.data.category .map((item) => item.name) .join(", ")}</p>
							<p className="text-gray-700 text-center break-all"> {props.data.description.length > 189 ? props.data.description.substr(0,202)+"..." : props.data.description }</p>
						</div>
					</div>
					)}
				</div>
				<div className="p-4 flex flex-col flex-grow h-[130px]">
					<div className="flex gap-4 justify-between h-[63px]">
					<h3 className="font-semibold text-xl mb-2 text-black overflow-hidden break-all">
					{props.data.name}
					</h3>
					<p className="text-gray-700 text-lg mb-4">{"₹ " + props.data.price}</p>
					</div>
					<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
						onClick={() => {
							props.url != undefined || props.url != null
							? router.push(props.url)
							: router.push(router.asPath);
						}}>
					View Details
					</button>
				</div>
			</div>
		</div>
	);
}

export default ProductCard;
