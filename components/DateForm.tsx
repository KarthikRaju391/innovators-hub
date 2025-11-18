 import React, { useState } from "react";
import { Button } from "./ui/button";

interface DateFormProps {
  meethandler: (date: string) => void;
  closeOpen: () => void;
}

function DateForm({ meethandler, closeOpen }: DateFormProps) {
  const today = new Date();
  const [meetDate, setMeetDate] = useState(today.toISOString().split('T')[0]);
  const [meetTime, setMeetTime] = useState("09:00");

  const assignHandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dateTime = new Date(`${meetDate}T${meetTime}`);
    const meetDateIso = dateTime.toISOString();
    meethandler(meetDateIso);
    closeOpen();
  };

  return (
    <form
      className="mb-[1rem] pb-[1rem] flex justify-center items-center"
      onSubmit={assignHandleSubmit}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="date">Select Date</label>
          <input
            id="date"
            type="date"
            value={meetDate}
            onChange={(e) => setMeetDate(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="time">Select Time (8:00 - 15:00)</label>
          <input
            id="time"
            type="time"
            value={meetTime}
            min="08:00"
            max="15:00"
            onChange={(e) => setMeetTime(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <Button type="submit" className="w-full">
          Confirm
        </Button>
      </div>
    </form>
  );
}

export default DateForm;
