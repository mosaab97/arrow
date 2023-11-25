import React, { useState, useContext, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { createUser, updateUser, uploadLogo } from "../../services.js/user";
import MainContext from "../../context/main/mainContext";
import {
  CREATE_USER,
  ERROR,
  SUCCESS,
  WARN,
} from "../../context/types/mainTypes";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const initState = {
  userName: "",
  email: "",
  password: "",
  address: "",
  phoneNumber: "",
  displayName: "",
  logo: "",
  logoFile: null,
};
export default function CreateUser({ setActivePage }) {
  const { dispatch, mainState, setFeedBack } = useContext(MainContext);
  const [newUser, setNewUser] = useState(mainState.selectedUser || initState);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    if (mainState.selectedUser) {
      setIsUpdate(true);
      setNewUser(mainState.selectedUser);
    } else {
      setIsUpdate(false);
      setNewUser(initState);
    }
  }, [mainState.selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
    if (name === "logo") {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("logo", file);
      setNewUser({
        ...newUser,
        logo: e.target.files[0].name,
        logoFile: formData,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userName, email, address, phoneNumber, displayName, logoFile } =
      newUser;
    if (!email || !address || !displayName || !phoneNumber || !userName) {
      setFeedBack({
        type: ERROR,
        msg: "Fill all required fields",
        open: true,
      });
      return;
    }
    try {
      // Send a POST request to your login API
      if (isUpdate) {
        const response = await updateUser({ ...newUser, userId: newUser.id });
        if (logoFile) {
          const logo = await uploadLogo(newUser.id, logoFile);
          if (logo.status === 200) {
            setFeedBack({
              type: SUCCESS,
              msg: "User updated successfully",
              open: true,
            });
          } else {
            setFeedBack({
              type: WARN,
              msg: "User updated  without the logo",
              open: true,
            });
          }
        } else {
          setFeedBack({
            type: WARN,
            msg: "User updated  without the logo",
            open: true,
          });
        }
        setActivePage("Users");
      } else {
        const response = await createUser({
          ...newUser,
          userRole: "user",
          logo: "logo.com",
        });
        dispatch({ type: CREATE_USER, payload: response.data });
        if (logoFile) {
          const logo = await uploadLogo(response.data.user.id, logoFile);
          if (logo.status === 200) {
            setFeedBack({
              type: SUCCESS,
              msg: "User created successfully",
              open: true,
            });
          } else {
            setFeedBack({
              type: WARN,
              msg: "User cteated  without the logo",
              open: true,
            });
          }
        } else {
          setFeedBack({
            type: WARN,
            msg: "User cteated  without the logo",
            open: true,
          });
        }
        setActivePage("Users");
      }
    } catch (error) {
      if (error && error.response && error.response.status === 401) {
        localStorage.clear();
        window.location.href = "/";
      }
      setFeedBack({
        type: ERROR,
        msg: "Please check the fields and try again",
        open: true,
      }); // Show error message
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
          {isUpdate ? `Update ${newUser.userName}` : "Sign up"}
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="displayName"
                required
                fullWidth
                id="displayName"
                label="Display Name"
                autoFocus
                onChange={handleChange}
                value={newUser.displayName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="userName"
                label="User Name"
                name="userName"
                autoComplete="family-name"
                onChange={handleChange}
                value={newUser.userName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                value={newUser.email}
              />
            </Grid>
            {!isUpdate && (
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handleChange}
                  value={newUser.password}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="address"
                label="Address"
                name="address"
                autoComplete="address"
                onChange={handleChange}
                value={newUser.address}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="phoneNumber"
                label="Phone Number"
                name="phoneNumber"
                autoComplete="phoneNumber"
                onChange={handleChange}
                value={newUser.phoneNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleChange}
                  id="logo"
                  label="Upload Logo"
                  name="logo"
                />
              </Button>
              {newUser.logo}
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            {isUpdate ? `Update ${newUser.userName}` : "Sign up"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
