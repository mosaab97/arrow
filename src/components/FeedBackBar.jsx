import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import MainContext from "../context/main/mainContext";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function FeedBackBar() {
  const { feedBack, setFeedBack } = React.useContext(MainContext);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setFeedBack({ ...feedBack, open: false });
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={feedBack.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={feedBack.type}
          sx={{ width: "100%" }}
        >
          {feedBack.msg}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
