import formatComments from "../lib/formatComments";
import CommentForm from "./CommentForm";
import ListComments from "./ListComments";

function CommentSection({ comments }) {
    return (
        <>
            <CommentForm />
            {comments && <ListComments comments={formatComments(comments || [])} />}
        </>
    )
}

export default CommentSection;