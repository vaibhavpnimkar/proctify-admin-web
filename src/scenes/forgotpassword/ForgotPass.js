import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, TextField, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPass = () => {
  const navigate = useNavigate()
  // Step state: 1 for email, 2 for OTP, 3 for new password
  const [step, setStep] = useState(1);

  // State for form inputs
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  // Function to handle the "Next" button click
  const handleNext = async () => {
    if (step === 1 && email) {
      try {
        const response = await axios.patch('http://127.0.0.1:3002/api/v1/admin/forgotpassword', { email })
        console.log(response.data.otpsent)
        toast.success("Email sent")
        setStep(2);
      } catch (err) {
        console.log(err.response.data.msg)
        toast.error(err.response.data.msg)
      }
    } else if (step === 2 && otp) {
      try {
        const response = await axios.post('http://127.0.0.1:3002/api/v1/admin/verifyotp', { email, otp })
        console.log(response.data)
        toast.success("OTP verified")
        setStep(3);
      } catch (err) {
        console.log(err.response.data.msg)
        toast.error(err.response.data.msg)
      }
    }
  };

  // Function to handle the "Save" button click
  const handleSave = async () => {
    // Simulate password update (not implemented in this example)
    // Print new password and confirm password to the console
    console.log('New Password:', newPassword);
    console.log('Confirm Password:', confirmPassword);
    try {
      const response = await axios.post("http://127.0.0.1:3002/api/v1/admin/changepassword", { email, password: newPassword })
      console.log(response.data)
      toast.success("Password updated successfully")
      navigate('/login')
    }
    catch (err) {
      console.log(err.response.data.msg)
      toast.error(err.response.data.msg)
    }
  };

  // Function to validate the new password and confirm password
  const validatePassword = () => {
    if (newPassword !== confirmPassword) {
      return 'Passwords do not match.';
    } else if (newPassword.length < 8) {
      return 'Password must be at least 8 characters long.';
    } else {
      return null;
    }
  };

  // Function to render the form based on the current step
  const renderForm = () => {
    if (step === 1) {
      return (
        <div>
          <TextField
            label="Email"
            type='email'
            required
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
        </div>
      );
    } else if (step === 2) {
      return (
        <div>
          <TextField
            label="OTP"
            fullWidth
            required
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            margin="normal"
          />
        </div>
      );
    } else if (step === 3) {
      return (
        <div>
          <TextField
            label="New Password"
            fullWidth
            required
            variant="outlined"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Confirm Password"
            fullWidth
            required
            variant="outlined"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
          />
        </div>
      );
    } else {
      return null;
    }
  };

  const defaultTheme = createTheme();
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" sx={{
        display: 'flex',
        height: "100%",
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: "center"
      }}>
        <CssBaseline />

        <Typography variant="h5" gutterBottom>
          Forgot Password
        </Typography>

        {renderForm()}
        <Button
          variant="contained"
          color="primary"
          onClick={step === 3 ? handleSave : handleNext}
          sx={{ marginTop: '20px' }}
          disabled={step === 3 && validatePassword()}
        >
          {step === 3 ? 'Save' : 'Next'}
        </Button>
      </Container>
    </ThemeProvider>
  );
};

export default ForgotPass;
