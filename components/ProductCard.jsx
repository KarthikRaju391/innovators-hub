import * as React from "react";
import {
	MessageCard,
	IMAGE_LAYOUT,
	//   BACKGROUND_COLOR_TYPE
} from "baseui/message-card";
import { useRouter } from "next/router";

function ProductCard(props) {
	const router = useRouter();
	console.log(props)
	return (
		<div className="animate__animated animate__fadeInLeft">
			<MessageCard
				heading={props.data.name + " ₹" + props.data.price}
				onClick={() => {
					props.url != undefined || props.url != null
						? router.push(props.url)
						: router.push(router.asPath);
				}}
				paragraph={`${props.data.description} | Startup: ${
					props.data.startup.name
				} | Category: ${props.data.category
					.map((item) => item.name)
					.join(", ")}`}
				image={{
					src: props?.data?.image && props?.data?.image[0],
					layout: IMAGE_LAYOUT.top,
					ariaLabel: "Image of the product",
				}}
				overrides={{
					ContentContainer: {
						style: ({ $theme }) => ({
							minHeight: "10rem",
						}),
					},
					Root: {
						style: ({ $theme }) => ({
							width: "20rem",
						}),
					},
				}}
			/>
		</div>
	);
}

export default ProductCard;
