import React, { useEffect, useState } from "react";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { StatefulCalendar } from "baseui/datepicker";
import { TimePicker } from "baseui/timepicker";
import { Button, SHAPE } from "baseui/button";
import { useRouter } from "next/router";
import { format } from "date-fns";

function DateForm({ meethandler, closeOpen }) {
	const [meetDate, setMeetDate] = useState(
		`${new Date().toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		})}`
	);

	const meetDateMin = new Date(`${meetDate} 8:00:00`);
	const meetDateMax = new Date(`${meetDate} 15:00:00`);
	// handle POST request to set access
	const [load, setLoad] = React.useState(false);
	const router = useRouter();

	const assignHandleSubmit = async (e) => {
		e.preventDefault();
		const meetDateIso = format(meetDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

		meethandler(meetDateIso);

		closeOpen();
	};

	const handleDate = (date) => {
		setMeetDate(
			new Date(date).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		);
	};

	return (
		<form
			className="mb-[1rem] pb-[1rem] flex justify-center items-center"
			onSubmit={assignHandleSubmit}
		>
			<div className="">
				<StatefulCalendar
					// use the 'onChange' prop to pull data from the component into your application state
					onChange={({ date }) => handleDate(date)}
				/>

				<FormControl label="min/max times on the same date">
					<TimePicker
						value={new Date(`${meetDate} 9:00:00`)}
						minTime={meetDateMin}
						maxTime={meetDateMax}
						onChange={setMeetDate}
					/>
				</FormControl>
				<Button
					type="Submit"
					shape={SHAPE.pill}
					isLoading={load}
					className="w-full"
					title="Submit Form"
				>
					Confirm
				</Button>
			</div>
		</form>
	);
}

export default DateForm;
