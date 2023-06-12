import { Badge, COLOR } from "baseui/badge";
import BackButton from "../../../components/BackButton";
import LoginHeader from "../../../components/LoginHeader";
import ProductCard from "../../../components/ProductCard";
import Card from "../../../components/Card";
import { useState } from "react";
import { makeSerializable } from "../../../lib/util";

function startupId({ startup }) {
	return (
		<>
			<LoginHeader />
			<BackButton />
			<p className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">
				{startup.name}
			</p>

			<div className="mb-[2rem]">
				<h3 className="text-2xl text-center cursor-default font-semibold">
					About
				</h3>
				{(startup.description !== "" ||
					startup.description != undefined ||
					startup.description != null) && (
					<p className="cursor-default text-center break-all">
						{startup.description}
					</p>
				)}
				{(startup.businessType !== "" ||
					startup.businessType != undefined ||
					startup.businessType != null) && (
					<p className="cursor-default text-center break-all">
						Business Type: {startup.businessType}
					</p>
				)}
				{(startup.businessCategory !== "" ||
					startup.businessCategory != undefined ||
					startup.businessCategory != null) && (
					<p className="cursor-default text-center break-all">
						Business Category: {startup.businessCategory}
					</p>
				)}
				{(startup.businessSubCategory !== "" ||
					startup.businessSubCategory != undefined ||
					startup.businessSubCategory != null) && (
					<p className="cursor-default text-center break-all">
						Sub Category: {startup.businessSubCategory}
					</p>
				)}
				{(startup.gstNumber !== "" ||
					startup.gstNumber != undefined ||
					startup.gstNumber != null) && (
					<p className="cursor-default text-center break-all">
						GSTIN: {startup.gstNumber}
					</p>
				)}
			</div>

			{startup.project.length > 0 && (
				<>
					{" "}
					<hr className="w-[90%] mx-auto mb-[1rem]" />
					<div className="mb-[2rem] w-[90%] mx-auto">
						<h3 className="text-2xl cursor-default text-center font-semibold mb-4">
							Our Projects
						</h3>
						<div className="ml-[5%] pl-[5%] flex flex-wrap gap-4 grid-cols-2">
							{startup.project.map((i) => (
								// <Badge
								// 	content={i.status || ""}
								// 	color={i.status === "Seeding" ? COLOR.accent : COLOR.negative}
								// >
								<Card
									head={i.name || "-"}
									key={i.projectId}
									para={startup.name || "-"}
									url={`/user/investments/invest/${i.projectId}`}
								/>
								// </Badge>
							))}
						</div>
					</div>
				</>
			)}

			{startup.products.length > 0 && (
				<>
					{" "}
					<hr className="w-[90%] mx-auto mb-[1rem]" />
					<div className="mb-[2rem]">
						<h3 className="text-2xl cursor-default ml-[20%] font-semibold mb-4">
							Our Products:
						</h3>
						<div className="flex justify-center flex-wrap gap-4 grid-cols-2">
							{startup.products.map((product) => (
								<ProductCard
									key={product.id}
									data={product}
									url={`/products/${product.id}`}
								/>
							))}
						</div>
					</div>
				</>
			)}

			{/* {team.length > 0 && (
				<>
					{" "}
					<hr className="w-[90%] mx-auto mb-[1rem]" />
					<div className="mb-[1rem] pb-[1rem] ">
						<h3 className="text-2xl cursor-default ml-[20%] font-semibold mb-4">
							Our Team:
						</h3>
						<div className="ml-[5%] pl-[5%] flex flex-wrap ">
							{team.map((e, i) => (
								<p className="cursor-default break-all">{`${
									i !== 0 ? "," : ""
								} ${e.trim()}`}</p>
							))}
						</div>
					</div>
				</>
			)} */}
			<div className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]" />
		</>
	);
}

export default startupId;

export async function getServerSideProps(context) {
	const { startupId } = context.query;

	const res = await fetch(
		`${process.env.NEXT_APP_URL}/api/startup/${startupId}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: context.req.headers.cookie,
			},
		}
	);

	const startup = await res.json();

	return {
		props: {
			startup: makeSerializable(startup),
		},
	};
}
