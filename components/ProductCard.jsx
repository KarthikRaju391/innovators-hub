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
      onClick={() => { props.url != undefined || props.url != null ? router.push(props.url) : router.push(router.asPath)}}
      paragraph={ `${props.data.description} | Startup: ${props.data.startupName} | Category: ${props.data.category}`}
      image={{
            src: props?.data?.image && props?.data?.image[0] ,
            layout: IMAGE_LAYOUT.top,
            ariaLabel:
            'Image of the product',
      }}
      overrides={{
        // Image: {
        //   style: ({ $theme }) => ({ width: "20rem" })
        // },
        ContentContainer: {
          style: ({ $theme }) => ({
            minHeight: "10rem",
            
          })
        },
        Root: {
          style: ({ $theme }) => ({
            width: "20rem"
          })
        }
      }}
    //   backgroundColor="auto"
    //   backgroundColorType={BACKGROUND_COLOR_TYPE.light}
    />
    );
}

export default ProductCard;