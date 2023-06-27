import * as React from "react";
import Header from "../components/Header";
import SideNavUser from "../components/SideNav/SideNavUser";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { usePageLoading } from "../lib/usePageLoading";
import Loading from "../components/Loading";
import { CgQuote } from "react-icons/cg";

function Home() {
	const [isOpen, setIsOpen] = React.useState(false);
	const [posts, setPosts] = React.useState([]);
	const router = useRouter();
	const { isPageLoading } = usePageLoading();

	var handleOpen = () => {
		setIsOpen(false);
	};

	var openDraw = () => {
		setIsOpen(true);
	};

	const fetchTopStories = async () => {
		// Fetch the top 100 story IDs
		const response = await fetch(
			"https://hacker-news.firebaseio.com/v0/topstories.json"
		);
		const topStoryIds = await response.json();

		// Fetch the details of the top 10 stories
		const top10StoryIds = topStoryIds.slice(0, 10);
		const top10Stories = await Promise.all(
			top10StoryIds.map(async (id) => {
				const storyResponse = await fetch(
					`https://hacker-news.firebaseio.com/v0/item/${id}.json`
				);
				return storyResponse.json();
			})
		);
		setPosts(top10Stories);
	};

	React.useEffect(() => {
		fetchTopStories();
	}, []);

	if (isPageLoading) return <Loading />;

	return (
		<div className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
			<SideNavUser open={isOpen} handleOpen={handleOpen} />
			<Header />
			{/* <button className="text-2xl flex mx-auto" onClick={() => openDraw()}>Sign-In</button> */}
			<p
				className="select-none my-[1rem] py-[1rem] text-4xl cursor-default text-center"
				onClick={() => openDraw()}
				style={{ fontFamily: "Syncopate" }}
			>
				Home
			</p>
			<p className="pl-[15%] font-extrabold tracking-wider text-2xl pt-[.5rem] cursor-default">
				Come and maximize yourself <br /> because when you maximize, we maximize
			</p>
			<br />
			<p className="pl-[15%] mr-[2rem] text-lg font-semibold mb-[2rem] cursor-default">
				Our culture of care extends to our people,
				<br />
				stakeholders, customers and the planet! We do not
				<br /> believe in a one size fits all strategy. Our benefits
				<br />
				and
				<br />
				care policies are driven by empathy and
				<br />
				customized
				<br />
				to the unique needs of individuals . Because
				<br />
				when they and their families are cared for, they
				<br />
				can focus on doing their best work. We put your
				<br />
				hopes, dreams and endeavors first - always.
			</p>
			<hr className="w-[90%] mx-auto mb-[1rem]" />
			<p className="text-3xl text-center cursor-default">
				LATEST TECH NEWS
			</p>
			<div className="w-3/4 mx-auto rounded-lg shadow-md">
				{posts.map((post) => (
					<div className="bg-white p-6">
						<h2 className="text-xl font-bold mb-2">
							<a href={post.url} target="_blank" rel="noopener noreferrer">
								{post.title}
							</a>
						</h2>
						<p className="text-gray-600">Author: {post.by}</p>
					</div>
				))}
			</div>
			{/* <hr className="w-[90%] mx-auto mb-[1rem]" /> */}
			<p className="text-3xl mb-[2rem] mt-4 text-center cursor-default">
				CUSTOMER REVIEWS
			</p>
			<div className="select-none cursor-default mb-[2rem] flex justify-around flex-wrap text-black">
				<div class="box-border bg-white border border-gray-300 px-[2rem] pb-[2rem] mb-[1rem]">
					<CgQuote fontSize={"3rem"} />
					<p className="text-center">
						Great quality, and showed they can <br />
						work through a problem and <br />
						maintain excellent customer service!!
						<br />
					</p>
					<br />
					<p className="text-right pr-[2rem] mt-[1rem]">
						- Susana <br />
						Santos
					</p>
				</div>

				<div className="box-border bg-white border border-gray-300 px-[2rem] pb-[2rem] mb-[1rem]">
					<CgQuote fontSize={"3rem"} />
					<p className="text-center">
						What an amazing shopping <br />
						experience! I tried other jewelers and <br />
						didn't find anything <br />I liked. Thank you so much.
						<br />
					</p>
					<p className="text-right pr-[2rem] mt-[1rem]">
						- Tracy <br />
						Willis
					</p>
				</div>

				<div class="box-border bg-white border border-gray-300 px-[2rem] pb-[2rem] mb-[1rem]">
					<CgQuote fontSize={"3rem"} />
					<p className="text-center">
						Great variety of cuts and amazing <br />
						customer service. Helped to find the <br />
						perfect chair and helped me to <br />
						personalize it a little more.
						<br />
					</p>
					<p className="text-right pr-[2rem] mt-[1rem]">
						- Nico <br />
						Jones
					</p>
				</div>
			</div>
		</div>
	);
}

export default Home;
