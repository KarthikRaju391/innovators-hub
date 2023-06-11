import LoginHeader from "../../../components/LoginHeader";
import * as React from "react";
import { Avatar } from "baseui/avatar";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { makeSerializable } from "../../../lib/util";
import BackButton from "../../../components/BackButton";

function viewprofile({ user }) {
	return (
		<div className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
			<BackButton />
			<LoginHeader />
			<p className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">
				View Profile
			</p>
			<div className="flex flex-col items-center">
				<Avatar name={user.name || ""} size="10rem" src={user.image || ""} />
				<p title="Name" className="animate__animated animate__fadeInUp text-2xl mb-1 cursor-default">{user.name}</p>
				<p title="Bio" className="animate__animated animate__fadeInUp cursor-default mb-1">{user.bio}</p>
				<div className="flex flex-col gap-2 md:flex-row mb-1"> 
					<p title="Phone Number" className="animate__animated animate__fadeInUp cursor-default mx-auto pr-2 md:border-r">{user.phoneNumber}</p>
					<p title="Email ID" className="animate__animated animate__fadeInUp cursor-default mx-auto pr-2 md:border-r">{user.email}</p>
					{user.role.includes("INVESTOR") && <p title="PAN" className="animate__animated animate__fadeInUp cursor-default mx-auto pr-2 md:border-r">{user.panNumber}</p> }
					<p title="Gender" className="animate__animated animate__fadeInUp cursor-default mx-auto">{user.gender}</p>
				</div>
				<p title="Address" className="animate__animated animate__fadeInUp cursor-default">{user.address}</p>
			</div>

			{user.role.includes("ENTREPRENEUR") && (
			<div className="flex flex-col items-center mt-[1rem] pt-[1rem]">
				<p  className="select-none text-2xl cursor-default text-center mb-1">
					Startup Details:
				</p>
				<p title="Startup Name" className="animate__animated animate__fadeInUp text-2xl mb-1 cursor-default">{user.entrepreneur.startup.name}</p>
				<div className="flex flex-col gap-2 md:flex-row mb-1"> 
					<p title="GSTIN" className="animate__animated animate__fadeInUp cursor-default mx-auto pr-2 md:border-r">{user.entrepreneur.startup.gstNumber}</p>
					<p title="Startup PAN" className="animate__animated animate__fadeInUp cursor-default mx-auto">{user.entrepreneur.startup.panNumber}</p>
				</div>
				<p title="Startup Address" className="animate__animated animate__fadeInUp cursor-default">{user.entrepreneur.startup.location}</p>
			</div>)}
		</div>
	);
}

export async function getServerSideProps(context) {
	const session = await getServerSession(context.req, context.res, authOptions);
	const res = await fetch(
		`${process.env.NEXT_APP_URL}/api/users/${session.user.id}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: context.req.headers.cookie,
			},
		}
	);

	const user = await res.json();

	return {
		props: {
			user: makeSerializable(user),
		},
	};
}

export default viewprofile;
{
	/* <p className="select-none my-[1rem] py-[1rem] text-2xl cursor-default text-center">Fill Startup Details:</p> 
	
	<div className="mb-[0rem] pb-[0rem]">
				<p className="select-none my-[1rem] py-[1rem] text-2xl cursor-default text-center">
					Customer Details:
				</p>
				<div className="flex flex-wrap gap-2 grid-cols-2">
					<div
						className="mx-auto animate__animated animate__fadeInUp"
						style={{ width: "18rem" }}
					>
						<FormControl
							label={() => "Name: "}
							caption={() => "Name as per PAN Card"}
						>
							<Input
								value={user.name}
								disabled={true}
								overrides={{
									Root: {
										style: ({ $theme }) => ({ width: "18rem" }),
									},
								}}
							/>
						</FormControl>

						<FormControl label={() => "Bio: "}>
							<Textarea value={user.bio} disabled={true} />
						</FormControl>

						<FormControl
							label={() => "Phone Number: "}
							caption={() => "Phone Number as per PAN Card"}
						>
							<Input
								endEnhancer={
									<div
										className={`${
											user.phoneVerified === true ? "bg-green-700" : "bg-red-700"
										} w-[20px] h-[20px] rounded-full`}
									></div>
								}
								value={user.phoneNumber}
								disabled={true}
								overrides={{
									Root: {
										style: ({ $theme }) => ({ width: "18rem" }),
									},
								}}
							/>
						</FormControl>
					</div>

					<div
						className="mx-auto animate__animated animate__fadeInUp"
						style={{ width: "18rem" }}
					>
						<FormControl label={() => "Email: "}>
							<Input
								endEnhancer={
									<div
										className={`${
											user.emailVerified === true
												? "bg-green-700"
												: "bg-red-700"
										} w-[20px] h-[20px] rounded-full`}
									></div>
								}
								value={user.email}
								disabled={true}
								overrides={{
									Root: {
										style: ({ $theme }) => ({ width: "18rem" }),
									},
								}}
							/>
						</FormControl>
						<FormControl label={() => "Address:"}>
							<Textarea value={user.address} disabled={true} />
						</FormControl>

						<FormControl label={() => "Gender:"}>
							<Input
								value={user.gender}
								disabled={true}
								overrides={{
									Root: {
										style: ({ $theme }) => ({ width: "18rem" }),
									},
								}}
							/>
						</FormControl>
					</div>
				</div>
			</div>
			{user.role.includes("INVESTOR") && (
				<div className="mb-[0rem] pb-[0rem]">
					<p className="select-none my-[1rem] py-[1rem] text-2xl cursor-default text-center">
						Investor Details:
					</p>
					<div className="flex">
						<div
							className="mx-auto animate__animated animate__fadeInUp"
							style={{ width: "18rem" }}
						>
							<FormControl
								label={() => "Personal PAN Card Number: "}
								caption={() =>
									"10-digit alphanumeric code issued by the Income Tax Department of India"
								}
							>
								<Input
									value={user.panNumber}
									endEnhancer={
										<div
											className={`${
												user.panVerified === true
													? "bg-green-700"
													: "bg-red-700"
											} w-[20px] h-[20px] rounded-full`}
										></div>
									}
									clearable
									disabled
									overrides={{
										Root: {
											style: ({ $theme }) => ({ width: "18rem" }),
										},
									}}
								/>
							</FormControl>
						</div>
					</div>
				</div>
			)}

			{user.role.includes("ENTREPRENEUR") && (
				<div className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
					<p className="select-none my-[1rem] py-[1rem] text-2xl cursor-default text-center">
						Startup Details:
					</p>
					<div className="flex flex-wrap gap-2 grid-cols-2">
						<div
							className="mx-auto animate__animated animate__fadeInUp"
							style={{ width: "18rem" }}
						>
							<FormControl label={() => "Startup Name: "}>
								<Input
									value={user.entrepreneur.startup.name}
									disabled
									overrides={{
										Root: {
											style: ({ $theme }) => ({ width: "18rem" }),
										},
									}}
								/>
							</FormControl>

							<FormControl label={() => "Startup Address:"}>
								<Textarea value={user.entrepreneur.startup.location} disabled />
							</FormControl>
						</div>
						<div
							className="mx-auto animate__animated animate__fadeInUp"
							style={{ width: "18rem" }}
						>
							<FormControl
								label={() => "Startup PAN Number: "}
								caption={() =>
									"10-digit alphanumeric code issued by the Income Tax Department of India"
								}
							>
								<Input
									value={user.entrepreneur.startup.panNumber}
									// endEnhancer={
									// 	<div
									// 		className={`${
									// 			user.startupPanNumberVerified === true
									// 				? "bg-green-700"
									// 				: "bg-red-700"
									// 		} w-[20px] h-[20px] rounded-full`}
									// 	></div>
									// }
									disabled
									overrides={{
										Root: {
											style: ({ $theme }) => ({ width: "18rem" }),
										},
									}}
								/>
							</FormControl>

							<FormControl
								label={() => "GSTIN Number: "}
								caption={() =>
									"15-digit alphanumeric code issued by Goods and Services Tax Network of India"
								}
							>
								<Input
									value={user.entrepreneur.startup.gstNumber}
									// endEnhancer={
									// 	<div
									// 		className={`${
									// 			user.gstinVerified === true
									// 				? "bg-green-700"
									// 				: "bg-red-700"
									// 		} w-[20px] h-[20px] rounded-full`}
									// 	></div>
									// }
									disabled
									overrides={{
										Root: {
											style: ({ $theme }) => ({ width: "18rem" }),
										},
									}}
								/>
							</FormControl>
						</div>
					</div>
				</div>
			)}
	*/
}