import React, { useState } from "react";
import { Box, Button, Typography, Divider } from "@mui/material";
import Header from "../../components/Header";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import toast from "react-hot-toast";

const ExistingExam = () => {
  const [optionchange, setoptionchange] = useState("");
  const [options, setOptions] = useState([]);

  const [values, setValues] = useState({
    starttime: "",
    endtime: "",
    startdate: "",
  });
  const token = localStorage.getItem("token");
  const handleSubmit = async () => {
    console.log(values);
    const startdate = values.startdate.split("T")[0];
    const starttime = values.starttime.split("T")[1].split("+")[0];
    const endtime = values.endtime.split("T")[1].split("+")[0];
    values["startdate"] = startdate;
    values["starttime"] = starttime;
    values["endtime"] = endtime;
    values["examcode"] = optionchange;
    console.log(values);
    try {
      const response = await axios.post(
        "http://127.0.0.1:3002/api/v1/admin/createfromexistingexam",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      toast.success(
        `Exam created successfully, exam code is : ${response.data.examcode}`
      );
    } catch (err) {
      console.log(err.response.data.msg);
      toast.error(err.response.data.msg);
    }
  };

  const change = (e) => {
    setoptionchange(e.target.value);
  };

  useEffect(() => {
    fetchdata();
  }, [optionchange]);

  const fetchdata = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:3002/api/v1/admin/getexams?examcode=${optionchange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
      setOptions(response.data.data);
    } catch (err) {
      console.log(err.response.data.msg);
      toast.error(err.response.data.msg);
    }
  };
  return (
    <Box m="20px">
      {/* <Header title="Existing Exam" subtitle="Create from Existing Exam" /> */}
      <h1>Create from Existing Exam</h1>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap="10px"
        pt="10px"
      >
        <Typography component="h1" variant="h3" fontWeight="bold">
          Exam Code
        </Typography>
        <input
          style={{
            backgroundColor: "#e0e0e0",
            color: "black",
            borderRadius: "3px",
            width: "20rem",
            height: "3.2rem",
            padding: "10px",
            border: "none",
          }}
          list="dataa"
          onChange={change}
          placeholder="Search"
        />
        <datalist id="dataa">
          {options.map((op) => (
            <option key={op}>{op}</option>
          ))}
        </datalist>
      </Box>
      {/* <Box display="flex" justifyContent="center" alignItems="center" mt="50px">
        <Typography component="h1" variant="h3">
          Exam Code: {optionchange}
        </Typography>
      </Box> */}
      <Divider sx={{ my: 2 }} />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap="10px"
        mt="10px"
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer
            components={["DatePicker"]}
            sx={{ gridColumn: "span 2" }}
          >
            <DatePicker
              label="Select Date"
              name="exam_date"
              sx={{ width: "100%" }}
              onChange={(e) => setValues({ ...values, startdate: e.format() })}
            />
          </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["TimePicker"]}>
            <TimePicker
              label="Start Time"
              name="starttime"
              sx={{ width: "100%" }}
              onChange={(e) => setValues({ ...values, starttime: e.format() })}
            />
          </DemoContainer>
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["TimePicker"]}>
            <TimePicker
              label="End Time"
              name="endtime"
              sx={{ width: "100%" }}
              onChange={(e) => setValues({ ...values, endtime: e.format() })}
            />
          </DemoContainer>
        </LocalizationProvider>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="center" mt="50px">
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          onClick={handleSubmit}
          sx={{
            pl: "16px",
            pr: "16px",
            pt: "10px",
            pb: "10px",
            width: "15rem",
          }}
        >
          Create Exam
        </Button>
      </Box>
    </Box>
  );
};

export default ExistingExam;
