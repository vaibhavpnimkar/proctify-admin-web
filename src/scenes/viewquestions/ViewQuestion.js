import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  TextField,
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
  Button,
} from "@mui/material";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import toast from "react-hot-toast";
import QuestionComponent from "./QuestionComponent";

// Define your Dashboard component
const ViewQuestion = () => {
  // Retrieve the token from local storage
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [optionchange, setOptionChange] = useState("");
  const [options, setOptions] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedData, setEditedData] = useState({
    questionid: null,
    description: "",
    options: ["", "", "", ""],
    number_of_options: "",
    answer: "",
    image: null,
    examcode: "",
  });

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
      // Set the fetched options in state
      setOptions(response.data.data);
    } catch (err) {
      console.log(err.response.data.msg);
      toast.error(err.response.data.msg);
    }
  };

  // Function to handle edit button click
  const [questid, setquestid] = useState(null);
  const handleEditClick = (item) => {
    // setEditedData(item);
    setquestid(item);
    setEditDialogOpen(true);
  };

  // Function to handle question update
  const handleUpdate = async () => {
    // Log the updated values
    // console.log(editedData);
    try {
      const response = await axios.post(
        `http://127.0.0.1:3002/api/v1/admin/updatequestion`,
        editedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Set the fetched options in state'
      console.log(response.data);
      toast.success("Question Updated");
    } catch (err) {
      console.log(err.response.data.msg);
      toast.error(err.response.data.msg);
    }
    setEditDialogOpen(false);
  };

  // Function to handle image upload
  const handleImageUpload = (e) => {
    // Handle image upload here
    const file = e.target.files[0];

    // You can perform any necessary operations with the uploaded file here
    // For example, you can display a preview of the image:
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageSrc = event.target.result;
      setEditedData({ ...editedData, imageFile: file, image: imageSrc });
    };
    reader.readAsDataURL(file);
  };

  // Function to render the form
  const renderForm = () => {
    if (editedData.image) {
      return (
        <div>
          {/* Actual image upload component */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <img
              src={editedData.image}
              alt="Question"
              style={{ maxWidth: "90%", maxHeight: "300px", marginTop: "5px" }}
            />
            {editedData.image ? (
              <Button
                type="submit"
                color="primary"
                style={{
                  backgroundColor: "red",
                  padding: "2px",
                  marginBottom: "10px",
                }}
                variant="contained"
                onClick={removeimage}
              >
                X
              </Button>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ margin: "16px 0" }} // Add margin
              />
            )}
          </Box>
          <TextField
            label="Question"
            fullWidth
            value={editedData.description}
            onChange={(e) =>
              setEditedData({ ...editedData, description: e.target.value })
            }
            style={{ marginBottom: "16px" }}
          />
          {/* Options for image questions */}
          {editedData.options.map((option, index) => (
            <div key={index}>
              <TextField
                label={`Option ${String.fromCharCode(65 + index)}`}
                fullWidth
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...editedData.options];
                  updatedOptions[index] = e.target.value;
                  setEditedData({ ...editedData, options: updatedOptions });
                }}
                style={{ marginBottom: "16px" }}
              />
              {index < editedData.options.length - 1 && <Divider />}{" "}
              {/* Add divider */}
            </div>
          ))}

          <TextField
            label="Correct Answer"
            fullWidth
            value={editedData.answer}
            onChange={(e) =>
              setEditedData({ ...editedData, answer: e.target.value })
            }
            style={{ marginTop: "16px" }}
          />
        </div>
      );
    } else {
      return (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ margin: "16px 0" }} // Add margin
          />
          <TextField
            label="Question"
            fullWidth
            value={editedData.description}
            onChange={(e) =>
              setEditedData({ ...editedData, question: e.target.value })
            }
            style={{ marginBottom: "16px" }}
          />
          {editedData.options.map((option, index) => (
            <div key={index}>
              <TextField
                label={`Option ${String.fromCharCode(65 + index)}`}
                fullWidth
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...editedData.options];
                  updatedOptions[index] = e.target.value;
                  setEditedData({ ...editedData, options: updatedOptions });
                }}
                style={{ marginBottom: "16px" }}
              />
              {index < editedData.options.length - 1 && <Divider />}{" "}
              {/* Add divider */}
            </div>
          ))}
          <TextField
            label="Correct Answer"
            fullWidth
            value={editedData.answer}
            onChange={(e) =>
              setEditedData({ ...editedData, answer: e.target.value })
            }
            style={{ marginTop: "16px" }}
          />
        </div>
      );
    }
  };

  // Function to handle exam code change
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

  // Function to remove the uploaded image
  const removeimage = () => {
    setEditedData({ ...editedData, image: null });
  };
  // const cancelPressed = async () => {
  //   window.location.reload();
  //   await fetchdata();
  //   setEditDialogOpen(false);
  // };
  const cancelPressed = async () => {
    try {
      // Fetch the updated data based on the current exam code
      const response = await axios.get(
        `http://127.0.0.1:3002/api/v1/admin/getquestions/${optionchange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Set the updated data in the state
      setData(response.data.data);
    } catch (err) {
      console.log(err.response.data.msg);
      toast.error(err.response.data.msg);
    }

    // Close the edit dialog
    setEditDialogOpen(false);
  };

  const deletequestion = async (id) => {
    try {
      console.log(optionchange);
      const response = await axios.delete(
        `http://127.0.0.1:3002/api/v1/admin/deletequestion/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      toast.success("Question Deleted");
    } catch (err) {
      console.log(err.response.data.msg);
      toast.error(err.response.data.msg);
    }
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      {/* <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="View Questions" subtitle="Update or Delete questions" />
      </Box> */}
      <h1 style={{ marginBottom: -10 }}>View Questions</h1>
      <h2 style={{ color: "#1774D4" }}>Update or Delete questions</h2>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        pt="10px"
        mb="20px"
      >
        <Typography
          component="h1"
          variant="h3"
          marginRight="10px"
          fontWeight="bold"
        >
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
        <IconButton
          type="button"
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
      </Box>
      {data.length !== 0 ? (
        <TableContainer component={Paper} sx={{ backgroundColor: "#e0e0e0" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "20px" }}>
                  Questions
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  Action
                </TableCell>
              </TableRow>
              <hr style={{ width: "139%" }} />
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <>
                  <TableRow key={item.questionid}>
                    <TableCell sx={{ fontSize: "16px" }}>
                      {item.description}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="Edit"
                        color="secondary"
                        onClick={() => handleEditClick(item.questionid)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="Delete"
                        color="secondary"
                        onClick={() => deletequestion(item.questionid)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <hr style={{ width: "139%" }} />
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        ""
      )}

      {/* Dialog for editing question */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
      >
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent>
          <QuestionComponent data={questid} />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelPressed} color="secondary" variant="contained">
            Cancel
          </Button>
          {/* <Button onClick={handleUpdate} color="secondary" variant="contained">
            Update
          </Button> */}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewQuestion;
