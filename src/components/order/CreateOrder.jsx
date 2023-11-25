import React, { useState, useContext } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import MainContext from "../../context/main/mainContext";
import { CREATE_ORDER, ERROR, SUCCESS } from "../../context/types/mainTypes";
import { createOrder } from "../../services.js/order";

const ORDER_STATUS = [
  "received",
  "in progress",
  "delivered",
  "returned before delivery",
  "returned after delivery",
  "cancelled",
];
const initOrder = {
  receiptNumber: "",
  receivedDate: new Date(),
  deliveryDate: new Date(),
  deliveryAddress: "",
  deliveryPrice: 0,
  orderPrice: 0,
  orderStatus: "received",
  customerPhone: "",
  comment: "",
  userId: null,
};

export default function CreateOrder() {
  const { dispatch, mainState, setFeedBack } = useContext(MainContext);
  const { userList } = mainState;

  const [newOrder, setNewOrder] = useState(initOrder);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      receiptNumber,
      receivedDate,
      deliveryDate,
      deliveryAddress,
      deliveryPrice,
      orderPrice,
      orderStatus,
      customerPhone,
      userId,
    } = newOrder;
    if (
      !receiptNumber ||
      !receivedDate ||
      !deliveryDate ||
      !deliveryAddress ||
      !deliveryPrice ||
      !orderPrice ||
      !orderStatus ||
      !customerPhone ||
      !userId
    ) {
      setFeedBack({
        type: ERROR,
        msg: "Check all required fields",
        open: true,
      });
      return;
    }
    try {
      // Send a POST request to your login API
      const data = {
        ...newOrder,
        userId: userId.id,
        fullPrice: parseFloat(orderPrice) + parseFloat(deliveryPrice),
        deliveryDate: moment(deliveryDate).format("YYYY-MM-DD"),
        receivedDate: moment(receivedDate).format("YYYY-MM-DD"),
      };
      const response = await createOrder(data);
      dispatch({ type: CREATE_ORDER, payload: response.data });
      setFeedBack({
        type: SUCCESS,
        msg: `Order Created for ${newOrder.userId.displayName}`,
        open: true,
      });
      setNewOrder({ ...initOrder, userId: newOrder.userId });
    } catch (error) {
      if (error && error.response && error.response.data) {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
        error.response.data.error
          ? setFeedBack({
              type: ERROR,
              msg: error.response.data.error,
              open: true,
            })
          : setFeedBack({
              type: ERROR,
              msg: "Somthing went wrong check the fields and try again",
              open: true,
            });
      } else {
        setFeedBack({
          type: ERROR,
          msg: "Somthing went wrong check the fields and try again",
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
          <LocalShippingIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create Order
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="user">User</InputLabel>
                <Select
                  labelId="user"
                  id="userId"
                  name="userId"
                  value={newOrder.userId}
                  label="User"
                  onChange={handleChange}
                >
                  {userList.map((user) => (
                    <MenuItem id={user.id} value={user}>
                      {user.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="receiptNumber"
                label="Receipt Number"
                name="receiptNumber"
                onChange={handleChange}
                value={newOrder.receiptNumber}
              />
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  name="receivedDate"
                  required
                  fullWidth
                  id="receivedDate"
                  label="Received Date"
                  value={newOrder.receivedDate}
                  onChange={(newValue) =>
                    setNewOrder({ ...newOrder, receivedDate: newValue })
                  }
                  format="yyyy/MM/dd"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  required
                  fullWidth
                  id="deliveryDate"
                  label="Delivery Date"
                  name="deliveryDate"
                  value={newOrder.deliveryDate}
                  onChange={(newValue) =>
                    setNewOrder({ ...newOrder, deliveryDate: newValue })
                  }
                  format="yyyy/MM/dd"
                />
              </Grid>
            </LocalizationProvider>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="orderPrice"
                label="Order Price"
                name="orderPrice"
                onChange={handleChange}
                value={newOrder.orderPrice}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="deliveryPrice"
                label="Delivery Price"
                type="deliveryPrice"
                id="deliveryPrice"
                onChange={handleChange}
                value={newOrder.deliveryPrice}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="customerPhone"
                label="Customer Phone Number"
                name="customerPhone"
                onChange={handleChange}
                value={newOrder.customerPhone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="deliveryAddress"
                label="Delivery Address"
                name="deliveryAddress"
                onChange={handleChange}
                value={newOrder.deliveryAddress}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="orderStatus">Order Status</InputLabel>
                <Select
                  labelId="orderStatus"
                  id="orderStatus"
                  name="orderStatus"
                  value={newOrder.orderStatus}
                  label="orderStatus"
                  onChange={handleChange}
                >
                  {ORDER_STATUS.map((status) => (
                    <MenuItem value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="comment"
                label="Comment"
                name="comment"
                onChange={handleChange}
                value={newOrder.comment}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
