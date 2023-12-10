// import { tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
// import Header from "../../components/Header";
// import WebSocket from "web";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./datagrid-styles.css";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { mockDataTeam } from "../../data/mockData";

import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
// import Webcam from 'react-webcam';
import WebcamIcon from "@mui/icons-material/Videocam";
import ScreenIcon from "@mui/icons-material/ScreenShare";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
const AnimatedButton = styled(motion.button)({
  backgroundColor: "#0159ED",
  color: "white",
  padding: "10px 20px",
  borderRadius: "4px",
  cursor: "pointer",
  border: "none",
  outline: "none",
  "&:hover": {
    backgroundColor: "#0149CD",
  },
});
const Dashboard = () => {
  // let liveStudents = {};
  const [liveStudents, setLiveStudents] = useState({});
  const navigate = useNavigate();
  const [examCode, setexamCode] = useState();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const columns = [
    // ... (previous columns)
    {
      field: "id",
      headerName: "ID",
      headerAlign: "center",
      align: "center",
      width: 70,
    },
    {
      field: "name",
      headerName: "Student Name",
      headerAlign: "center",
      align: "center",
      width: 110,
    },
    {
      field: "student_id",
      headerName: "Student ID",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "out_of_frame",
      headerName: "Out of Frame",
      headerAlign: "center",
      align: "center",
      width: 110,
    },
    {
      field: "mobile_detected",
      headerName: "Mobile Detected",
      // flex: 1,
      headerAlign: "center",
      align: "center",
      width: 110,
    },
    {
      field: "not_center",
      headerName: "Not Center",
      // flex: 1,
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "noise_detected",
      headerName: "Noise Detected",
      // flex: 1,
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "web_cam",
      headerName: "Web Cam",
      type: "number",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: ({ row }) => (
        <IconButton
          color="inherit"
          // onClick={() => handleClickOpenn(row)}
          style={{ padding: 0 }}
        >
          <PhotoCameraFrontIcon fontSize="medium" />
        </IconButton>
      ),
    },
    {
      field: "screen_share",
      headerName: "Screen Share",
      type: "number",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: ({ row }) => (
        <IconButton
          color="inherit"
          onClick={() => console.log(liveStudents)}
          style={{ padding: 0 }}
        >
          <ScreenIcon fontSize="medium" />
        </IconButton>
      ),
    },
    {
      field: "remove_user",
      headerName: "Remove User",
      type: "number",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: ({ row }) => (
        <IconButton
          color="inherit"
          // onClick={handleClickOpen}
          style={{ padding: 0 }}
        >
          <DeleteIcon fontSize="medium" />
        </IconButton>
      ),
    },
  ];

  const handleClose = () => {
    setOpen(false);
  };

  const rows = [
    // Replace with your data
  ];

 

  //  const remoteVideo = document.querySelector("video.remoteview");
  
  // let url = "ws://192.168.215.83:6503"
  // let url = "ws://192.168.43.147:6503";
  // let url = "ws://192.168.1.175:6503";


  //webcam and screenshare button handlers
  


  

    //user list

    //warnings
    //  if (message.type === "warnings") {
    //    const warning_table = document.getElementById("warning_logs");
    //    const student_obj = live_students[message.sid];
    //    const row = warning_table.rows[student_obj.rtc.index];
    //    for (const x in message.warnings) {
    //      student_obj.warnings[x] += 1;
    //    }
    //    const temp = student_obj.warnings;
    //    row.innerHTML = `
    //                                     <td>${message.name}</td>
    //                                     <td>${message.sid}</td>
    //                                     <td>
    //                                         <button class=webc onclick=webcbutton(${message.sid})>webcam</button>
    //                                         <button class=screen onclick=screenbutton(${message.sid})>screen</button>
    //                                         <button class=kick onclick=kickstudent(${message.sid})>kick</button>
    //                                     </td>
    //                                     <td>${temp.out_of_frame}</td>
    //                                     <td>${temp.mobile_detected}</td>
    //                                     <td>${temp.not_center}</td>
    //                                     <td>${temp.low_light}</td>
    //                                     <td>${temp.left}</td>
    //                                     <td>${temp.right}</td>
    //                                     <td>${temp.up}</td>
    //                                     <td>${temp.down}</td>`;
    //  }

    //new student added
    
   

    //student deleted
     
    //new ice candidate received
    
  //webrtc class declaration
 





  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Ongoing Exams" subtitle="Search for a particular exam" />
      </Box>

      {/* </Box> */}

      {/* GRID & CHARTS */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap="10px"
        pt="50px"
      >
        {/* <video ref={videoRef} autoPlay playsInline /> */}
        {showTable && (
          <Box m="20px">
            {/* <Header title="Exam" subtitle="Live exam monitoring" /> */}
            <Box
              m="-10px 0 0 0"
              height="75vh"
              width={"100%"}
              sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                  backgroundColor: "#ffffff",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                  // color: "#fff", // Text color
                  fontFamily: "monospace",
                  fontSize: 13,
                },
                "& .name-column--cell": {
                  color: "#1774D4", // Header text color
                  backgroundColor: "#1774D4", // Header background color
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 13, // Header title color
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#1774D4", // Header background color
                  borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: "#1774D4", // Table background color
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                  borderBottomLeftRadius: "4px",
                  borderBottomRightRadius: "4px",
                  backgroundColor: "#1774D4", // Footer background color
                  color: "#ffffff",
                },
                "& .MuiCheckbox-root": {
                  color: "#fff !important", // Checkbox color
                },
                "& .MuiDataGrid-row": {
                  backgroundColor: "#fff",
                  "&:hover": {
                    backgroundColor: "#f5f5f5 !important", // Hovered row background color (light grey)
                  }, // Row background color (white)
                },
                "& .MuiDataGrid-footer": {
                  // Footer background color
                  color: "#ffffff !important",
                },
                // "& .MuiDataGrid-row:hover": {
                //   backgroundColor: "#f5f5f5", // Hovered row background color (light grey)
                // },
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                style={{ width: 1000 }}
                className="datagrid-container"
              />
            </Box>
            <Dialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
              fullWidth
              maxWidth="md"
            >
              <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Modal title
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                <Typography gutterBottom>
                  Cras mattis consectetur purus sit amet fermentum. Cras justo
                  odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
                  risus, porta ac consectetur ac, vestibulum at eros.
                </Typography>
              </DialogContent>
              <DialogActions>{/* Add any actions you need */}</DialogActions>
            </Dialog>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
