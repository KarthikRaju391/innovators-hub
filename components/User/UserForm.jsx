import { FormControl } from "baseui/form-control";
import React, { useContext, useState } from "react";
import { Input } from "baseui/input";
import { Textarea } from "baseui/textarea";
import { Select } from "baseui/select";
import { Button, SHAPE } from "baseui/button";
import { useRouter } from "next/router";

const UserForm = ({ user, progress, setProgress, load, setLoad, steps }) => {
	const router = useRouter();
	const [userDetails, setUserDetails] = useState({
		name: user.name ? user.name : "",
		bio: user.bio ? user.bio : "",
		phoneNumber: user.phoneNumber ? user.phoneNumber : "",
		email: user.email ? user.email : "",
		address: user.address ? user.address : "",
	});

	const [gender, setGender] = useState([
		user.gender
			? { label: user.gender, id: user.gender }
			: { label: "Female", id: "Female" },
	]);
	const genderdrop = [
		{ label: "Male", id: "Male" },
		{ label: "Female", id: "Female" },
		{ label: "Other", id: "Other" },
	];

	const getProgressIncrement = () => {
		return 100 / steps;
	};

	const handlePrevious = () => {
		// Check if progress is greater than 0 to prevent negative progress values
		if (progress > 0) {
			setProgress(progress - getProgressIncrement());
		}
	};

	const submit2 = async (e) => {
		e.preventDefault();
		const res = await fetch(`/api/users/${user.id}/`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...userDetails, gender }),
		});
		if (res.ok) {
			setLoad(false);
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
							value={userDetails?.name}
							onChange={(e) =>
								setUserDetails({ ...userDetails, name: e.target.value })
							}
							placeholder="Eg. Suresh Kumar"
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
							value={userDetails?.bio}
							onChange={(e) =>
								setUserDetails({ ...userDetails, bio: e.target.value })
							}
							placeholder={`Giving is not just about make a donation, it's about making a difference.`}
							clearOnEscape
						/>
					</FormControl>

					<FormControl
						label={() => "Phone Number: "}
						caption={() => "Phone Number as per PAN Card"}
					>
						<Input
							value={userDetails?.phoneNumber}
							onChange={(e) =>
								setUserDetails({ ...userDetails, phoneNumber: e.target.value })
							}
							placeholder="Eg. 9656732560"
							clearable
							required
							pattern="((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}"
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
							value={userDetails?.email}
							onChange={(e) =>
								setUserDetails({ ...userDetails, email: e.target.value })
							}
							placeholder="Eg. suresh@gmail.com"
							clearable
							required
							type="email"
							pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
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
							value={userDetails?.address}
							onChange={(e) =>
								setUserDetails({ ...userDetails, address: e.target.value })
							}
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
								setGender(params.value);
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

export default UserForm;
