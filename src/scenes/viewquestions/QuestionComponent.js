import React, { useState, useEffect } from "react";
import AWS from "aws-sdk";
import { Box, TextField, Divider, Button } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ClearIcon from "@mui/icons-material/Clear";

function QuestionComponent(item) {
  useEffect(() => {
    fetchdata();
  }, []);

  const token = localStorage.getItem("token");
  const [includeImage, setIncludeImage] = useState(false);
  const [questionImage, setQuestionImage] = useState(null);

  const [editedData, setEditedData] = useState({
    // examcode: null,
    questionid: "",
    image: null,
    description: "",
    number_of_options: "",
    options: ["", "", "", "", ""],
    answer: "",
  });

  const [placeholders, setPlaceholders] = useState({
    description: "Question",
    options: ["Option A", "Option B", "Option C", "Option D", "Option E"],
    answer: "Correct Answer",
  });
  const handleImageChange = (e) => {
    setQuestionImage(e.target.files[0]);
  };
  const fetchdata = async () => {
    try {
      console.log(item.data);
      const response = await axios.get(
        `http://127.0.0.1:3002/api/v1/admin/getquestion/${item.data}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
      const questionData = response.data.data;
      setEditedData({
        // examcode: questionData.examcode,
        questionid: questionData.questionid,
        image: questionData?.image,
        description: questionData.description,
        number_of_options: questionData.number_of_options,
        options: questionData.options,
        answer: questionData.answer,
      });
    } catch (err) {
      console.log(err.response.data.msg);
      toast.error(err.response.data.msg);
    }
  };
  const handleDeleteImage = () => {
    setQuestionImage(null);
  };
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

  const removeImage = () => {
    setEditedData({ ...editedData, image: null });
  };
  const [uploading, setUploading] = useState(false);
  const handleUpdate = async () => {
    // console.log(editedData);
    setUploading(true);
    let s3Link;
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
        // setS3ImageLink(s3Link);

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
    try {
      const response = await axios.post(
        `http://127.0.0.1:3002/api/v1/admin/updatequestion`,
        { ...editedData, image: s3Link },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      toast.success("Question Updated");
    } catch (err) {
      console.log(err.response.data.msg);
      toast.error(err.response.data.msg);
    }
  };

  return (
    <div>
      <div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            // justifyContent: "center",
            gap: "10px",
          }}
        >
          {editedData.image && (
            <img
              src={editedData?.image}
              alt="Question"
              style={{ maxWidth: "90%", maxHeight: "300px", marginTop: "5px" }}
            />
          )}
          {!editedData.image && (
            <div>
              <label
                style={{ marginRight: "16px", fontSize: 16, marginBottom: 20 }}
              >
                Include Image:
                <input
                  type="checkbox"
                  checked={includeImage}
                  onChange={() => setIncludeImage(!includeImage)}
                  style={{ marginLeft: "8px", fontSize: 18 }}
                />
              </label>

              <div>
                {includeImage && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      id="image-upload"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="image-upload">
                      <label
                        style={{
                          marginRight: "16px",
                          fontSize: 16,
                          marginBottom: 30,
                        }}
                      >
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
            </div>
          )}
          {editedData?.image && (
            <Button
              type="submit"
              color="primary"
              style={{
                backgroundColor: "red",
                padding: "2px",
                marginBottom: "20px",
              }}
              variant="contained"
              onClick={removeImage}
            >
              X
            </Button>
          )}
        </Box>
        <TextField
          label={placeholders.description}
          fullWidth
          value={editedData.description}
          onChange={(e) =>
            setEditedData({ ...editedData, description: e.target.value })
          }
          style={{ marginBottom: "16px", marginTop: 20 }}
        />
        {editedData?.options?.map((option, index) => (
          <div key={index}>
            <TextField
              label={placeholders.options[index]}
              fullWidth
              value={option}
              onChange={(e) => {
                const updatedOptions = [...editedData.options];
                updatedOptions[index] = e.target.value;
                setEditedData({ ...editedData, options: updatedOptions });
              }}
              style={{ marginBottom: "16px" }}
            />
            {index < editedData.options.length - 1 && <Divider />}
          </div>
        ))}

        <TextField
          label={placeholders.answer}
          fullWidth
          value={editedData.answer}
          onChange={(e) =>
            setEditedData({ ...editedData, answer: e.target.value })
          }
          style={{ marginTop: "16px" }}
        />
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            marginTop: 15,
            marginBottom: 15,
          }}
        >
          <Button onClick={handleUpdate} color="secondary" variant="contained">
            {uploading ? "Uploading..." : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default QuestionComponent;
