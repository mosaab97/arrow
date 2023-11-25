import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { login } from '../../services.js/user';
import MainContext from '../../context/main/mainContext';
import { LOGIN } from '../../context/types/mainTypes';
import { Avatar, Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';

function Login() {
  const navigate = useNavigate();
  const { dispatch } = useContext(MainContext);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState({email: '', msg: ''});

  useEffect(() => {
  const effect = () => {
      if(localStorage.getItem('loggedInUser')) {
        const user = JSON.parse(localStorage.getItem('loggedInUser'))
        dispatch({ type: LOGIN, payload: {token: localStorage.getItem('token')} });
        navigateUser(user.userRole)
      }
    }
    effect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const navigateUser = (userRole) => {
    if(userRole === 'admin') {
      navigate("/admin");
    } else {
      navigate('/user')
    }
  }
  
  const isValidEmail = (email) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailPattern.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === 'email' && !isValidEmail(value)) {
      setCredentials({ ...credentials, [name]: value });
      setError({ ...error, email: 'email must be valid' });
    } else {
      setCredentials({ ...credentials, [name]: value });
      setError({ ...error, email: '' });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault()
    if(error.email || !credentials.email || !credentials.password) {
      setError({...error, msg: 'Check all fields'})
      return;
    }
    try {
      // Send a POST request to your login API
      const response = await login(credentials);

      if (response.status === 200) {
        dispatch({ type: LOGIN, payload: response.data });
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('loggedInUser', JSON.stringify(response.data.user))
        navigateUser(response.data.user.userRole)
      } else {
        setError({...error, msg: 'Invalid email or password'}); // Show error message
      }
    } catch (error) {
        setError({...error, msg: 'An error occurred while logging in'}); // Show error message
    }
  };

  function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Arrow
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
  
  // TODO remove, this demo shouldn't need to reset the theme.
  
  const defaultTheme = createTheme();
  
    return (
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: 'url(/ARROW-logos.jpeg)', //url(https://source.unsplash.com/random?wallpapers)
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                  error={error.email}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="Email"
                  value={credentials.email}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleChange}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Typography component='div' color='red'>{error.msg}</Typography>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
                {/* <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid> */}
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    )
}

export default Login;
