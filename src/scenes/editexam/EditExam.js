import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import AddIcon from '@mui/icons-material/Add';
import Header from '../../components/Header';
import Slide from '@mui/material/Slide';
import axios from 'axios';
import toast from 'react-hot-toast';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditExam = () => {
  // Initial state for exams
  const [exams, setExams] = useState([]);

  // State for edited exam and dialog visibility
  const [editedExam, setEditedExam] = useState(null);

  // State to hold new exam data
  const [newExamData, setNewExamData] = useState(null);

  // State to store the index of the edited exam in the exams array
  const [editedExamIndex, setEditedExamIndex] = useState(-1);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    try {
      const response = await axios.get(
        'http://127.0.0.1:3002/api/v1/admin/getallnewexams',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data } = response.data;
      data.forEach((exam) => {
        if (exam.details) {
          exam.details = JSON.parse(exam.details);
        }
      });
      console.log(data)
      setExams(data);
    } catch (err) {
      console.error(err.response.data.msg);
      toast.error(err.response.data.msg);
    }
  };

  // Function to handle clicking the "Edit" button
  const handleEditClick = (exam, index) => {
    setEditedExam({ ...exam });
    setEditedExamIndex(index);
  };

  // Function to add a new field set to the edited exam
  const handleAddFieldSet = () => {
    if (editedExam) {
      const newFieldSet = { name: '', type: 'date' };
      const updatedStudentDetails = [
        ...(editedExam.details || []),
        newFieldSet,
      ];
      setEditedExam({ ...editedExam, details: updatedStudentDetails });
    }
  };

  // Function to delete a field set from the edited exam
  const handleDeleteFieldSet = (index) => {
    if (editedExam) {
      const updatedStudentDetails = [...editedExam.details];
      updatedStudentDetails.splice(index, 1);
      setEditedExam({ ...editedExam, details: updatedStudentDetails });
    }
  };

  // Function to update an exam
  const handleUpdateExam = async () => {
    const startdate = editedExam.startdate.split("T")[0]
    const last_registration_date = editedExam.last_registeration_date.split("T")[0]
    editedExam['startdate'] = startdate
    editedExam['last_registeration_date'] = last_registration_date
    if (editedExamIndex >= 0) {
      try {
        // Make an API call to update the exam with editedExam data
        await axios.post(
          `http://127.0.0.1:3002/api/v1/admin/updateexam/${editedExam.examcode}`,
          editedExam,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedExams = [...exams];
        updatedExams[editedExamIndex] = { ...editedExam };
        setExams(updatedExams);

        // Close the edit dialog
        setEditedExam(null);
        setEditedExamIndex(-1);

        // Console log the updated exam data
        console.log('Updated Exam Data:', editedExam);

        // Show a success toast
        toast.success('Exam updated successfully');
      } catch (err) {
        console.error(err.response.data.msg);
        toast.error(err.response.data.msg);
      }
    }
  };

  const handleDeleteExam = async (exam) => {
    try {
      await axios.delete(
        `http://127.0.0.1:3002/api/v1/admin/deleteexam/${exam.examcode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove the deleted exam from the exams state
      const updatedExams = exams.filter((e) => e.examcode !== exam.examcode);
      setExams(updatedExams);

      // Show a success toast
      toast.success('Exam deleted successfully');
    } catch (err) {
      console.error(err.response.data.msg);
      toast.error(err.response.data.msg);
    }
  };

  return (
    <Box m="20px">
      {/* Header */}
      <Header title="Edit Exams" subtitle="Manage exams and student details" />

      {/* List of Exams */}
      {exams.map((exam, index) => (
        <Paper key={exam.examcode} elevation={4} style={{ padding: '16px', marginBottom: '16px' }}>
          <Typography variant="h5" sx={{ marginBottom: '16px' }}>
            {exam.exam_name}
          </Typography>
          <Typography sx={{ marginBottom: '16px' }}>
            Exam Date: {dayjs(exam.startdate).format('YYYY-MM-DD')}
            <br />
            Start Time: {dayjs(exam.starttime, 'HH:mm:ss').format('HH:mm')}
            <br />
            End Time: {dayjs(exam.endtime, 'HH:mm:ss').format('HH:mm')}
            <br />
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="end">
            <Button
              color="secondary"
              variant="contained"
              onClick={() => handleEditClick(exam, index)}
              sx={{ marginRight: '16px' }}
            >
              Edit
            </Button>
            <Button color="error" variant="contained" onClick={() => handleDeleteExam(exam)}>
              Delete
            </Button>
          </Box>
        </Paper>
      ))}

      {/* Edit Exam Dialog */}
      <Dialog open={!!editedExam} onClose={() => setEditedExam(null)} fullScreen TransitionComponent={Transition}>
        <DialogTitle sx={{ fontSize: '25px', fontWeight: 'bold' }}>Edit Exam</DialogTitle>
        <DialogContent>
          {editedExam && (
            <>
              {/* Exam Details */}
              <Header subtitle="Edit exam details:" />
              <TextField
                fullWidth
                required
                type="text"
                label="Exam Name"
                name="exam_name"
                value={editedExam.exam_name || ''}
                onChange={(e) =>
                  setEditedExam({ ...editedExam, exam_name: e.target.value })
                }
                sx={{ marginBottom: 2 }}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']} sx={{ marginBottom: 2 }}>
                  <DatePicker
                    label="Select Date"
                    name="startdate"
                    sx={{ width: '100%' }}
                    value={editedExam.startdate ? dayjs(editedExam.startdate) : null}
                    onChange={(e) =>
                      setEditedExam({ ...editedExam, startdate: e ? e.format() : null })
                    }
                  />
                </DemoContainer>
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['TimePicker']} sx={{ marginBottom: 2 }}>
                  <TimePicker
                    label="Start Time"
                    name="starttime"
                    sx={{ width: '100%' }}
                    value={editedExam.starttime ? dayjs(editedExam.starttime, 'HH:mm:ss') : null}
                    onChange={(e) =>
                      setEditedExam({ ...editedExam, starttime: e ? e.format('HH:mm:ss') : null })
                    }
                  />
                </DemoContainer>
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['TimePicker']} sx={{ marginBottom: 2 }}>
                  <TimePicker
                    label="End Time"
                    name="endtime"
                    sx={{ width: '100%' }}
                    value={editedExam.endtime ? dayjs(editedExam.endtime, 'HH:mm:ss') : null}
                    onChange={(e) =>
                      setEditedExam({ ...editedExam, endtime: e ? e.format('HH:mm:ss') : null })
                    }
                  />
                </DemoContainer>
              </LocalizationProvider>

              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                name="duration"
                required
                value={editedExam.duration || ''}
                onChange={(e) =>
                  setEditedExam({ ...editedExam, duration: e.target.value })
                }
                sx={{ marginBottom: 2 }}
              />

              <TextField
                fullWidth
                type="number"
                required
                label="Negative Marking (%)"
                name="negative_marks"
                value={editedExam.negative_marks || ''}
                onChange={(e) =>
                  setEditedExam({ ...editedExam, negative_marks: e.target.value })
                }
                sx={{ marginBottom: 2 }}
              />

              <TextField
                fullWidth
                type="number"
                required
                label="Question Weightage"
                name="question_weightage"
                value={editedExam.question_weightage || ''}
                onChange={(e) =>
                  setEditedExam({ ...editedExam, question_weightage: e.target.value })
                }
                sx={{ marginBottom: 2 }}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DemoContainer components={['DatePicker']} sx={{ gridColumn: 'span 2' }}>
                  <DatePicker
                    label="Last date for registration"
                    name="latexam_date"
                    sx={{ width: '100%', marginBottom: 2 }}
                    value={editedExam.last_registeration_date ? dayjs(editedExam.last_registeration_date) : null}
                    onChange={(e) =>
                      setEditedExam({ ...editedExam, last_registeration_date: e ? e.format() : null })
                    }
                  />
                </DemoContainer>
              </LocalizationProvider>
              <FormControl sx={{ marginBottom: 2 }}>
                <FormLabel id="demo-controlled-radio-buttons-group">Exam Mode</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="mode"
                  value={editedExam.mode || 'AUTO'}
                  onChange={(e) => setEditedExam({ ...editedExam, mode: e.target.value })}
                >
                  <FormControlLabel value="AUTO" control={<Radio />} label="Auto" />
                  <FormControlLabel value="LIVE" control={<Radio />} label="Live" />
                </RadioGroup>
              </FormControl>

              <FormControl sx={{ marginBottom: 2 }}>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  Randomized student question formats?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="israndom"
                  value={editedExam.israndom || true}
                  onChange={(e) =>
                    setEditedExam({ ...editedExam, israndom: e.target.value })
                  }
                >
                  <FormControlLabel value={true} control={<Radio />} label="Yes" />
                  <FormControlLabel value={false} control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>

              {/* Student Details */}
              <Header subtitle="Edit student details:" />
              {editedExam.details &&
                editedExam.details.map((fieldSet, index) => (
                  <Paper
                    key={index}
                    elevation={3}
                    style={{ padding: '16px', marginBottom: '16px' }}
                  >
                    <Grid container spacing={2} style={{ justifyContent: 'space-evenly' }}>
                      <Grid item xs={6}>
                        <TextField
                          label={`Requirement`}
                          fullWidth
                          value={fieldSet.name || ''}
                          onChange={(e) =>
                            setEditedExam({
                              ...editedExam,
                              details: editedExam.details.map(
                                (item, i) =>
                                  i === index
                                    ? { ...item, name: e.target.value }
                                    : item
                              ),
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <TextField
                          label="Format"
                          select
                          fullWidth
                          value={fieldSet.type || 'date'}
                          onChange={(e) =>
                            setEditedExam({
                              ...editedExam,
                              details: editedExam.details.map(
                                (item, i) =>
                                  i === index
                                    ? { ...item, type: e.target.value }
                                    : item
                              ),
                            })
                          }
                        >
                          <MenuItem value="date">Date</MenuItem>
                          <MenuItem value="number">Number</MenuItem>
                          <MenuItem value="text">Text</MenuItem>
                          <MenuItem value="email">Email</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton
                          onClick={() => handleDeleteFieldSet(index)}
                          size="small"
                          style={{ marginLeft: 'auto', color: 'red' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              <Box
                display="flex"
                justifyContent="end"
                mt="20px"
                sx={{ pl: '6px', pr: '6px', pt: '2px', pb: '2px' }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAddFieldSet}
                >
                  <AddIcon />
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditedExam(null)} color="error" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleUpdateExam} color="secondary" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditExam;
