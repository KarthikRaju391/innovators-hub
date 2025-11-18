import * as React from 'react';
import { useRouter } from 'next/router';

interface CardProps {
    head: string;
    para: string;
    url?: string;
}

function Card(props: CardProps) {
    const router = useRouter();

    let nowTheme: number | null = null;
    if (typeof window !== 'undefined') {
        const theme = localStorage.getItem("theme");
        if (theme) {
            nowTheme = JSON.parse(theme);
        }
    }

    var head, para;

    props.head.length < 23 ? head = props.head : head = props.head.substr(0,23)+"...";
    props.para.length < 35 ? para = props.para : para = props.para.substr(0,35)+"...";

    const bgColor = nowTheme === 1 ? "#e2e2e2" : "#101010";
    const borderColor = nowTheme === 1 ? "#e2e2e2" : "#101010";

    return (
        <div className="animate__animated animate__fadeInLeft" title={props.head}>
            <div
                onClick={() => { if (props.url) router.push(props.url); else router.push(router.asPath); }}
                style={{
                    width: "18rem",
                    backgroundColor: bgColor,
                    border: `1px solid ${borderColor}`,
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    cursor: "pointer"
                }}
            >
                <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold" }}>{head || ""}</h3>
                <p style={{ margin: "0.5rem 0 0 0" }}>{para || ""}</p>
            </div>
        </div>
    );
}

export default Card;