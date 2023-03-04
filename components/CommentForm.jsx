import { useRouter } from "next/router"
import { useState } from "react";

// let parentId be null by default
// if it is null, then we know that the comment is a top level comment
// if it is not null, then we know that the comment is a reply to another comment
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
        const data = await res.json();
        console.log(data);
    }

    return (
        <div>
            <form className="" onSubmit={(e) => handleSubmit(e)}>
                <textarea className="border-2 border-gray-500" required name="comment" id="comment" cols="30" rows="10"
                    placeholder="Write your comment here..."
                    onChange={(e) => { setBody(e.target.value) }}
                ></textarea>
                <button className="border-2 border-gray-800" type="submit">
                    {parentId ? "Reply" : "Comment"}
                </button>
            </form>
        </div>
    )
}

export default CommentForm