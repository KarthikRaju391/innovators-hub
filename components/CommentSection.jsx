import formatComments from "../lib/formatComments";
import CommentForm from "./CommentForm";
import ListComments from "./ListComments";

function CommentSection({ comments }) {
    return (
        <div>
            <CommentForm />
            {comments && <ListComments comments={formatComments(comments || [])} />}
        </div>
    )
}

export default CommentSection;