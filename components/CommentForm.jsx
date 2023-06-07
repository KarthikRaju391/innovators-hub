import { useRouter } from "next/router"
import { useState } from "react";
import { Textarea } from "baseui/textarea";
import { Button, SHAPE } from "baseui/button";
import {useSession, signIn} from 'next-auth/react';

const CommentForm = ({ parentId = null }) => {
    const session = useSession()
    const router = useRouter();
    const [body, setBody] = useState("");
    const permalink = router.query.permalink;

    function refreshData() {
        router.replace(router.asPath)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let payload = {}
        if(session.data){
        if (parentId) {
            payload = {
                permalink,
                body,
                parentId
            }
        } else {
            payload = {
                permalink,
                body
            }
        }

        const res = await fetch("/api/addComment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })

        if (res.status === 200) {
                setBody("");
                refreshData();
        }
    }
    else signIn()
    }

    return (
            <form className="" onSubmit={(e) => handleSubmit(e)}>
                <div className="mx-4 my-3">
                    <Textarea value={body} required name="comment" id="comment" onChange={e => setBody(e.target.value)} placeholder="Write your comment here..." clearOnEscape />
                </div> 
                {/* w-[18rem] md:w-[22rem] */}
                <div className="mx-4"><Button type="submit" shape={SHAPE.pill} > {parentId ? "Post Reply" : "Post Comment"} </Button></div>
            </form>
    )
}

export default CommentForm