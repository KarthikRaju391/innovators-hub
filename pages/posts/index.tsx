import { makeSerializable } from "../../lib/utils";
import BackButton from "../../components/BackButton";
import LoginHeader from "../../components/LoginHeader";
import Card from "../../components/Card";
import AddPost from "../../components/AddPost";
import { db } from '@/lib/db';
import { discussions } from '@/lib/db/schema';

const Posts = ({ posts }: { posts: any[] }) => {
	return (
		<>
			<BackButton />
			<LoginHeader />
			
			<div className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
				<p className="select-none my-[.5rem] py-[.5rem] text-3xl cursor-default text-center">
					Innovators' Social Network
				</p>
				{/* <AddPost /> */} <hr className="w-[90%] mx-auto "/><br/>
				<div className="ml-[5%] pl-[5%] flex flex-wrap gap-4 grid-cols-2">
					{posts.map((post) => (
						<Card
							head={post.title}
							key={post.id}
							para={post.content}
							url={`/posts/${post.id}`}
						/>
					))}
				</div>
			</div>
		</>
	);
};

export const getServerSideProps = async () => {
	const posts = await db.select().from(discussions);
	return {
		props: { posts: makeSerializable(posts) },
	};
};

export default Posts;
