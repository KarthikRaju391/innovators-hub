import BackButton from "../../../../components/BackButton";
import LoginHeader from "../../../../components/LoginHeader";
import ProductCard from "../../../../components/ProductCard";
import { makeSerializable } from "../../../../lib/util";

function Products() {
	// show orders that are still "PENDING" or "COLLECTED"
    // Fetch after order is created.
	const [cursor, setCursor] = useState(initialCursor);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [isAllLoaded, setIsAllLoaded] = useState(false);
	const [loadedProducts, setLoadedProducts] = useState(products);

	const loadMoreProducts = async () => {
		if (isLoadingMore || isAllLoaded) return;
		setIsLoadingMore(true);

		const res = await fetch(`/api/products?cursor=${cursor}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await res.json();

		setCursor(data.cursor);

		if (data.products.length === 0) {
			setIsAllLoaded(true);
		} else {
			setLoadedProducts([...loadedProducts, ...data.products]);
		}

		setIsLoadingMore(false);
	};

	const loadMore = () => {
		console.log("Load More...");
	};

	return (
		<>
			<BackButton />
			<LoginHeader />
			<h2 className="select-none my-[.5rem] py-[.5rem] text-3xl cursor-default text-center">
				Live Orders
			</h2>
			<div className="flex justify-center flex-wrap gap-4 grid-cols-2">
				{data.map((i) => (
					<ProductCard
						key={i.productId}
						data={i}
						url={`/user/purchase/liveorders/${i.productId}`}
					/>
				))}
			</div>
			<p
				onClick={loadMore}
				className="select-none cursor-pointer mt-2 pt-2 text-center mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]"
			>
				Load More...
			</p>
		</>
	);
}

export async function getServerSideProps(context) {
	const res = await fetch(`${process.env.NEXT_APP_URL}/api/products/`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Cookie: context.req.headers.cookie,
		},
	});

	const data = await res.json();

	return {
		props: {
			products: makeSerializable(data.products),
			initialCursor: makeSerializable(data.cursor),
		},
	};
}

export default Products;
