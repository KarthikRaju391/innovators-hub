import BackButton from "../../../../components/BackButton";
import LoginHeader from "../../../../components/LoginHeader";
import { Button } from "baseui/button";
import { Input } from "baseui/input";
import { SiRazorpay } from "react-icons/si";
import { useEffect, useState } from "react";
import { FaHandsHelping } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { Modal, ModalHeader, ModalBody, SIZE, ROLE } from "baseui/modal"; //ModalFooter, ModalButton,
import { FiEdit } from "react-icons/fi";
import { MdOutlineVideoCameraFront } from "react-icons/md";
import DateForm from "../../../../components/DateForm";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "../../../../lib/fetcher";

export default function Invest() {
	const [meetingUrl, setMeetingUrl] = useState("");
	const [paymentSuccess, setPaymentSuccess] = useState(true);
	const [load1, setLoad1] = useState(false);
	const [modal, setModal] = useState(false); //
	const [amount, setAmount] = useState("");
	const [load2, setLoad2] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.async = true;
		document.body.appendChild(script);
	}, []);

	const { projId } = router.query;

	const { data: project, isLoading } = useSWR(`/api/invest/${projId}`, fetcher);

	if (isLoading) return <div>Loading...</div>;

	const closeOpen = () => {
		setIsOpen(false);
	};

	const payHandler = async (e) => {
		e.preventDefault();
		setPaymentSuccess(false);
		// const res = await fetch(`/api/cart/`);
		// const cartData = await res.json();

		setLoad1(true);

		const res = await fetch(`/api/venture/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ contributedAmount: amount, projectId: projId }),
		});
		const ventureRes = await res.json();

		var options = {
			key: process.env.KEY_ID, // Enter the Key ID generated from the Dashboard
			amount: ventureRes.orderCost, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
			currency: "INR",
			name: "Innovators Hub", //your business name
			description: "Test Transaction",
			// image: "https://example.com/your_logo",
			order_id: ventureRes.transaction.razorpayOrderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
			handler: async function (response) {
				// payment success modal

				// venture clear
				// await fetch(`/api/venture/`, {
				// 	method: "DELETE",
				// 	headers: {
				// 		"Content-Type": "application/json",
				// 	},
				// 	body: JSON.stringify(ventureRes.id),
				// });

				const razorpayResponse = {
					ventureId: ventureRes.id,
					razorpay_payment_id: response.razorpay_payment_id,
					razorpay_order_id: response.razorpay_order_id,
					razorpay_signature: response.razorpay_signature,
				};

				const validation = await fetch(`/api/venture/`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(razorpayResponse),
				});

				if (validation) {
					alert("Payment Successful");
					setPaymentSuccess(true);
					// window.location.reload();
				} else {
					alert("Payment Failed");
				}
			},
			prefill: {
				name: session.user.name, //your customer's name
				email: session.user.email, //your customer's email
				contact: session.user.contact, //Provide the customer's phone number for better conversion rates
			},
			theme: {
				color: "#3399cc",
			},
		};

		var rzp1 = new Razorpay(options);
		rzp1.on("payment.failed", async function (response) {
			alert(response.error.code);
			alert(response.error.description);
			alert(response.error.source);
			alert(response.error.step);
			alert(response.error.reason);
			alert(response.error.metadata.order_id);
			alert(response.error.metadata.payment_id);
			await fetch(`/api/venture/`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ventureId: ventureRes.id }),
			});
		});

		rzp1.open();

		setLoad1(false);
		setModal(false);
	};

	const meethandler = async (meetingTime) => {
		setLoad2(true);

		const checkIfAccessTokenExists = async () => {
			const res = await fetch("/api/zoom/getValidToken");
			const data = await res.json();
			return data;
		};

		const accessToken = await checkIfAccessTokenExists();

		if (
			// router.query.authorization === "success" ||
			accessToken.validAccessToken
		) {
			const res = await fetch("/api/zoom/scheduleMeeting", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					projectId: projId,
					investorId: session.user.investorId,
					meetingTime,
					accessToken: accessToken.validAccessToken,
				}),
			});

			const meetUrl = await res.json();
			setMeetingUrl(meetUrl.message);
			alert(meetUrl.message);
		} else {
			router.replace(`/api/auth/authorize?path=${router.asPath}`);
		}

		setLoad2(false);
	};

	if (!project) return <div>Project not found</div>;

	var tblContent =
		paymentSuccess &&
		project.venture &&
		project.venture.length > 0 &&
		project.venture.map((vent) => (
			<tr key={vent.id} className="row animate__animated animate__fadeInUp">
				{" "}
				<td className="col">{vent.investor.user.name}</td>{" "}
				<td className="col">{vent.amountInvested}</td>{" "}
				<td className="col">{vent.createdAt}</td>
			</tr>
		));
	return (
		<>
			<BackButton />
			<LoginHeader />
			<Modal
				onClose={() => setModal(false)}
				closeable
				isOpen={modal}
				animate
				autoFocus
				size={SIZE.default}
				role={ROLE.dialog}
			>
				<ModalHeader>INVESTING</ModalHeader>
				<ModalBody>
					<p
						className="text-sm cursor-pointer mb-2 text-center"
						onClick={(e) => router.push("/termsandconditions")}
					>
						Please go through{" "}
						<span className="underline">TERMS & CONDITIONS</span> before
						investing.
					</p>
					<form
						onSubmit={(e) => payHandler(e)}
						className="flex flex-col justify-center items-center gap-4"
					>
						<Input
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="Amount"
							type="number"
							clearable
							clearOnEscape
							startEnhancer="₹"
							autoComplete="on"
							autoFocus
							min={0}
							required
							overrides={{
								Root: { style: ({ $theme }) => ({ width: 18 }) },
							}}
						/>
						<div className="flex gap-4">
							<p
								className="cursor-pointer font-semibold text-lg text-fuchsia-600"
								onClick={(e) => setAmount("500")}
							>
								500
							</p>
							<p
								className="cursor-pointer font-semibold text-lg text-fuchsia-600"
								onClick={(e) => setAmount("1000")}
							>
								1000
							</p>
							<p
								className="cursor-pointer font-semibold text-lg text-fuchsia-600"
								onClick={(e) => setAmount("2000")}
							>
								2000
							</p>
						</div>
						<Button
							type="Submit"
							overrides={{
								BaseButton: {
									style: ({ $theme }) => ({
										backgroundColor: $theme.colors.positive300,
									}),
								},
							}}
							startEnhancer={<SiRazorpay style={{ fontSize: "1.5rem" }} />}
						>
							Pay Now
						</Button>
					</form>
				</ModalBody>
			</Modal>
			<Modal
				onClose={() => setIsOpen(false)}
				closeable
				isOpen={isOpen}
				animate
				autoFocus
				size={SIZE.default}
				role={ROLE.dialog}
			>
				<ModalHeader>Choose Date and Time</ModalHeader>
				<ModalBody>
					<DateForm closeOpen={closeOpen} meethandler={meethandler} />
				</ModalBody>
			</Modal>
			<p className="select-none flex my-[.5rem] py-[.5rem] text-3xl cursor-default justify-center gap-4">
				{project.name}{" "}
				{session.data?.user?.id === project.startup.entrepreneur.userId && (
					<FiEdit
						className="animate__animated animate__fadeInRight"
						title="Edit The Information"
						style={{ cursor: "pointer" }}
						onClick={() =>
							router.push(
								`http://localhost:3000/user/startup/project/${project?.id}/edit`
							)
						}
					/>
				)}
			</p>

			<div className="flex flex-wrap justify-around gap-4 mb-[1rem] pb-[1rem]">
				<div>
					<div>
						<p className="select-none mt-[1rem] pt-[1rem] text-2xl cursor-default text-center">
							{" "}
							Project Details{" "}
						</p>
						<div className="text-justify">
							<p className="select-none mt-[.5rem] pt-[.5rem] text-lg cursor-default animate__animated animate__fadeInUp">
								Startup: {project.startup.name}
							</p>
							{/* <p className="select-none text-lg cursor-default animate__animated animate__fadeInUp">
								Investment Requirement:{initial.investmentRequired}
							</p> */}
							<p className="select-none text-lg cursor-default animate__animated animate__fadeInUp">
								Publish Date:{project.createdAt}
							</p>
							<p className="select-none text-lg cursor-default animate__animated animate__fadeInUp">
								Contact:{project.startup.email}
							</p>
						</div>
						{/* add more */}
					</div>
					<br /> <br />
					<div>
						<p className="select-none mt-[1rem] pt-[1rem] text-2xl cursor-default text-center">
							{" "}
							Project Report Over View{" "}
						</p>
						{/* add more */}
					</div>
					<br /> <br />
					<div>
						<p className="mt-5 cursor-default text-center text-lg underline">
							List of backers
						</p>

						{project.venture.length > 0 ? (
							<div className="mx-4 overflow-x-auto">
								<table className="mx-auto mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
									<thead>
										<tr className="animate__animated animate__fadeInUp">
											<th>Name</th>
											<th>Amount</th>
											<th>Date Invested</th>
										</tr>
									</thead>
									<tbody>{tblContent}</tbody>
								</table>
							</div>
						) : (
							<p className="mt-2 cursor-default text-center mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
								No Backers Yet
							</p>
						)}
					</div>
				</div>

				<embed
					className="min-w-[40%] h-[100vh]"
					src={`data:application/pdf;base64,${""}`}
				/>
				{/* change the src according to requirement. if the report is in base64 the just add the paramater inside `${}` | else replace complete src */}
			</div>

			<div className="flex justify-center mt-3 pt-3 mb-[1rem] pb-[1rem] gap-x-[2rem]">
				<Button
					onClick={() => setModal(true)}
					isLoading={load1}
					overrides={{
						BaseButton: {
							style: ({ $theme }) => ({
								backgroundColor: $theme.colors.positive400,
							}),
						},
					}}
					startEnhancer={<FaHandsHelping style={{ fontSize: "1.5rem" }} />}
				>
					Contribute
				</Button>
				<Button
					onClick={() => setIsOpen(true)}
					isLoading={load2}
					overrides={{
						BaseButton: {
							style: ({ $theme }) => ({
								backgroundColor: $theme.colors.positive400,
							}),
						},
					}}
					startEnhancer={
						<MdOutlineVideoCameraFront style={{ fontSize: "1.5rem" }} />
					}
				>
					Setup Meeting
				</Button>
			</div>
			{/* <p className='mt-5 cursor-default text-center underline'>No file to display</p> */}
		</>
	);
}
