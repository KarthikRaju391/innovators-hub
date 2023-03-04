// make a page to show a list of posts
// and a page for each post
import prisma from "../../lib/prisma";
import Link from "next/link";
import { makeSerializable } from "../../lib/util";

const Posts = ({ posts }) => {
    return (
        <div>
            <h1>Posts</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <Link href={`/posts/${post.permalink}`}>
                            {post.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export const getServerSideProps = async () => {
    const posts = await prisma.post.findMany();
    return {
        props: { posts: makeSerializable(posts) }
    };
}

export default Posts;