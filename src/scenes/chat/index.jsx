import { Box, Input, Typography, useTheme } from "@mui/material";
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



const Chat = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    const [message, setMessage] = React.useState('');

    const columns = [
        {
          field: "name",
          headerName: "Name",
          width: 200,
          renderCell: (params) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              
              <Typography
                variant="body2"
                className="name-column--cell"
                sx={{
                  fontWeight: "bold",
                }}
              >
                {params.row.name}
              </Typography>
            </Box>
          ),
        },
        {
          field: "email",
          headerName: "Email",
          width: 200,
        },
        {
          field: "role",
          headerName: "Role",
          width: 200,
        },
        {
          field: "action",
          headerName: "Action",
          width: 200,
          renderCell: (params) => (
            <Button
              variant="contained"
              onClick={() => {
                console.log("SEND;" + message + ";TO;" + params.row.name + ';;');
              }}
            >
              Send Message
            </Button>
          ),
        },
      ];

  return (
    <Box m="20px">
      <div>

      </div>
      <Header title="Chat" subtitle="Message student in live-exam" />
      <Box m="10px" p="10px">
        Message: 
        <Input placeholder="Message" fullWidth={true} id="message" multiline={true} onChange={(e)=>{
            setMessage(e.target.value);
        }} />
      </Box>
      
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
        <DataGrid
          rows={mockDataTeam}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          onSelectionModelChange={(e) => {
            console.log(e);
          }}
        />
      </Box>
    </Box>
  );
};

export default Chat;
