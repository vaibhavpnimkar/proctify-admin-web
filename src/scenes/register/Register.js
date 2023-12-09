import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const defaultTheme = createTheme();

export default function Register() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phoneno: '',
    password: '',
  });
  const [showOTPForm, setShowOTPForm] = useState(false); // Control OTP form visibility
  const [resotp,setresotp]=useState('')
  const [otp, setOtp] = useState(''); // Store user-entered OTP
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(values);
    try {
      // Send user registration data to the server
      const response = await axios.post(
        'http://127.0.0.1:3002/api/v1/admin/emailverification',
        {email:values.email}
      );
      setresotp(response.data.otp);
      toast.success('Registration Successful');
      setShowOTPForm(true); // Show OTP form after successful registration
    } catch (err) {
      console.log(err.response.data.msg);
      toast.error(err.response.data.msg);
    }
  };

  const handleOTPSubmit = async (event) => {
    event.preventDefault();
    if (resotp==otp) {      
        try {
          // Send OTP to the server for verification
          const response = await axios.post(
            'http://127.0.0.1:3002/api/v1/admin/register',
            values // Send email and OTP for verification
          )
            console.log(response.data)
            toast.success('OTP Verified. Registration Complete');
            navigate('/login'); // Navigate to the login page after successful registration
          }
        catch (err) {
          console.log(err.response.data.msg);
          toast.error(err.response.data.msg);
        }
    }
    else{
        toast.error("Invalid OTP")
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          {!showOTPForm ? (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoFocus
                onChange={(e) =>
                  setValues({ ...values, name: e.target.value })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Email"
                name="username"
                type="email"
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value.toLowerCase() })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="phoneno"
                label="Phone No"
                name="phoneno"
                type="number"
                onChange={(e) =>
                  setValues({ ...values, phoneno: e.target.value })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleOTPSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                label="OTP"
                name="otp"
                value={otp}
                autoFocus
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={handleOTPSubmit}
                sx={{ mt: 3, mb: 2 }}
              >
                Verify OTP
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
