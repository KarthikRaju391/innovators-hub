 import React, { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { useRouter } from "next/router";

interface UserFormProps {
  user: any;
  progress: number;
  setProgress: (progress: number) => void;
  load: boolean;
  setLoad: (load: boolean) => void;
  steps: number;
}

const UserForm: React.FC<UserFormProps> = ({ user, progress, setProgress, load, setLoad, steps }) => {
	const router = useRouter();
	const [userDetails, setUserDetails] = useState({
		name: user.name ? user.name : "",
		bio: user.bio ? user.bio : "",
		phoneNumber: user.phoneNumber ? user.phoneNumber : "",
		email: user.email ? user.email : "",
		address: user.address
			? user.address
			: {
					street1: "",
					street2: "",
					city: "",
					state: "",
					postalCode: "",
					country: "IN",
			  },
	});

	const [gender, setGender] = useState(user.gender || "Female");
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

	const submit2 = async (e: React.FormEvent) => {
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
				window.location.href = "/user";
			} else {
				setProgress(progress + getProgressIncrement());
				router.replace(router.asPath);
			}
		} else {
			setLoad(false);
			alert("User Details not updated");
		}
	};

	return (
		<form
			className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]"
			onSubmit={submit2}
		>
			<p className="select-none my-[1rem] py-[1rem] text-2xl cursor-default text-center">
				Fill Customer Details:
			</p>
			<div className="flex flex-wrap justify-around gap-x-4">
				<div className="">
					<label>Name: <span className="text-sm text-gray-500">Name as per PAN Card</span></label>
					<Input
						value={userDetails?.name}
						onChange={(e) =>
							setUserDetails({ ...userDetails, name: e.target.value })
						}
						placeholder="Eg. Suresh Kumar"
						autoFocus
						required
						className="w-72"
					/>

					<label>Bio:</label>
					<Textarea
						value={userDetails?.bio}
						onChange={(e) =>
							setUserDetails({ ...userDetails, bio: e.target.value })
						}
						placeholder={`Giving is not just about make a donation, it's about making a difference.`}
					/>

					<label>Phone Number: <span className="text-sm text-gray-500">Phone Number as per PAN Card</span></label>
					<Input
						value={userDetails?.phoneNumber}
						onChange={(e) =>
							setUserDetails({ ...userDetails, phoneNumber: e.target.value })
						}
						placeholder="Eg. 9656732560"
						required
						pattern="((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}"
						type="tel"
						className="w-72"
					/>
					<label>Email:</label>
					<Input
						value={userDetails?.email}
						onChange={(e) =>
							setUserDetails({ ...userDetails, email: e.target.value })
						}
						placeholder="Eg. suresh@gmail.com"
						required
						type="email"
						pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
						className="w-72"
					/>

					<label>Gender:</label>
					<Select value={gender} onValueChange={setGender}>
						<SelectTrigger className="w-72">
							<SelectValue placeholder="Select Gender" />
						</SelectTrigger>
						<SelectContent>
							{genderdrop.map((g) => (
								<SelectItem key={g.id} value={g.id}>
									{g.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="">
					<label>Street 1:</label>
					<Input
						value={userDetails?.address.street1}
						onChange={(e) =>
							setUserDetails({
								...userDetails,
								address: {
									...userDetails.address,
									street1: e.target.value,
								},
							})
						}
						placeholder="Eg. 5071, Koramangala 6th block"
						required
						className="w-72"
					/>

					<label>Street 2:</label>
					<Input
						value={userDetails?.address.street2}
						onChange={(e) =>
							setUserDetails({
								...userDetails,
								address: {
									...userDetails.address,
									street2: e.target.value,
								},
							})
						}
						placeholder="Eg. Kormanagala"
						className="w-72"
					/>
					<label>City:</label>
					<Input
						value={userDetails?.address.city}
						onChange={(e) =>
							setUserDetails({
								...userDetails,
								address: { ...userDetails.address, city: e.target.value },
							})
						}
						placeholder="Eg. Bengaluru"
						required
						className="w-72"
					/>

					<label>State:</label>
					<Input
						value={userDetails?.address.state}
						onChange={(e) =>
							setUserDetails({
								...userDetails,
								address: { ...userDetails.address, state: e.target.value },
							})
						}
						placeholder="Eg. Karnataka"
						required
						className="w-72"
					/>

					<label>Postal Code:</label>
					<Input
						value={userDetails?.address.postalCode}
						onChange={(e) =>
							setUserDetails({
								...userDetails,
								address: {
									...userDetails.address,
									postalCode: e.target.value,
								},
							})
						}
						placeholder="Eg. 560047"
						required
						type="number"
						className="w-72"
					/>

					<label>Country:</label>
					<Input
						value={userDetails?.address.country}
						disabled
						required
						className="w-72"
					/>
				</div>
			</div>

			<div className="flex justify-center gap-4 grid-cols-2 flex-wrap mt-[1rem] pt-[1rem] ">
				<Button
					type="button"
					onClick={handlePrevious}
				>
					Previous
				</Button>
				<Button
					type="submit"
				>
					{progress + getProgressIncrement() === 100 ? "Submit" : "Next"}
				</Button>
			</div>
		</form>
	);
};

export default UserForm;
