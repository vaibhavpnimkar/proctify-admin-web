import React, { useEffect, useState } from 'react';
import {Typography} from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const ExamDetailsPopup = ({ open, onClose, examDetail }) => {
  const token = localStorage.getItem('token')
  const [detail, setDetail] = useState([])
  const [error, setError] = useState('');

  useEffect(() => {
    fetchdata(examDetail)
  },[])

  const fetchdata = async (code) => {
    try {
      const response = await axios.get(`http://127.0.0.1:3002/api/v1/admin/getexamlog/${code}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log(response.data.data)
      setDetail(response.data.data)

    }
    catch (err) {
      console.log(err.response.data.msg)
      setError(err.response.data.msg)
      
    }
  }
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl"  >
      <DialogContent >
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <h2>Exam Details</h2>
        {detail.length !== 0 ? <TableContainer component={Paper} sx={{backgroundColor:"#e0e0e0"}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>CV Based</TableCell>
                <TableCell>Mobile Detected</TableCell>
                <TableCell>Suspicious Act</TableCell>
                <TableCell>Noise Detected</TableCell>
                <TableCell>Out of Frame</TableCell>
                <TableCell>Not in Center</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detail.map((row) => (
                <TableRow key={row.sid}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.cv_based_warnings}</TableCell>
                  <TableCell>{row.mobile_detected}</TableCell>
                  <TableCell>{row.system_warnings}</TableCell>
                  <TableCell>{row.noise_warnings}</TableCell>
                  <TableCell>{row.out_of_frame}</TableCell>
                  <TableCell>{row.not_center}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> : <Typography variant="h5" component="div" color="black" align='center'>
          {error}
        </Typography>}
      </DialogContent>
    </Dialog>
  );
};

export default ExamDetailsPopup;
