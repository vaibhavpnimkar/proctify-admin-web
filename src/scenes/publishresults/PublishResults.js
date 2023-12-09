import React, { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme, TextField } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import toast from "react-hot-toast";
import AttemptedBarChart from "./AttemptedBarChart";
import PercentageLineChart from "./PercentageLineChart";

const PublishResults = () => {
  const token = localStorage.getItem("token");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [options, setOptions] = useState([]);
  const [optionchange, setOptionChange] = useState("");
  const [data, setData] = useState(false)
  const [showresult, setShowResult] = useState(true)
  const [perecentageLine, setPercentageLine] = useState([])
  const [attemptedBar, setAttemptedBar] = useState([])
  const [values, setValues] = useState('')

  useEffect(() => {
    fetchdata();
  }, [optionchange]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:3002/api/v1/admin/publishresult/${optionchange}`, { cutoff: values },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      toast.success("Results Published");
    } catch (err) {
      console.log(err.response.data.msg);
      toast.error(err.response.data.msg);
    }
  };

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
      // Set the fetched options in state
      setOptions(response.data.data);
    } catch (err) {
      console.log(err.response.data.msg);
      toast.error(err.response.data.msg);
    }
  };
  const handleShow = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:3002/api/v1/admin/getexam/${optionchange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      console.log(response.data.data.publish_result)
      setShowResult(response.data.data.publish_result)
      setData(true)
    } catch (err) {
      toast.error(err.response.data.msg)
    }
    try {
      const response = await axios.get(`http://127.0.0.1:3002/api/v1/admin/getstudentcountinpercentagerangeline/${optionchange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      console.log(response.data.data)
      setPercentageLine(response.data.data)
    } catch (err) {
      toast.error(err.response.data.msg)
    }
    try {
      const response = await axios.get(`http://127.0.0.1:3002/api/v1/admin/getattemptedandnotattemptedquestionwisebar/${optionchange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      console.log(response.data.data)
      setAttemptedBar(response.data.data)
    } catch (err) {
      console.log(err)
      toast.error(err.response.data.msg)
    }
  }
  const change = (e) => {
    console.log(e.target.value);
    setOptionChange(e.target.value);
  };
  return (
    <Box m="20px">
      <Header title="Publish Result" subtitle="Publish result for exam" />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap="10px"
        pt="10px"
      >
        <Typography component="h1" variant="h3" fontWeight="bold">
          Exam Code :
        </Typography>
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius= '10px 10px 10px 10px'
          width="20rem"
        >
          <input
            style={{
              backgroundColor: "#e0e0e0",
              color: "black",
              borderRadius: '10px 10px 10px 10px',
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
      </Box>

      <Box display="flex" justifyContent="center" mt="50px">
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          onClick={handleShow}
          sx={{ pl: "16px", pr: "16px", pt: "10px", pb: "10px" }}
        >
          Show
        </Button>
      </Box>
      {
        data && <AttemptedBarChart data={attemptedBar} />
      }
      {
        data && <PercentageLineChart cdata={perecentageLine} />
      }
      {
        !showresult && <TextField
          fullWidth
          type="number"
          required
          label="Cutoff"
          name="cutoff"
          onChange={e => setValues(e.target.value)}
          sx={{ gridColumn: "span 1" }}
        />
      }
      {
        !showresult &&
        <Box display="flex" justifyContent="center" mt="50px">
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={handleSubmit}
            sx={{ pl: "16px", pr: "16px", pt: "10px", pb: "10px" }}
          >
            Publish Result
          </Button>
        </Box>
      }
    </Box>
  );
};

export default PublishResults;
