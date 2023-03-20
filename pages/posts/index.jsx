// make a page to show a list of posts
// and a page for each post
import prisma from "../../lib/prisma";
import { makeSerializable } from "../../lib/util";
import BackButton from "../../components/BackButton";
import LoginHeader from "../../components/LoginHeader";
import Card from "../../components/Card";
import { useState } from "react";
import AddPost from "../../components/AddPost";
import { Button } from "baseui/button";

const Posts = ({ posts }) => {

    // console.log(posts)
    const [isOpen, setIsOpen] = useState(false);
    const closeOpen = () =>{
        setIsOpen(false)
    }

    return (
        <>
            <BackButton/>
            <LoginHeader/>
            <AddPost isOpen={isOpen} closeOpen={closeOpen} />
            <div className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
                <h2 className="select-none my-[.5rem] py-[.5rem] text-3xl cursor-default text-center">Posts</h2>
                <div className="flex justify-center mb-[.5rem] pb-[.5rem]"><Button onClick={() => setIsOpen(true)}>Create Post</Button></div>
                <div className="ml-[5%] pl-[5%] flex flex-wrap gap-4 grid-cols-2">
                    {posts.map((post) => (
                        <Card head={post.title} key={post.id} para={post.body} url={`/posts/${post.permalink}`} />   
                    ))}
                </div>
            </div>
        </>
    );
}

export const getServerSideProps = async () => {
    const posts = await prisma.post.findMany();
    return {
        props: { posts: makeSerializable(posts) }
    };
}

export default Posts;

{/*  line 17
</div>
        <div> 
            <h1></h1>
            <ul> {posts.map((post) => (
            <li key={post.id}>
                        <Link href={`/posts/${post.permalink}`}>  </Link> 
                    </li>)}
                    </ul>*/}