import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../../components/Header';

const StudentDetails = () => {
  const theme = useTheme();
  const colors = theme.palette.mode === 'light' ? theme.palette.primary : theme.palette.secondary;
  const token = localStorage.getItem('token');
  const [options, setOptions] = useState([]);
  const [data, setData] = useState([]);
  const [optionchange, setOptionChange] = useState('');

  useEffect(() => {
    fetchdata();
  }, [optionchange]);

  const fetchdata = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:3002/api/v1/admin/getexams?examcode=${optionchange}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Set the fetched options in state
      setOptions(response.data.data);
    } catch (err) {
      console.log(err.response.data.msg);
      toast.error(err.response.data.msg);
    }
  };

  const change = (e) => {
    console.log(e.target.value);
    setOptionChange(e.target.value);
  };

  const searchquestion = async () => {
    try {
      console.log(optionchange);
      const response = await axios.get(
        `http://127.0.0.1:3002/api/v1/admin/getregisteredstudent/${optionchange}`,
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

  return (
    <Box m="20px">
      <Header title="Student Details" subtitle="Registered student details" />
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
          backgroundColor={colors[400]}
          borderRadius="3px"
          width="20rem"
        >
          <input
            style={{
              backgroundColor: '#e0e0e0',
              color: 'black',
              borderRadius: '10px 0px 0px 10px',
              width: '20rem',
              height: '3.2rem',
              padding: '10px',
              border: 'none',
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
              p: '15px',
              backgroundColor: '#0159ED',
              color: 'white',
              borderRadius: '0px 10px 10px 0px',
              border: 'none',
              '&:hover': { backgroundColor: '#1976d2' },
            }}
            onClick={searchquestion}
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>
      {data.length > 0 ? (
        <TableContainer component={Paper} sx={{marginTop:"20px"}}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(data[0]).map((column, index) => {
                  
                    return <TableCell key={index}>{column}</TableCell>;
                  
                
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.keys(row).map((column, colIndex) => {
                  
                      return <TableCell key={colIndex}>{row[column]}</TableCell>;
                    
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ):""}
    </Box>
  );
};

export default StudentDetails;
