import * as React from 'react';
import { Avatar, Box, Button, Container, CssBaseline, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useState } from 'react';
import { useContext } from 'react';
import MainContext from '../../context/main/mainContext';
import { CREATE_ORDER } from '../../context/types/mainTypes';
import { createOrder } from '../../services.js/order';

const ORDER_STATUS = ['received', 'in progress', 'delivered', 'returned before delivery', 'returned after delivery', 'cancelled'];
const initOrder = {
    receiptNumber: "",
    receivedDate: "",
    deliveryDate: "",
    deliveryAddress: "",
    deliveryPrice: 0,
    orderPrice: 0,
    orderStatus: "received",
    customerPhone: "",
    userId: 1
  }

export default function CreateOrder() {
    const { dispatch, mainState } = useContext(MainContext);
    const { userList } = mainState;

    const [newOrder, setNewOrder] = useState(initOrder);
      const [error, setError] = useState('');
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setNewOrder({ ...newOrder, [name]: value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault()
        const {
            receiptNumber,
            receivedDate,
            deliveryDate,
            deliveryAddress,
            deliveryPrice,
            orderPrice,
            orderStatus,
            customerPhone
        } = newOrder
        if(!receiptNumber || !receivedDate || !deliveryDate || !deliveryAddress || !deliveryPrice || !orderPrice || !orderStatus || !customerPhone ) {
        setError({...error, msg: 'Check all fields'})
        return;
        }
        try {
        // Send a POST request to your login API
        const data = { ...newOrder, fullPrice: parseFloat(orderPrice) + parseFloat(deliveryPrice)}
        const response = await createOrder(data);

        if (response.status === 201) {
            dispatch({ type: CREATE_ORDER, payload: response.data });
            setNewOrder(initOrder);
        } else {
            setError({...error, msg: 'Invalid email or password'}); // Show error message
        }
        } catch (error) {
        console.error('Login error:', error);
            setError({...error, msg: 'An error occurred while logging in'}); // Show error message
        }
    };

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
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
                        {
                            userList.map(user => <MenuItem id={user.id} value={user.id}>{user.displayName}</MenuItem>)
                        }
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
                  autoComplete="receiptNumber"
                  onChange={handleChange}
                  value={newOrder.receiptNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="receivedDate"
                  required
                  fullWidth
                  id="receivedDate"
                  label="Received Date"
                  autoFocus
                  onChange={handleChange}
                  value={newOrder.receivedDate}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="deliveryDate"
                  label="Delivery Date"
                  name="deliveryDate"
                  onChange={handleChange}
                  value={newOrder.deliveryDate}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="orderPrice"
                  label="Order Price"
                  name="orderPrice"
                  autoComplete="orderPrice"
                  onChange={handleChange}
                  value={newOrder.orderPrice}
                />
              </Grid>
              <Grid item xs={12}>
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
                  autoComplete="customerPhone"
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
                  autoComplete="deliveryAddress"
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
                            {
                                ORDER_STATUS.map(status => <MenuItem value={status}>{status}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
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