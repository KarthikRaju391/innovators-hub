import * as React from "react";
import {
  MessageCard,
  IMAGE_LAYOUT,
//   BACKGROUND_COLOR_TYPE
} from "baseui/message-card";
import { useRouter } from "next/router";

function ProductCard(props) {

    const router = useRouter();

    return (
        <MessageCard
      heading={props.data.productName+ " ₹" + props.data.productPrice}
    //   buttonLabel="Call to Action"
      onClick={() => { props.data.url != undefined || props.data.url != null ? router.push(props.data.url) : router.push(router.asPath)}}
      paragraph={ `${props.data.description} | Startup: ${props.data.startupName} | Category: ${props.data.category}`}
      image={{
            src: props.data.image,
            layout: IMAGE_LAYOUT.trailing,
            ariaLabel:
            'Image of the product',
      }}
      overrides={{
        Image: {
          style: ({ $theme }) => ({ width: "20rem" })
        },
        ContentContainer: {
          style: ({ $theme }) => ({
            minHeight: "10rem"
          })
        }
      }}
    //   backgroundColor="auto"
    //   backgroundColorType={BACKGROUND_COLOR_TYPE.light}
    />
    );
}

export default ProductCard;