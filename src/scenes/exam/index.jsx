import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Exam = ({ ws }) => {
  const videoref = React.useRef();
  // const [last_index, setLastIndex] = React.useState(0)
  // const [currStudent, setCurrStudent] = React.useState(null)
  // const [live_students, setLiveStudents] = React.useState({})
  let last_index = 0;
  let current_student = null;
  let live_students = {};
  const [msg, setMsg] = React.useState({});
  // React.useEffect(() => {
  //   setws(ws)
  // }, [])
  // React.useEffect(() => {
  //   //when connecting for the first time
  //   //we need to send the username
  //   const msgi = JSON.parse(localStorage.getItem('message'))
  //   console.log("hi", msgi);
  //   setMsg(msgi)
  //   onmessage(msgi)

  // }, [msg])
  window.addEventListener("storage", function (event) {
    // Check the event properties
    if (event.key === "message") {
      const msgi = JSON.parse(localStorage.getItem("message"));
      console.log("hi", msgi);
      setMsg(msgi);
      onmessage(msgi);
    }
  });

  const onmessage = async (msg) => {
    if (msg.type === "id") {
      console.log("ws connected");
      var newname = {
        type: "admindetails",
        name: "admin",
        id: msg.id,
        admin: "1234", //admin id
      };
      ws.send(JSON.stringify(newname));
    }

    //user list
    if (msg.type === "exam") {
      console.log("user list");
      if (msg.students.length === 0) {
        console.log("NO EXAMS ARE LIVE");
        return;
      }
    }
    //new student added
    if (msg.type === "add") {
      console.log("add student");
      last_index++;
      msg.index = last_index;

      live_students[msg.sid] = {
        rtc: new webrtc(msg),
      };
      console.log(live_students[msg.sid]);
    }

    //student deleted
    if (msg.type === "del") {
      console.log("delete student");
      last_index--;
      delete live_students[msg.sid];
    }
    //webrtc offer
    if (msg.type === "offer") {
      console.log("offer received");
      let student_connection = live_students[msg.sid];
      student_connection.rtc.handleOffer(msg);
    }

    //new ice candidate received
    if (msg.type === "new-ice-candidate") {
      console.log("new ice candidate:");
      let student_connection = live_students[msg.sid];
      console.log(student_connection);
      await student_connection.rtc.handleNewICECandidateMsg(msg);
    }
  };
  const config = {
    iceServers: [
      {
        urls: "turn:124.64.206.224:8800",
        username: "webrtc",
        credential: "turnserver",
      },
    ],
  };
  class webrtc {
    constructor(message) {
      console.log(message);
      this.exam = message.exam;
      this.id = message.sid;
      this.index = message.index;
      this.rc = new RTCPeerConnection(config);
      this.rc.ondatachannel = this.handleDataChannel.bind(this);
      this.rc.ontrack = this.handleTrackEvent.bind(this);
      this.rc.onicecandidate = this.handleICECandidateEvent.bind(this);
    }

    sendToServer(data) {
      data = JSON.stringify(data);
      ws.send(data);
    }
    handleDataChannel(evt) {
      this.rc.channel = evt.channel;
      this.rc.channel.onopen = () => console.log("channel is open...");
      this.rc.channel.onclose = () => console.log("channel is closed...");
      this.rc.channel.onmessage = (msg) =>
        console.log("channel message:" + msg.data);
    }
    handleTrackEvent(evt) {
      console.log("track");
      videoref.current.srcObject = evt;
    }

    handleICECandidateEvent(event) {
      if (event.candidate) {
        console.log("*** Outgoing ICE candidate: " + event.candidate.candidate);
        this.sendToServer({
          type: "new-ice-candidate",
          target: this.id,
          to: "student",
          exam: this.exam,
          candidate: event.candidate,
          from: "admin",
        });
      }
    }

    async handleOffer(msg) {
      let sdp = msg.sdp;
      let desc = new RTCSessionDescription(sdp);
      await this.rc.setRemoteDescription(desc);
      await this.rc.setLocalDescription(await this.rc.createAnswer());
      this.sendToServer({
        name: "admin",
        target: this.id,
        exam: this.exam,
        type: "answer",
        sdp: this.rc.localDescription,
      });
    }

    async handleNewICECandidateMsg(msg) {
      var candidate = new RTCIceCandidate(msg.candidate);
      console.log(
        "*** Adding received ICE candidate: " + JSON.stringify(candidate)
      );
      try {
        await this.rc.addIceCandidate(candidate);
      } catch (err) {
        console.log("err:" + err);
      }
    }
  }
  console.log("hi from exam:", ws);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const columns = [
    {
      field: "id",
      headerName: "ID",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Student Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "student_id",
      headerName: "Student ID",
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "out_of_frame",
      headerName: "Out of Frame",
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mobile_detected",
      headerName: "Mobile Detected",
      type: "number",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "not_center",
      headerName: "Not Center",
      type: "number",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "noise_detected",
      headerName: "Noise Detected",
      type: "number",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "web_cam",
      headerName: "Web Cam",
      type: "number",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { web_cam } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={colors.greenAccent[600]}
            borderRadius="4px"
            sx={{
              cursor: "pointer",
              cursor: "pointer",
            }}
            onClick={handleClickOpen}
          >
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              Webcam
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "screen_share",
      headerName: "Screen Share",
      type: "number",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { scree_share } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={colors.greenAccent[600]}
            borderRadius="4px"
            sx={{
              cursor: "pointer",
              cursor: "pointer",
            }}
            onClick={handleClickOpen}
          >
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              Screen
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "remove_user",
      headerName: "Remove User",
      type: "number",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { remove_user } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={colors.greenAccent[600]}
            borderRadius="4px"
            sx={{
              cursor: "pointer",
              cursor: "pointer",
            }}
            onClick={handleClickOpen}
          >
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              Remove
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <div>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Modal title
          </DialogTitle>
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
          <DialogContent dividers>
            <Typography gutterBottom>
              Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
              dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
              ac consectetur ac, vestibulum at eros.
            </Typography>
          </DialogContent>
        </BootstrapDialog>
      </div>
      <Header title="Exam" subtitle="Live exam monitoring" />
      {/* <video ref={videoref} autoPlay srcObject={videoref.current}  playsInline controls/> */}
      <Box
        m="-10px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            borderBottomLeftRadius: "4px",
            borderBottomRightRadius: "4px",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid rows={mockDataTeam} columns={columns} />
      </Box>
    </Box>
  );
};

export default Exam;
