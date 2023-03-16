import BackButton from "./BackButton";
import LoginHeader from "./LoginHeader";

const PostDetail = ({ post }) => {
    return (
        <>
            <BackButton/>
            <LoginHeader/>
            <h1 className="text-center cursor-default text-2xl">{post.title}</h1>
            <p className="text-center cursor-default mb-[2rem] text-lg">{post.body}</p>
        </>
    );
}

export default PostDetail;
