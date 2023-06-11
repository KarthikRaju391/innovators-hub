import * as React from "react";
import LoginHeader from "../../../components/LoginHeader";
import BackButton from "../../../components/BackButton";
import { Button, SHAPE } from "baseui/button";
import { useRouter } from "next/router";
import { Checkbox, LABEL_PLACEMENT } from "baseui/checkbox";
import { ProgressBar } from "baseui/progress-bar";
import UserForm from "../../../components/User/UserForm";
import InvestorForm from "../../../components/User/InvestorForm";
import StartupForm from "../../../components/User/StartupForm";
import { getServerSession } from "next-auth";
import { makeSerializable } from "../../../lib/util";
import { authOptions } from "../../api/auth/[...nextauth]";

//gstin: 22ABCDE1234F1Z5
//personal pan: ABCDE1234F
//startup pan:	AVOJB1111K 

function manage({ user }) {
	const router = useRouter();
	const [load, setLoad] = React.useState(false);
	const [progress, setProgress] = React.useState(0);
	const [steps, setSteps] = React.useState(0);
	//set initial value of startupRole & investorRole from get request of const user variable(Eg. user.investorRole), Note: "replace the value present before || (OR) symbol"
	const [startupRole, setStartupRole] = React.useState(
		user.entrepreneur ? true : false
	);
	const [investorRole, setInvestorRole] = React.useState(
		user.investor ? true : false
	);

	React.useEffect(() => {
		if (investorRole && startupRole) {
			setSteps(4);
		} else if (investorRole || startupRole) {
			setSteps(3);
		} else {
			setSteps(2);
		}
	}, [investorRole, startupRole]);

	const handleInvestorRoleChange = async (e) => {
		if (user.investor) {
			// investorRole was true and changing to false
			// make a delete request to delete investor details
			if (
				confirm("Are you sure you want to delete your investor details?") ===
				true
			) {
				const deleted = await fetch(
					`/api/users/${user.id}/investor?${
						startupRole ? "startup=true" : "startup=false"
					}`,
					{
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				await deleted.json();

				setInvestorRole(false);
				router.replace(router.asPath);
			}
		} else {
			// investorRole was false and changing to true
			setInvestorRole(e.target.checked);
		}
	};

	const handleStartupRoleChange = async (e) => {
		if (user.entrepreneur) {
			// investorRole was true and changing to false
			// make a delete request to delete investor details
			if (
				confirm("Are you sure you want to delete your startup details?") ===
				true
			) {
				const deleted = await fetch(
					`/api/users/${user.id}/startup?${
						investorRole ? "investor=true" : "investor=false"
					}`,
					{
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				await deleted.json();

				setStartupRole(false);
				router.replace(router.asPath);
			}
		} else {
			// investorRole was false and changing to true
			setStartupRole(e.target.checked);
		}
	};
	const submit1 = async (e) => {
		e.preventDefault();
		router.replace(router.asPath);
		setProgress(getProgressIncrement());
	};

	const getProgressIncrement = () => {
		return 100 / steps;
	};

	return (
		<>
			<LoginHeader />
			<BackButton />
			<p className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">
				Manage Profile
			</p>
			<ProgressBar value={progress} steps={steps} />
			{progress < getProgressIncrement() && (
				<form
					className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]"
					onSubmit={(e) => submit1(e)}
				>
					<p className="select-none my-[1rem] py-[1rem] text-2xl cursor-default text-center">
						Select User Roles:
					</p>

					<div className="flex justify-center gap-4 grid-cols-2 flex-wrap animate__animated animate__fadeInUp">
						<Checkbox
							title={"Get Access For Purchasing Items"}
							checked={true}
							disabled
							labelPlacement={LABEL_PLACEMENT.bottom}
						>
							{" "}
							Customer{" "}
						</Checkbox>
						<Checkbox
							title={"Get Access For Investing On Projects"}
							checked={investorRole}
							onChange={(e) => handleInvestorRoleChange(e)}
							labelPlacement={LABEL_PLACEMENT.bottom}
						>
							{" "}
							Investor{" "}
						</Checkbox>
						<Checkbox
							title={
								"Get Access For Receiving Investments And Selling Products"
							}
							checked={startupRole}
							onChange={(e) => handleStartupRoleChange(e)}
							labelPlacement={LABEL_PLACEMENT.bottom}
						>
							{" "}
							Entrepreneur{" "}
						</Checkbox>
					</div>

					<div className="flex justify-center mt-[1rem] pt-[1rem] ">
						<Button
							type="Submit"
							shape={SHAPE.pill}
							isLoading={load}
							title="Continue filling the form"
						>
							Next
						</Button>
					</div>
				</form>
			)}

			{progress >= getProgressIncrement() &&
				progress < getProgressIncrement() * 2 &&
				user && (
					<UserForm
						user={user}
						progress={progress}
						setProgress={setProgress}
						load={load}
						setLoad={setLoad}
						steps={steps}
					/>
				)}

			{progress >= getProgressIncrement() * 2 &&
				progress < getProgressIncrement() * 3 &&
				investorRole && (
					<InvestorForm
						user={user}
						progress={progress}
						setProgress={setProgress}
						investorRole={investorRole}
						load={load}
						setLoad={setLoad}
						steps={steps}
					/>
				)}

			{progress >=
				(investorRole
					? getProgressIncrement() * 3
					: getProgressIncrement() * 2) &&
				progress <
					(investorRole
						? getProgressIncrement() * 4
						: getProgressIncrement() * 3) &&
				startupRole && (
					<StartupForm
						user={user}
						progress={progress}
						setProgress={setProgress}
						startupRole={startupRole}
						load={load}
						setLoad={setLoad}
						steps={steps}
					/>
				)}
		</>
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
	const data = await res.json();
	return {
		props: {
			user: makeSerializable(data),
		},
	};
}

export default manage;
