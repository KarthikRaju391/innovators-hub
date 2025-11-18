import CommentSection from "../../components/CommentSection";
import PostDetail from "../../components/PostDetail";
import { makeSerializable } from "../../lib/utils";
import { db } from '@/lib/db';
import { discussions, comments as commentTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const Post = ({ post, comments }: { post: any, comments: any[] }) => {
    return (
        <div>
            <PostDetail post={post} />
            <CommentSection comments={comments} />
        </div>
    )
}

export async function getStaticPaths() {
    const posts = await db.select({ id: discussions.id }).from(discussions);
    const paths = posts.map((post) => ({
        params: { permalink: post.id },
    }));
    return { paths, fallback: false };
}

export async function getStaticProps(context: any) {
    const permalink = context.params.permalink as string;

    const post = await db.select().from(discussions).where(eq(discussions.id, permalink)).limit(1);

    const postComments = await db.select().from(commentTable).where(eq(commentTable.discussionId, permalink)).orderBy(commentTable.createdAt);

    return {
        props: {
            post: makeSerializable(post[0] || null),
            comments: makeSerializable(postComments)
        }
    }
}

export default Post;