import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Container, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import moment from 'moment';
import MainContext from '../../context/main/mainContext';
import { CLEAR_FILTER, FILTER_ORDERS } from '../../context/types/mainTypes';

const ORDER_STATUS = ['received', 'in progress', 'delivered', 'returned before delivery', 'returned after delivery', 'cancelled'];


export default function FilterDialog({open, setOpen}) {
    const { dispatch } = useContext(MainContext)
    const [state, setState] = useState({
        startDate:  moment('2020-01-01').format('YYYY-MM-DD'),
        endDate: moment('2025-01-01').format('YYYY-MM-DD'),
        status: '',
    })
  const handleClose = () => {
    setState({
        startDate:  moment('2020-01-01').format('YYYY-MM-DD'),
        endDate: moment('2025-01-01').format('YYYY-MM-DD'),
        status: '',
    })
    setOpen(false);
  };

  const handleFilter = () => {
    dispatch({type: FILTER_ORDERS, payload: state})
    handleClose()
  }

  const handleClearFilter = () => {
    dispatch({type: CLEAR_FILTER, payload: state})
    handleClose()
  }
  return (
    <React.Fragment>
      <Dialog  open={open} onClose={handleClose}>
        <DialogTitle>Filter Orders</DialogTitle>
        <DialogContent style={{padding: '20px'}}>
          <LocalizationProvider dateAdapter={AdapterDateFns} >
            <Container sx={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <DatePicker
                label="Start Date"
                  onChange={(newValue) => setState({...state, startDate : moment(newValue).format('YYYY-MM-DD')})
                }
                />

                <DatePicker
                label="End Date"
                  onChange={(newValue) => setState({...state, endDate : moment(newValue).format('YYYY-MM-DD')})}
                />
                    <FormControl fullWidth>
                        <InputLabel id="orderStatus">Order Status</InputLabel>
                        <Select
                            labelId="orderStatus"
                            id="orderStatus"
                            name="orderStatus"
                            value={state.status}
                            label="orderStatus"
                            onChange={(e) => setState({ ...state, status: e.target.value})}
                        >
                            {
                                ORDER_STATUS.map(status => <MenuItem value={status}>{status}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
            </Container>
            

          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={handleClearFilter}>Clear</Button>
          <Button onClick={handleFilter}>Filter</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
