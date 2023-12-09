import React from 'react';
import { Box, Button, Typography } from "@mui/material";
import { Outlet } from 'react-router-dom'; // Import Link from React Router
import Card from '@mui/material/Card';
import Header from "../../components/Header";
import CardContent from '@mui/material/CardContent';
import ExamDetailsPopup from './ExamDetailsPopup';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PastExams = () => {
    const [exams, setExams] = useState([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState([]);
    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchdata()
    }, [])

    const fetchdata = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:3002/api/v1/admin/getallpastexams', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log(response.data.data)
            setExams(response.data.data)

        }
        catch (err) {
            console.log(err.response.data.msg)
            toast.error(err.response.data.msg)
        }
    }

    const handleViewDetails = (exam) => {
        setSelectedExam(exam)
        console.log(exam);
        setPopupOpen(true);

    };
    return (
        <Box m="20px">
            {/* HEADER */}
            {/* <Outlet> */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Past Exams" subtitle="View logs of past exams" />
            </Box>
            <Outlet />
            {exams.map((exam) => (
                <Card
                    elevation={4}
                    key={exam.adminid}
                    style={{ marginBottom: '16px' }}
                >
                    <CardContent>
                        <Typography variant="h5" component="div" color="black" fontWeight="bold">
                            {exam.exam_name}
                        </Typography>
                        <Typography color="black">
                            Date: {exam.startdate}
                        </Typography>

                        {/* Use Button component for the "View Details" link */}
                        <Button
                            variant="contained"
                            color="secondary"
                            style={{ marginTop: '16px' }}
                            onClick={() => handleViewDetails(exam.examcode)}
                        >
                            View Details
                        </Button>
                    </CardContent>
                </Card>
            ))}
            {/* </Outlet> */}
            {/* Render the ExamDetailsPopup component when the popupOpen state is true */}
            {popupOpen && selectedExam.length !== 0 && (
                <ExamDetailsPopup
                    open={popupOpen}
                    onClose={() => setPopupOpen(false)}
                    examDetail={selectedExam}
                />
            )}
        </Box>
    );
};

export default PastExams;
