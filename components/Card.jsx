import * as React from 'react';
import {
  MessageCard,
  IMAGE_LAYOUT,
  BACKGROUND_COLOR_TYPE,
} from 'baseui/message-card';
import { useRouter } from 'next/router';

function Card(props) {

    const router = useRouter();

    var nowTheme
      if (typeof window !== 'undefined') {
        // Perform localStorage action
        nowTheme = JSON.parse(localStorage.getItem("theme"));
      }

    return (
        <MessageCard
      heading={props.head || ""}
      paragraph={props.para || ""}
      onClick={() => { props.url != undefined || props.url != null ? router.push(props.url) : router.push(router.asPath)}}
    //   image={{
    //     src: hamburger,
    //     layout: IMAGE_LAYOUT.trailing,
    //     ariaLabel:
    //       'A deconstructed hamburger being literally thrown together',
    //   }}
      backgroundColor={ nowTheme === 1 ? "#e2e2e2": "#101010"}
      backgroundColorType={ nowTheme === 1 ? BACKGROUND_COLOR_TYPE.light : BACKGROUND_COLOR_TYPE.dark }
      overrides={{
        Root: {
          style: ({ $theme }) => ({
            width: "18rem",
            borderColor: nowTheme === 1 ? "#e2e2e2": "#101010"
          })
        }
      }}
    />
    );
}

export default Card;