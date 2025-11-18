import React from "react";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { useRouter } from "next/router";
import Loading from "./Loading";
import EmailAutocomplete from "./EmailAutoComplete";

interface Props {
	closeOpen: () => void;
}

function AccessForm({ closeOpen }: Props) {
	// handle POST request to set access
	const [allowEmail, setAllowEmail] = React.useState("");
	const [access, setAccess] = React.useState<any[]>([]);
	const [load, setLoad] = React.useState(false);
	const router = useRouter();

	const assignHandleSubmit = async (e: React.FormEvent) => {
		//submit Allot Access form from here
		e.preventDefault();
		setLoad(true);
		const res = await fetch(`/api/postalService/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email: allowEmail, accessType: access[0]?.id }),
		});
		await res.json();
		router.replace(router.asPath);
		closeOpen();
	};

	const { data: emails, isLoading } = useSWR("/api/users/", fetcher);

	const emailList = emails?.map((email: any) => email.email);

	const accessdrop = [
		{ label: "Edit", id: "Edit" },
		{ label: "View", id: "View" },
	];

	if (isLoading) return <Loading />;

	return (
		<form className="mb-[1rem] pb-[1rem]" onSubmit={assignHandleSubmit}>
			<div className="mx-auto" style={{ width: "18rem" }}>
				<label>Email:</label>
				<EmailAutocomplete emails={emailList} allowEmail={allowEmail} setAllowEmail={setAllowEmail}/>

				<label>Access Type:</label>
				<select
					required
					value={access[0]?.id || ""}
					onChange={(e) => setAccess([{ id: e.target.value, label: accessdrop.find((opt: any) => opt.id === e.target.value)?.label || "" }])}
					className="border rounded px-2 py-1 w-full"
				>
					<option value="">Select Access</option>
					{accessdrop.map((opt: any) => (
						<option key={opt.id} value={opt.id}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			<div className="flex justify-center">
				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded-full"
					disabled={load}
					title="Submit Form"
				>
					{load ? "Loading..." : "Grant Access"}
				</button>
			</div>
		</form>
	);
}

export default AccessForm;
