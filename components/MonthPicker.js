import {useState} from 'react';
import dayjs from 'dayjs';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";




export default function MonthYearPicker({setStartDate,startDate,setMonth,setYear  }) {

  return (
    <DatePicker
    selected={startDate}
    onChange={(date) => {
      console.log("date.month ",date.getMonth())
      setStartDate(new Date(date))
      setMonth(date.getMonth()+1)
      setYear(date.getFullYear())
    }}
    dateFormat="MM/yyyy"
    showMonthYearPicker
    withPortal
    portalId="root-portal"
  />
  );
}
