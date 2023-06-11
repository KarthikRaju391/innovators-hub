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

      var head, para;

      props.head.length < 23 ? head = props.head : head = props.head.substr(0,23)+"..."
      props.para.length < 35 ? para = props.para : para = props.para.substr(0,35)+"..."
    return (
      <div className = "animate__animated animate__fadeInLeft" title={props.head}>
        <MessageCard
          heading={head || ""}
          paragraph={para || ""}
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
    </div>
    );
}

export default Card;