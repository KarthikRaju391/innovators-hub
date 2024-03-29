import BackButton from "../../../../components/BackButton";
import LoginHeader from "../../../../components/LoginHeader";
import Card from "../../../../components/Card";
import useSWR from "swr";
import { fetcher } from "../../../../lib/fetcher";
import Loading from "../../../../components/Loading";
// import { Badge, COLOR } from "baseui/badge";

function investmenthistory() {
	const { data, isLoading } = useSWR(`/api/invest/`, fetcher);

	if (isLoading) return <Loading />;

	return (
		<>
			<BackButton />
			<LoginHeader />
			{data ? (
				<div className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
					<p className="select-none my-[.5rem] py-[.5rem] text-3xl cursor-default text-center">
						Invest Now
					</p>
					<div className="ml-[5%] pl-[5%] flex flex-wrap gap-4 grid-cols-2">
						{data.map((project) => (
							// <Badge content={ i.status || ""} color={ i.status === "Seeding" ? COLOR.accent : COLOR.negative }>
							<Card
								head={project.name || "-"}
								key={project.id}
								para={project.startup.name || "-"}
								url={`/user/investments/invest/${project.id}`}
							/>
							// </Badge>
						))}
					</div>
				</div>
			) : (
				<div className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
					<p className="select-none my-[.5rem] py-[.5rem] text-3xl cursor-default text-center">
						No Projects Yet
					</p>
				</div>
			)}
		</>
	);
}

export default investmenthistory;
