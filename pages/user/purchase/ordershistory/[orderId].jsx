import BackButton from "../../../../components/BackButton";
import LoginHeader from "../../../../components/LoginHeader";
import React, { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../../../lib/fetcher";
import { useRouter } from "next/router";
import OrderDetail from "../../../../components/OrderDetail";

function orderId() {
	const router = useRouter();
	const { orderId } = router.query;
	const {
		data: order,
		isLoading,
		error,
	} = useSWR(`/api/order/${orderId}`, fetcher);

	if (error)
		return (
			<div className="flex justify-center items-center h-[50vh]">
				<p className="text-2xl text-red-500">Error loading order</p>
			</div>
		);

	if (isLoading)
		return (
			<div className="flex justify-center items-center h-[50vh]">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
			</div>
		);

	return (
		<>
			<BackButton />
			<LoginHeader />
			<p className="select-none mt-[.5rem] pt-[.5rem] text-3xl cursor-default text-center">
				Order Details
			</p>
			<div className="grid place-items-center min-h-[60vh]">
				<OrderDetail order={order} history={true}/>
			</div>
		</>
	);
}

export default orderId;
