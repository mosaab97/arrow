import React, { useState, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { updateUserPass } from "../../services.js/user";
import MainContext from "../../context/main/mainContext";
import { ERROR, SUCCESS } from "../../context/types/mainTypes";

const initState = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};
export default function ChangePassword({ setActivePage }) {
  const { setFeedBack } = useContext(MainContext);
  const [state, setState] = useState(initState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, oldPassword, confirmPassword } = state;
    if (!newPassword || !oldPassword || !confirmPassword) {
      setFeedBack({
        type: ERROR,
        msg: "Fill all required fields",
        open: true,
      });
      return;
    } else if (newPassword !== confirmPassword) {
      setFeedBack({
        type: ERROR,
        msg: "Password Does not match",
        open: true,
      });
      return;
    }
    try {
      await updateUserPass(state);
      setFeedBack({
        type: SUCCESS,
        msg: "Password updated successfully",
        open: true,
      });
    } catch (error) {
      if (error && error.response) {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
        setFeedBack({
          type: ERROR,
          msg:
            error.response.data.error ||
            "Please check the fields and try again",
          open: true,
        });
      } else {
        setFeedBack({
          type: ERROR,
          msg: "Please check the fields and try again",
          open: true,
        });
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Update Password
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                type="password"
                name="oldPassword"
                required
                fullWidth
                id="oldPassword"
                label="Old Password"
                autoFocus
                onChange={handleChange}
                value={state.oldPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                required
                fullWidth
                id="newPassword"
                label="New Password"
                name="newPassword"
                onChange={handleChange}
                value={state.newPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                required
                fullWidth
                id="confirmPassword"
                label="Confirm Password"
                name="confirmPassword"
                autoComplete="confirmPassword"
                onChange={handleChange}
                value={state.confirmPassword}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Update Password
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
