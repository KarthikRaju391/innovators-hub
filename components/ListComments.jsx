import { useState } from "react";
import CommentForm from "./CommentForm";
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

function CommentActions({ commentId, replyCount }) {
    const [replying, setReplying] = useState(false)

    return (
        <>
            <div className="flex gap-2 animate__animated animate__fadeInUp">
                <p>{replyCount}</p>
                <button onClick={() => setReplying(prev => !prev)}>Reply</button>
            </div>

            {replying && <CommentForm parentId={commentId} />}
        </>
    )
}

function Comment({ comment }) {
    
    const html = md.render(comment.body);

    return (
            <div className=" my-2 mx-4 py-2 animate__animated animate__fadeInUp">
                <div>
                    <h1>{comment.user.name}<span> | {new Date(comment.createdAt).toDateString()}</span></h1>
                    {/* <Markdown>{comment.body}</Markdown> */}
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                </div>
                <CommentActions commentId={comment.id} replyCount={comment.children.length} />

                <div className="ml-2">
                    {comment.children && comment.children.length > 0 && <ListComments comments={comment.children} />}
                </div>
            </div>
    )
}

const ListComments = ({ comments }) => {

    return (
        <div className="flex justify-center ">
            <div className="mx-2 border-l-4 border-cyan-700 mt-2">
                {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    )
}

export default ListComments;