import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
import {
  Box,
  //   IconButton,
  Typography,
  //   TextField,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  //   Button,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import toast from "react-hot-toast";

// Define your Dashboard component
const GenerateQuestion = () => {
  // Retrieve the token from local storage
  const [s3ImageLink, setS3ImageLink] = useState("");
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [optionchange, setOptionChange] = useState("");
  const [optionss, setOptionss] = useState([]);
  //   const [editDialogOpen, setEditDialogOpen] = useState(false);
  //   const [editedData, setEditedData] = useState({
  //     questionid: null,
  //     description: "",
  //     options: ["", "", "", ""],
  //     number_of_options: "",
  //     answer: "",
  //     image: null,
  //     examcode: "",
  //   });

  // Use useEffect to fetch data based on optionchange
  useEffect(() => {
    fetchdata();
  }, [optionchange]);

  // Function to fetch data based on examcode
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
      // Set the fetched optionss in state
      setOptionss(response.data.data);
    } catch (err) {
      console.log(err.response.data.msg);
      toast.error(err.response.data.msg);
    }
  };

  const change = (e) => {
    setOptionChange(e.target.value);
  };

  // Function to search for questions based on exam code
  const searchquestion = async () => {
    try {
      console.log(optionchange);
      const response = await axios.get(
        `http://127.0.0.1:3002/api/v1/admin/getquestions/${optionchange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
      setData(response.data.data);
    } catch (err) {
      console.log(err.response.data.msg);
      toast.error(err.response.data.msg);
    }
  };
  const [question, setQuestion] = useState("");
  const [numOptions, setNumOptions] = useState(2);
  const [options, setOptions] = useState(Array(numOptions).fill(""));
  const [questionImage, setQuestionImage] = useState(null);
  const [includeImage, setIncludeImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [correctOption, setCorrectOption] = useState("");
  const handleNumOptionsChange = (e) => {
    const newNumOptions = parseInt(e.target.value);
    setNumOptions(newNumOptions);
    if (newNumOptions > options.length) {
      setOptions([
        ...options,
        ...Array(newNumOptions - options.length).fill(""),
      ]);
    } else {
      setOptions(options.slice(0, newNumOptions));
    }
  };

  const handleOptionChange = (e, index) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;
    setOptions(newOptions);
  };

  const handleImageChange = (e) => {
    setQuestionImage(e.target.files[0]);
  };

  const handleDeleteImage = () => {
    setQuestionImage(null);
  };
  let s3Link;
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsLoading(true);
    setUploading(true);

    // Upload image to AWS S3
    if (includeImage && questionImage) {
      try {
        const s3 = new AWS.S3({
          accessKeyId: "AKIARSA6ALIHK75PTKLX",
          secretAccessKey: "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",
          region: "ap-south-1",
        });

        // Upload the image to S3
        const s3Params = {
          Bucket: "proctor-question-image",
          Key: `question-images/${questionImage.name}`, // Specify the S3 path and filename
          Body: questionImage,
          ContentType: questionImage.type,
          ACL: "public-read", // Set the ACL to make the image publicly accessible
        };

        const s3Response = await s3.upload(s3Params).promise();

        // Get the S3 link from the response
        s3Link = s3Response.Location;

        // Set the S3 link in the state
        setS3ImageLink(s3Link);

        // Debugging: Log the S3 link to the console
        console.log("S3 Link:", s3Link);
      } catch (error) {
        // Handle any errors that occur during the upload process
        console.error("Error uploading image to S3:", error);

        // You can set an error state or display an error message to the user if needed
        // setErrorState(true);

        return;
      }
    }
    setUploading(false);
    setIsLoading(true);

    // Include s3ImageLink in the data you send when submitting the form
    const formData = {
      examcode: optionchange,
      description: question,
      number_of_options: numOptions,
      options,
      answer: correctOption - 1,
      //   includeImage,
      image: s3Link, // Include the S3 link in the form data
    };
    try {
      const response = await axios.post(
        "http://127.0.0.1:3002/api/v1/admin/createquestion",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      toast.success(`Question created successfully`);
    } catch (err) {
      console.log(err.response.data.msg);
      toast.error(err.response.data.msg);
    }

    // console.log("Submitted Data:", formData);
    setIsLoading(false);
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      {/* <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Generate Question" subtitle="Create Question" />
      </Box> */}
      <h1>Generate Question</h1>
      {/* <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        pt="10px"
        mb="20px"
      > */}
      <h3>Exam Code: </h3>
      <input
        style={{
          backgroundColor: "#f2f2f2",
          color: "black",
          //   borderRadius: "3px",
          borderTopLeftRadius: 15,
          borderBottomLeftRadius: 15,
          width: "20rem",
          height: "3.2rem",
          padding: "10px",
          border: "none",
          marginBottom: 14,
        }}
        list="dataa"
        onChange={change}
        placeholder="Search"
      />
      <datalist id="dataa">
        {optionss.map((op) => (
          <option key={op}>{op}</option>
        ))}
      </datalist>
      <IconButton
        type="button"
        style={{ borderTopRightRadius: 15, borderBottomRightRadius: 15 }}
        sx={{
          p: "15px",
          backgroundColor: "#0159ED",
          borderRadius: "0",
          color: "white",
          "&:hover": { backgroundColor: "#1976d2" },
        }}
        onClick={searchquestion}
      >
        <SearchIcon />
      </IconButton>
      {/* </Box> */}
      <Box>
        <div>
          {/* <h2>Generate Question</h2> */}
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <label style={{ marginRight: "16px", fontSize: 16 }}>
                Include Image:
                <input
                  type="checkbox"
                  checked={includeImage}
                  onChange={() => setIncludeImage(!includeImage)}
                  style={{ marginLeft: "8px", fontSize: 18 }}
                />
              </label>
            </div>
            <div>
              {includeImage && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="image-upload"
                    style={{ display: "none" }}
                  />
                  <label htmlFor="image-upload">
                    <label style={{ marginRight: "16px", fontSize: 16 }}>
                      Upload Image:
                    </label>
                    <IconButton color="primary" component="span">
                      <CloudUploadOutlinedIcon style={{ fontSize: 25 }} />
                    </IconButton>
                  </label>
                  {questionImage && (
                    <div style={{ marginLeft: "16px" }}>
                      <img
                        src={URL.createObjectURL(questionImage)}
                        alt="Question"
                        style={{ maxWidth: "330px", marginBottom: "20px" }}
                      />
                      <IconButton
                        color="secondary"
                        onClick={handleDeleteImage}
                        size="small"
                      >
                        <ClearIcon />
                      </IconButton>
                    </div>
                  )}
                </div>
              )}
            </div>
            <TextField
              fullWidth
              required
              label="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              multiline
              rows={4}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Choose No of Options"
              value={numOptions}
              onChange={handleNumOptionsChange}
              sx={{ marginBottom: 2 }}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <MenuItem key={i} value={i + 2}>
                  {i + 2}
                </MenuItem>
              ))}
            </TextField>
            {options.map((option, index) => (
              <TextField
                key={index}
                fullWidth
                label={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(e, index)}
                sx={{ marginBottom: 2 }}
              />
            ))}
            {/* <TextField
              fullWidth
              required
              label="Correct Option No."
              value={correctOption}
              onChange={(e) => setCorrectOption(e.target.value)}
              //   multiline
              rows={4}
              sx={{ marginBottom: 2 }}
            /> */}
            <TextField
              fullWidth
              select
              label="Choose Correct Option"
              value={correctOption}
              onChange={(e) => setCorrectOption(e.target.value)}
              sx={{ marginBottom: 2 }}
            >
              {Array.from({ length: numOptions }, (_, i) => (
                <MenuItem key={i} value={i + 2}>
                  {i + 1}
                </MenuItem>
              ))}
            </TextField>
            <Button type="submit" variant="contained" color="primary">
              {uploading
                ? "Uploading..."
                : isLoading
                ? "Submitting..."
                : "Submit"}
            </Button>
          </form>
        </div>
      </Box>
    </Box>
  );
};

export default GenerateQuestion;
