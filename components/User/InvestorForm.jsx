import { FormControl } from "baseui/form-control";
import React, { useState } from "react";
import { Input } from "baseui/input";
import { Select } from "baseui/select";
import { Button, SHAPE } from "baseui/button";
import { useRouter } from "next/router";

const InvestorForm = ({
	user,
	progress,
	setProgress,
	investorRole,
	load,
	setLoad,
	steps,
}) => {
	const router = useRouter();
	const [investorDetails, setInvestorDetails] = useState({
		email: user.email || "",
		panNumber: user.investor?.panNumber || "",
		organizationName: user.investor?.organizationName || "",
		website: user.investor?.website || "",
	});

	const [type, setType] = useState([
		user.investor?.type
			? { label: user.investor.type, id: user.investor.type }
			: { label: "Individual", id: "Individual" },
	]);

	const getProgressIncrement = () => {
		return 100 / steps;
	};

	const handlePrevious = () => {
		// Check if progress is greater than 0 to prevent negative progress values
		if (progress > 0) {
			setProgress(progress - getProgressIncrement());
		}
	};

	const submit3 = async (e) => {
		e.preventDefault();

		const res = await fetch(`/api/users/${user.id}/investor`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...investorDetails, type }),
		});
		if (res.ok) {
			setLoad(false);
			// check if this is the last step
			if (progress + getProgressIncrement() === 100) {
				router.back();
			} else {
				setProgress(progress + getProgressIncrement());
			}
		} else {
			setLoad(false);
			alert("User Details not updated");
		}
	};

	return (
		<form
			className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]"
			onSubmit={(e) => submit3(e)}
		>
			<p className="select-none my-[1rem] py-[1rem] text-2xl cursor-default text-center">
				Fill Investor Details:
			</p>

			<div className="flex flex-wrap justify-around gap-x-4">
				<div className="">
				<FormControl label={() => "Email: "}>
					<Input
						value={investorDetails.email}
						onChange={(e) => {
							setInvestorDetails({
								...investorDetails,
								email: e.target.value,
							});
						}}
						placeholder="investor@gmail.com"
						autoFocus
						clearable
						required
						clearOnEscape
						disabled={!investorRole}
						overrides={{
							Root: {
								style: ({ $theme }) => ({ width: "18rem" }),
							},
						}}
					/>
				</FormControl>

				<FormControl
					label={() => "Personal PAN Card Number: "}
					caption={() =>
						"10-digit alphanumeric code issued by the Income Tax Department of India"
					}
				>
					<Input
						value={investorDetails.panNumber}
						onChange={(e) => {
							setInvestorDetails({
								...investorDetails,
								panNumber: e.target.value,
							});
						}}
						placeholder="XXXXXXXXXX"
						pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
						clearable
						disabled={!investorRole}
						required
						clearOnEscape
						overrides={{
							Root: {
								style: ({ $theme }) => ({ width: "18rem" }),
							},
						}}
					/>
				</FormControl>
				</div>
				<div>
				<FormControl label={() => "Investor Type: "}>
					<Select
						options={[
							{ label: "Individual", id: "Individual" },
							{ label: "Angel", id: "Angel" },
							{ label: "Venture Capitalist", id: "Venture Capitalist" },
						]}
						value={type}
						onChange={(params) => {
							setType(params.value);
						}}
						disabled={!investorRole}
						required
						clearable
						clearOnEscape
						overrides={{
							Root: {
								style: ({ $theme }) => ({ width: "18rem" }),
							},
						}}
					/>
				</FormControl>

				{type[0].id === "Venture Capitalist" && (
					<FormControl label={() => "Organization Name: "}>
						<Input
							value={investorDetails.organizationName}
							onChange={(e) => {
								setInvestorDetails({
									...investorDetails,
									organizationName: e.target.value,
								});
							}}
							placeholder="Eg. Infotech Solutions"
							autoFocus
							clearable
							required
							clearOnEscape
							disabled={!investorRole}
							overrides={{
								Root: {
									style: ({ $theme }) => ({ width: "18rem" }),
								},
							}}
						/>
					</FormControl>
				)}
				
				<FormControl label={() => "Website: "}>
					<Input
						value={investorDetails.website}
						onChange={(e) => {
							setInvestorDetails({
								...investorDetails,
								website: e.target.value,
							});
						}}
						placeholder="Eg. www.infotech.com"
						autoFocus
						clearable
						required
						clearOnEscape
						disabled={!investorRole}
						overrides={{
							Root: {
								style: ({ $theme }) => ({ width: "18rem" }),
							},
						}}
					/>
				</FormControl>
				</div>
			</div>

			<div className="flex justify-center gap-4 grid-cols-2 flex-wrap  ">
				<Button
					shape={SHAPE.pill}
					isLoading={load}
					title="Go Back"
					onClick={handlePrevious}
				>
					Previous
				</Button>
				<Button
					type="Submit"
					shape={SHAPE.pill}
					isLoading={load}
					title="Continue filling the form"
				>
					{progress + getProgressIncrement() === 100 ? "Submit" : "Next"}
				</Button>
			</div>
		</form>
	);
};

export default InvestorForm;
