import LoginHeader from "../../../components/LoginHeader";
import * as React from "react";
import { Input } from "baseui/input";
import { FormControl } from "baseui/form-control";
import { Textarea } from "baseui/textarea";
import { Select } from "baseui/select";
import { Button, SHAPE } from "baseui/button";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth";
import { makeSerializable } from "../../../lib/util";
import { authOptions } from "../../api/auth/[...nextauth]";
import BackButton from "../../../components/BackButton";
import { Checkbox, LABEL_PLACEMENT } from "baseui/checkbox";
import { ProgressBar } from "baseui/progress-bar";
import { useSession } from "next-auth/react";

//gstin: 22ABCDE1234F1Z5
//personal pan: ABCDE1234F
//startup pan: ABCE12345F

function manage({ data }) {
	const router = useRouter();

	const user = { ...data };
	const [name, setName] = React.useState(user.name || "");
	const [bio, setBio] = React.useState(user.bio ? user.bio : "");
	const [phoneNumber, setPhoneNumber] = React.useState(user.phoneNumber || "");
	const [email, setEmail] = React.useState(user.email || "");
	const [address, setAddress] = React.useState(
		user.address ? user.address : ""
	);
	const [gender, setGender] = React.useState([{ id: user?.gender }]); //user.gender ? user.gender : ""
	const [load, setLoad] = React.useState(false);
	//investor details #Note: variable name changed please verify
	const [ppanNumber, setPpanNumber] = React.useState(
		user.panNumber ? user.panNumber : ""
	);
	//startup details
	const [startupPanNumber, setStartuppanNumber] = React.useState(
		user.entrepreneur?.startup.panNumber
			? user.entrepreneur?.startup.panNumber
			: ""
	);
	const [startupName, setStartupName] = React.useState(
		user.entrepreneur?.startup.name || ""
	);
	const [startupAddress, setStartupAddress] = React.useState(
		user.entrepreneur?.startup.location || ""
	);
	const [gstin, setGstin] = React.useState(
		user.entrepreneur?.startup.gstNumber || ""
	);

	//set initial value of startupRole & investorRole from get request of const user variable(Eg. user.investorRole), Note: "replace the value present before || (OR) symbol"
	const [startupRole, setStartupRole] = React.useState(
		user.role.includes("ENTREPRENEUR") || false
	);
	const [investorRole, setInvestorRole] = React.useState(
		user.role.includes("INVESTOR") || false
	);

	const [progress, setProgress] = React.useState(0);

	const genderdrop = [
		{ label: "Male", id: "Male" },
		{ label: "Female", id: "Female" },
		{ label: "Others", id: "Other" },
	];

	const submit1 = async (e) => {
		e.preventDefault();
		setProgress(progress + 25);
		// console.log({type: [`user`, `${investorRole ? "investor" : ""}`, `${startupRole ? "entrepreneur" : ""}`]})
	};

	const submit2 = async (e) => {
		e.preventDefault();
		setProgress(progress + 25);
		// console.log({name, bio, phoneNumber, email, address, gender: gender[0]?.id})
	};

	const submit3 = async (e) => {
		e.preventDefault();
		setProgress(progress + 25);
		// console.log({ppanNumber})
	};

	//replace console.log at line68 with post/put request
	const submit4 = async (e) => {
		console.log(address);
		//submit from here
		e.preventDefault();
		setLoad(true);
		const userData = {
			name,
			bio,
			phoneNumber,
			address,
			ppanNumber,
			gender,
			type: [investorRole, startupRole],
			startupName,
			startupAddress,
			startupPanNumber,
			gstin,
			startupRole,
			investorRole,
		};
		const res = await fetch(`/api/users/${user.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});
		if (!res.ok) {
			setLoad(false);
			return;
		} else {
			setLoad(false);
			router.back();
		}
	};
	return (
		<>
			<LoginHeader />
			<BackButton />
			<h2 className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">
				Manage Profile
			</h2>
			<ProgressBar value={progress} steps={4} />
			{progress < 25 && (
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
							onChange={(e) => setInvestorRole(e.target.checked)}
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
							onChange={(e) => setStartupRole(e.target.checked)}
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

			{progress >= 25 && progress < 50 && (
				<form
					className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]"
					onSubmit={(e) => submit2(e)}
				>
					<p className="select-none my-[1rem] py-[1rem] text-2xl cursor-default text-center">
						Fill Customer Details:
					</p>
					<div className="flex flex-wrap gap-2 grid-cols-2 ">
						<div className="mx-auto" style={{ width: "18rem" }}>
							<FormControl
								label={() => "Name: "}
								caption={() => "Name as per PAN Card"}
							>
								<Input
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Eg. Suresh Kumar"
									pattern="^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$"
									autoFocus
									clearable
									required
									clearOnEscape
									overrides={{
										Root: {
											style: ({ $theme }) => ({ width: "18rem" }),
										},
									}}
								/>
							</FormControl>

							<FormControl label={() => "Bio: "}>
								<Textarea
									value={bio}
									onChange={(e) => setBio(e.target.value)}
									placeholder={`Giving is not just about make a donation, it's about making a difference.`}
									clearOnEscape
								/>
							</FormControl>

							<FormControl
								label={() => "Phone Number: "}
								caption={() => "Phone Number as per PAN Card"}
							>
								<Input
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									placeholder="Eg. 9656732560"
									clearable
									required
									pattern="^[6-9]\d{9}$"
									type="tel"
									clearOnEscape
									overrides={{
										Root: {
											style: ({ $theme }) => ({ width: "18rem" }),
										},
									}}
								/>
							</FormControl>
						</div>

						<div className="mx-auto" style={{ width: "18rem" }}>
							<FormControl label={() => "Email: "}>
								<Input
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Eg. suresh@gmail.com"
									clearable
									required
									type="email"
									pattern='^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
									clearOnEscape
									overrides={{
										Root: {
											style: ({ $theme }) => ({ width: "18rem" }),
										},
									}}
								/>
							</FormControl>

							<FormControl label={() => "Address:"}>
								<Textarea
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									placeholder={`F-17, Jangpura Extn, Delhi 110014, India`}
									clearOnEscape
									required
								/>
							</FormControl>

							<FormControl label={() => "Gender:"}>
								<Select
									options={genderdrop}
									required
									value={gender}
									placeholder="Select Gender"
									onChange={(params) => {
										setGender(params.value[0].id);
									}}
									overrides={{
										ControlContainer: {
											style: ({ $theme }) => ({
												borderRadius: "10px",
												width: "18rem",
											}),
										},
									}}
								/>
							</FormControl>
						</div>
					</div>

					<div className="flex justify-center gap-4 grid-cols-2 flex-wrap mt-[1rem] pt-[1rem] ">
						<Button
							shape={SHAPE.pill}
							isLoading={load}
							title="Go Back"
							onClick={() => setProgress(progress - 25)}
						>
							Previous
						</Button>
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

			{progress >= 50 && progress < 75 && (
				<form
					className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]"
					onSubmit={(e) => submit3(e)}
				>
					<p className="select-none my-[1rem] py-[1rem] text-2xl cursor-default text-center">
						Fill Investor Details:
					</p>

					<div className="grid justify-center">
						<FormControl
							label={() => "Personal PAN Card Number: "}
							caption={() =>
								"10-digit alphanumeric code issued by the Income Tax Department of India"
							}
						>
							<Input
								value={ppanNumber}
								onChange={(e) => setPpanNumber(e.target.value)}
								placeholder="XXXXXXXXXX"
								pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
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

					<div className="flex justify-center gap-4 grid-cols-2 flex-wrap  ">
						<Button
							shape={SHAPE.pill}
							isLoading={load}
							title="Go Back"
							onClick={() => setProgress(progress - 25)}
						>
							Previous
						</Button>
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

			{progress >= 75 && progress < 100 && (
				<form
					className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]"
					onSubmit={(e) => submit4(e)}
				>
					<p className="select-none my-[1rem] py-[1rem] text-2xl cursor-default text-center">
						Fill Startup Details:
					</p>

					<div className="flex flex-wrap gap-2 grid-cols-2">
						<div className="mx-auto" style={{ width: "18rem" }}>
							<FormControl label={() => "Startup Name: "}>
								<Input
									value={startupName}
									onChange={(e) => setStartupName(e.target.value)}
									placeholder="Eg. Infotech Solutions"
									pattern="^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$"
									autoFocus
									clearable
									required
									clearOnEscape
									disabled={!startupRole}
									overrides={{
										Root: {
											style: ({ $theme }) => ({ width: "18rem" }),
										},
									}}
								/>
							</FormControl>

							<FormControl label={() => "Startup Address:"}>
								<Textarea
									value={startupAddress}
									onChange={(e) => setStartupAddress(e.target.value)}
									placeholder={`F-17, Jangpura Extn, Delhi 110014, India`}
									clearOnEscape
									required
									disabled={!startupRole}
								/>
							</FormControl>
						</div>
						<div className="mx-auto" style={{ width: "18rem" }}>
							<FormControl
								label={() => "Startup PAN Number: "}
								caption={() =>
									"10-digit alphanumeric code issued by  the Income Tax Department of India"
								}
							>
								<Input
									value={startupPanNumber}
									onChange={(e) => setStartuppanNumber(e.target.value)}
									placeholder="XXXXXXXXXX"
									pattern="^[A-Z]{4}[0-9]{5}[A-Z]{1}$"
									clearable
									disabled={!startupRole}
									required
									clearOnEscape
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
									value={gstin}
									onChange={(e) => setGstin(e.target.value)}
									placeholder="XXXXXXXXXXXXXXX"
									pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9]{1}$"
									clearable
									disabled={!startupRole}
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
					</div>

					<div className="flex justify-center gap-4 grid-cols-2 flex-wrap  ">
						<Button
							shape={SHAPE.pill}
							isLoading={load}
							title="Go Back"
							onClick={() => setProgress(progress - 25)}
						>
							Previous
						</Button>
						<Button
							type="Submit"
							shape={SHAPE.pill}
							isLoading={load}
							title="Submit Form"
						>
							Submit
						</Button>
					</div>
				</form>
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
			data: makeSerializable(data),
		},
	};
}

export default manage;
//<div className="bg-red-700 w-[20px] h-[20px] rounded-full"></div>
