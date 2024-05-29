import React from "react";
import { momentLocalizer, Calendar } from "react-big-calendar";
import moment from "moment";
import { Box } from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const Events = [
  {
    start: moment("2023-12-10T10:00:00").toDate(),
    end: moment("2023-12-10T12:00:00").toDate(),
    title: "RUNG",
  },
  {
    start: moment("2023-12-10T11:00:00").toDate(),
    end: moment("2023-12-10T13:00:00").toDate(),
    title: "Softec",
  },
];

const SeeEvents = () => {
  return (
    <>
      <Box height={"100vh"} width={"100%"}>
        <Calendar localizer={localizer} events={Events}></Calendar>
      </Box>
    </>
  );
};

export default SeeEvents;
