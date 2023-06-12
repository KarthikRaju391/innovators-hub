import { useState } from "react";
import BackButton from "../../../../components/BackButton";
import LoginHeader from "../../../../components/LoginHeader";
import ProductCard from "../../../../components/ProductCard";
import { makeSerializable } from "../../../../lib/util";
import { getSession, useSession } from "next-auth/react";
import { Button } from "baseui/button";
import { MdKeyboardArrowDown } from "react-icons/md";

function Products({ products, initialCursor }) {
	const { data: session } = useSession();
	const [cursor, setCursor] = useState(initialCursor);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [isAllLoaded, setIsAllLoaded] = useState(false);
	const [loadedProducts, setLoadedProducts] = useState(products);

	const loadMoreProducts = async () => {
		if (isLoadingMore || isAllLoaded) return;

		setIsLoadingMore(true);

		const res = await fetch(
			`/api/startup/${session?.user.startupId}/products?cursor=${cursor}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const data = await res.json();

		setCursor(data.cursor);

		if (data.products.length === 0) {
			setIsAllLoaded(true);
		} else {
			setLoadedProducts([...loadedProducts, ...data.products]);
		}

		setIsLoadingMore(false);
	};

	return (
		<>
			<BackButton />
			<LoginHeader />
			<p className="select-none my-[.5rem] py-[.5rem] text-3xl cursor-default text-center">
				Our Products
			</p>
			<div className="flex justify-center flex-wrap gap-4 grid-cols-2">
				{loadedProducts.map((product) => (
					<ProductCard
						key={product.id}
						data={product}
						url={`/user/startup/sellproducts/${product.id}`}
					/>
				))}
			</div>
			{!isAllLoaded && loadedProducts.length > 0 && (
				<div className="flex mt-4 justify-center">
					<Button
						size="mini"
						onClick={loadMoreProducts}
						disabled={isLoadingMore}
						overrides={{
							BaseButton: {
								style: ({ $theme }) => ({
									borderRadius: $theme.sizing.scale600,
								}),
							},
						}}
						startEnhancer={
							<MdKeyboardArrowDown style={{ fontSize: "1.5rem" }} />
						}
					>
						{isLoadingMore ? "Loading..." : "Load More"}
					</Button>
				</div>
			)}
		</>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	const res = await fetch(
		`${process.env.NEXT_APP_URL}/api/startup/${session.user.startupId}/products`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: context.req.headers.cookie,
			},
		}
	);

	const data = await res.json();

	return {
		props: {
			products: makeSerializable(data.products),
			initialCursor: makeSerializable(data.cursor),
		},
	};
}

export default Products;
