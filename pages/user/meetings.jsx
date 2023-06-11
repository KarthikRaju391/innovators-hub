import BackButton from "../../components/BackButton";
import LoginHeader from "../../components/LoginHeader";
import { Button, SIZE, SHAPE } from "baseui/button";
import useSWR from "swr";
import { GiVideoConference } from "react-icons/gi";
import { fetcher } from "../../lib/fetcher";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

function meetings() {
	const { data: session } = useSession();
	const router = useRouter();

	const { data: meetings, isLoading } = useSWR(
		`/api/users/${session?.user.id}/meetings`,
		fetcher
	);
	// var meetings = [
	// 	{
	// 		id: 1,
	// 		requestedBy: "Harish",
	// 		requestedTo: "Suresh",
	// 		date: "18/06/2023",
	// 		time: "12:00:00",
	// 	},
	// 	{
	// 		id: 2,
	// 		requestedBy: "Harish",
	// 		requestedTo: "Girish",
	// 		date: "18/06/2023",
	// 		time: "12:00:00",
	// 	},
	// 	{
	// 		id: 3,
	// 		requestedBy: "Harish",
	// 		requestedTo: "Ramesh",
	// 		date: "18/06/2023",
	// 		time: "12:00:00",
	// 	},
	// ];

	var tblContent =
		meetings &&
		meetings.length > 0 &&
		meetings.map((meet) => (
			<tr key={meet.id} className="row animate__animated animate__fadeInUp">
				{" "}
				<td className="col">{meet.id}</td>{" "}
				<td className="col">{meet.investor.user.name}</td>{" "}
				<td className="col">{meet.entrepreneur.user.name}</td>{" "}
				<td className="col">{meet.project.startup.name}</td>
				<td className="col">{meet.project.name}</td>
				<td className="col">
					{new Date(meet.meetingTime).toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</td>{" "}
				<td className="col">
					{new Date(meet.meetingTime).toLocaleTimeString("en-US", {
						hour: "numeric",
						minute: "numeric",
						hour12: true,
					})}
				</td>{" "}
				<td className="col">
					<Button
						onClick={() => router.push(meet.meetingLink)}
						// startEnhancer={<GiVideoConference />}
						size={SIZE.mini}
						shape={SHAPE.pill}
						disabled={Date.now() < new Date(meet.meetingTime).getTime()}
					>
						Join Now
					</Button>
				</td>{" "}
			</tr>
		));

	return (
		<>
			<BackButton />
			<LoginHeader />
			<p className="select-none my-[.5rem] py-[.5rem] text-3xl cursor-default text-center">
				{" "}
				Meetings{" "}
			</p>
			<div>
				{meetings && meetings.length > 0 ? (
					<div className="mx-4 overflow-x-auto">
						<table className="mx-auto mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
							<thead>
								<tr className="animate__animated animate__fadeInUp">
									<th>ID</th>
									<th>Requested By</th>
									<th>Requested To</th>
									<th>Startup Name</th>
									<th>Project Name</th>
									<th>Date</th>
									<th>Time</th>
									<th>Meeting URL</th>
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
		</>
	);
}

export default meetings;
