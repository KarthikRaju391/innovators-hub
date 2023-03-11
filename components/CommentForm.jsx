import { useRouter } from "next/router"
import { useState } from "react";

const CommentForm = ({ parentId = null }) => {
    const router = useRouter();
    const [body, setBody] = useState("");
    const permalink = router.query.permalink;

    const handleSubmit = async (e) => {
        e.preventDefault();
        let payload = {}
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
            router.replace(router.asPath)
        }
    }

    return (
        <div>
            <form className="" onSubmit={(e) => handleSubmit(e)}>
                <textarea className="border-2 border-gray-500" required name="comment" id="comment" cols="30"
                    placeholder="Write your comment here..."
                    onChange={(e) => { setBody(e.target.value) }}
                ></textarea>
                <button className="border-2 border-gray-800" type="submit">
                    {parentId ? "Post Reply" : "Post Comment"}
                </button>
            </form>
        </div>
    )
}

export default CommentForm