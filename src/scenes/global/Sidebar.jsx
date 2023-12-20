import React, { useState } from "react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import { Box, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import CreateIcon from "@mui/icons-material/Create";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import Chat from "@mui/icons-material/Chat";
import AIMonitor from "../AIMonitor";
import { Person2TwoTone } from "@mui/icons-material";

const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: "white",
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ isSticky }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{

        position: isSticky ? "sticky" : "relative", // Make it sticky
        minWidth: "270px",
        top: "0", // Adjust as needed
        height: "100vh", // Limit height
        "& .pro-sidebar": {
          zIndex: "100", // Adjust as needed
          overflowY: "auto", // Enable scrolling
        },
        "& .pro-sidebar-inner": {
          background: `${colors.primary[200]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          borderRadius: "15px"
        },
        "& .pro-item-content": {
          fontSize: "18px"
        },
        "& .pro-inner-item p": {
          fontSize: "16px"
        },
        "& .pro-inner-item:hover": {
          color: "#0159ED !important",
          background: "#ffffff !important"
        },
        "& .pro-menu-item": {
          marginBottom: "10px",
          borderRadius: "15px"
        },
        "& .pro-menu-item.active": {
          color: "#0159ED !important",
          background: "#ffffff !important",

        },
      }}
    >
      <ProSidebar collapsed={false}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <Box mb="25px" mt="50px">
            <Box textAlign="center">
              <Typography
                variant="h2"
                color="white"
                fontWeight="bold"
                sx={{ m: "10px 0 0 0" }}
              >
                Proctor
              </Typography>

            </Box>
          </Box>


          <Box >
            <Item
              title="Ongoing Exams"
              to=""
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <SubMenu title="Create Exam" icon={<AppRegistrationIcon />} style={{
              color: "white"
            }}>
              <Item
                title="Create New Exam"
                to="new_exam"
                icon={<CreateIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Existing Exam"
                to="existing_exam"
                icon={<EventRepeatOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

            </SubMenu>
            <Item
              title="Generate Question"
              to="generate_question"
              icon={<PostAddOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <SubMenu title="View Exams" icon={<PreviewOutlinedIcon />} style={{
              color: "white",
            }}>

              <Item
                title="Edit New Exam"
                to="edit_exams"
                icon={<BorderColorOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Past Exams"
                to="past_exams"
                icon={<HistoryOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>

            <Item
              title="View Questions"
              to="view_questions"
              icon={<NoteAltOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Student Details"
              to="student_details"
              icon={<FolderSharedOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Publish Result"
              to="publish_results"
              icon={<UploadFileOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Edit Profile"
              to="edit_profile"
              icon={<AccountCircleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Chat"
              to="chat"
              icon={<Chat />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="AI Monitor"
              to="/global/aimon"
              icon={<Person2TwoTone />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
