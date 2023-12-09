import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import toast from 'react-hot-toast';

const defaultTheme = createTheme();

export default function SignIn() {

    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(values)
        try {
            const response = await axios.post('http://127.0.0.1:3002/api/v1/admin/login', values)
            console.log(response.data.token)
            localStorage.setItem('token', response.data.token)
            toast.success('Login Successful');
            navigate("/global")
        }
        catch (err) {
            console.log(err.response.data.msg)
            toast.error(err.response.data.msg);
        }

    }


    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs" sx={{
                display: 'flex',
                height: "100%",
                alignItems: 'center',
            }}>
                <CssBaseline />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >

                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoFocus
                            onChange={e => setValues({ ...values, email: e.target.value.toLowerCase() })}
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
                            onChange={e => setValues({ ...values, password: e.target.value })}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Link href="/register" variant="body2">
                                    {"New User? Register Yourself"}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/forgotpassword" variant="body2">
                                    {"Forgot Password?"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

            </Container>
            
        </ThemeProvider>
    );
}