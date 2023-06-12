import BackButton from "../../../../components/BackButton";
import LoginHeader from "../../../../components/LoginHeader";
import React, { useState } from "react";
import ImageViewer from "react-simple-image-viewer";
import Image from "next/image";
import { MdCancelScheduleSend } from "react-icons/md";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { fetcher } from "../../../../lib/fetcher";
import { useRouter } from "next/router";
import OrderDetail from "../../../../components/OrderDetail";
import Loading from "../../../../components/Loading";
import Error from "../../../../components/Error";

const MyAwesomeMap = dynamic(() => import("../../../../components/OrderMap"), {
	ssr: false,
});

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
			<Error />
		);

	if (isLoading)
		return (
			<Loading />	
		);

	return (
		<>
			<BackButton />
			<LoginHeader />
			<p className="select-none mt-[.5rem] pt-[.5rem] text-3xl cursor-default text-center">
				Order Details
			</p>
			<div className="grid place-items-center min-h-screen">
				<OrderDetail order={order} />
				<div className="flex flex-col gap-y-4">
					<h2 className="text-2xl font-semibold">Tracking Order</h2>
					<MyAwesomeMap />
				</div>
			</div>
		</>
	);
}

export default orderId;
