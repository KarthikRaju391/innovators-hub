import BackButton from "../../components/BackButton";
import LoginHeader from "../../components/LoginHeader";
import { Button, SIZE, SHAPE } from "baseui/button";
import { GiVideoConference } from 'react-icons/gi';

function meetings() {

    var meetings = [
        { id: 1, requestedBy: "Harish", requestedTo: "Suresh", date: "18/06/2023", time: "12:00:00" },
        { id: 2, requestedBy: "Harish", requestedTo: "Girish", date: "18/06/2023", time: "12:00:00" },
        { id: 3, requestedBy: "Harish", requestedTo: "Ramesh", date: "18/06/2023", time: "12:00:00" },
    ]

    var tblContent =
        meetings.length > 0 &&
		meetings.map((meet) => (
			<tr key={meet.id} className="row animate__animated animate__fadeInUp">
				{" "}
				<td className="col">{meet.id}</td>{" "}
				<td className="col">{meet.requestedBy}</td>{" "}
				<td className="col">{meet.requestedTo}</td>{" "}
                <td className="col">{meet.date}</td>{" "}
                <td className="col">{meet.time}</td>{" "}
                <td className="col">
                    <Button
                        onClick={() => alert("click")}
                        // startEnhancer={<GiVideoConference />}
                        size={SIZE.mini}
                        shape={SHAPE.pill}
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
            <h2 className="select-none my-[.5rem] py-[.5rem] text-3xl cursor-default text-center"> Meetings </h2>
            <div>
            {meetings.length > 0 ? (
							<div className="mx-4 overflow-x-auto">
								<table className="mx-auto mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
									<thead>
										<tr className="animate__animated animate__fadeInUp">
											<th>ID</th>
											<th>Requested By</th>
											<th>Requested To</th>
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