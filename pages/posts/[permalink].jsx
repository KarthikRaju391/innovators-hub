import CommentSection from "../../components/CommentSection";
import PostDetail from "../../components/PostDetail";
import prisma from "../../lib/prisma";
import { makeSerializable } from "../../lib/util";

const Post = ({ post, comments }) => {
    return (
        <div>
            <PostDetail post={post} />
            <CommentSection comments={comments} />
        </div>
    )
}

export async function getStaticPaths() {
    const posts = await prisma.post.findMany();
    const paths = posts.map((post) => ({
        params: { permalink: post.permalink },
    }));

    return { paths, fallback: false };
}

export async function getStaticProps(context) {
    const post = await prisma.post.findUnique({
        where: { permalink: context.params.permalink },
    });

    const comments = await prisma.comment.findMany({
        where: {
            post: {
                permalink: context.params.permalink
            }
        },
        include: {
            user: true
        }
    })

    return {
        props: {
            post: makeSerializable(post),
            comments: makeSerializable(comments)
        }
    }
}

export default Post;