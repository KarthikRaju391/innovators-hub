import BackButton from "../../../../components/BackButton";
import LoginHeader from "../../../../components/LoginHeader";
import { Button } from "baseui/button";
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
	const [isOpen, setIsOpen] = useState(false);
	const [load1, setLoad1] = useState(false);
	const [load2, setLoad2] = useState(false);
	const session = useSession();
	const router = useRouter();

	const { projId } = router.query;

	const { data: project, isLoading } = useSWR(`/api/invest/${projId}`, fetcher);

	if (isLoading) return <div>Loading...</div>;

	const closeOpen = () => {
		setIsOpen(false);
	};

	const buyHandler = async () => {
		console.log("invest");
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
					investorEmail: session.data?.user?.email,
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
		project.venture.length > 0 &&
		project.venture.map((vent) => (
			<tr key={venture.id} className="row animate__animated animate__fadeInUp">
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
			<h2 className="select-none flex my-[.5rem] py-[.5rem] text-3xl cursor-default justify-center gap-4">
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
			</h2>

			<div className="flex flex-wrap justify-around gap-4 mb-[1rem] pb-[1rem]">
				<div>
					<div>
						<h2 className="select-none mt-[1rem] pt-[1rem] text-2xl cursor-default text-center">
							{" "}
							Project Details{" "}
						</h2>
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
						<h2 className="select-none mt-[1rem] pt-[1rem] text-2xl cursor-default text-center">
							{" "}
							Project Report Over View{" "}
						</h2>
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
