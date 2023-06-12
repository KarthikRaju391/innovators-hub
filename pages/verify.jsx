import { Input } from "baseui/input";
import Header from "../components/Header";
import { FormControl } from "baseui/form-control";
import { useState } from "react";
import { Button, SHAPE } from "baseui/button";

function verify() {
	const [tnxId, setTnxId] = useState("");
	const [ventureData, setVentureData] = useState({});
	const [load, setLoad] = useState(false);

	const initial = {
		transactionId: "230401-ABC123-3",
		from: "Suraj",
		to: "Karthik",
		date: "12-12-2022",
		time: "15:12:22",
	};

	const submit = async (e) => {
		e.preventDefault();
		setLoad(true);
		const venture = await fetch(`api/transaction/?tnxId=${tnxId}`);
		if (!venture.ok) {
			console.error("Error fetching transaction");
		} else {
			const data = await venture.json();
			setVentureData(data);
		}
		setLoad(false);
		setTnxId("");
	};

	return (
		<>
			<Header />
			<p
				className="select-none my-[1rem] py-[1rem] text-4xl cursor-default text-center"
				style={{ fontFamily: "Syncopate" }}
			>
				Verify Transaction
			</p>

			<form
				onSubmit={(e) => submit(e)}
				className="mb-[2rem] pb-[2rem] grid justify-center"
			>
				<FormControl label={() => "Transaction ID: "}>
					<Input
						value={tnxId}
						onChange={(e) => setTnxId(e.target.value)}
						placeholder="Eg. 230401-ABC123-3"
						pattern="^[A-Za-z0-9_-]{10,30}$"
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

				<Button
					type="Submit"
					shape={SHAPE.pill}
					isLoading={load}
					title="Submit Form"
				>
					Get Transaction Data
				</Button>
			</form>

			{ventureData.venture ? (
				<div className="flex justify-center flex-wrap gap-4 md:gap-12">
					<div>
						<FormControl label={() => "Transaction Amount: "}>
							<p>{ventureData.venture?.amountInvested}</p>
						</FormControl>
					</div>
					<div>
						<FormControl label={() => "From: "}>
							<p>{ventureData.venture?.investor.user.name}</p>
						</FormControl>
					</div>
					<div>
						<FormControl label={() => "To: "}>
							<p>
								{ventureData.venture?.project.startup.entrepreneur.user.name}
							</p>
						</FormControl>
					</div>
					<div>
						<FormControl label={() => "Date: "}>
							<p>
								{new Date(ventureData.createdAt).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</p>
						</FormControl>
					</div>
					<div>
						<FormControl label={() => "Time: "}>
							<p>
								{new Date(ventureData.createdAt).toLocaleTimeString("en-US", {
									hour: "2-digit",
									minute: "2-digit",
									hour12: true,
								})}
							</p>
						</FormControl>
					</div>
				</div>
			) : (<p className="text-center">Enter a transaction ID</p>)}
		</>
	);
}

export default verify;
