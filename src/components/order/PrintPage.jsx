import { Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useContext } from 'react'
import MainContext from '../../context/main/mainContext'
import moment from 'moment'

function PrintPage({user, state, componentRef, text}) {
    const { mainState } = useContext(MainContext)
    const { selectedUser } = mainState
  return (
    <Paper ref={componentRef}>
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '20px'}}>
            <div>
                <div style={{margin: 5}}><strong>Name:</strong> {selectedUser.displayName}</div>
                <div style={{margin: 5}}><strong>Address:</strong> {selectedUser.address}</div>
                <div style={{margin: 5}}><strong>Phone Number:</strong> {selectedUser.phoneNumber}</div>
                <div style={{margin: 5}}><strong>Email:</strong> {selectedUser.email}</div>
            </div>
        </div>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell align="center">receipt number</TableCell>
                <TableCell align="center">received date</TableCell>
                <TableCell align="center">address</TableCell>
                <TableCell align="center">order price </TableCell>
                <TableCell align="center">phone number</TableCell>
                <TableCell align="center">status</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {state.rows.map((row,index) => (
                <TableRow key={index}>
                <TableCell align="center">{row.receiptNumber}</TableCell>
                <TableCell align="center">{row.receivedDate}</TableCell>
                <TableCell align="center">{row.deliveryAddress}</TableCell>
                <TableCell align="center">{row.orderPrice}</TableCell>
                <TableCell align="center">{row.customerPhone}</TableCell>
                <TableCell align="center">{row.orderStatus}</TableCell>
                {/* <TableCell align="right">{ccyFormat(row.price)}</TableCell> */}
                </TableRow>
            ))}

            <TableRow>
                <TableCell colSpan={2}>total orders price </TableCell>
                <TableCell >{state.totalCashResived} JOD</TableCell>
                <TableCell rowSpan={4} colSpan={2} style={{textAlign: 'center'}}>
                <Typography
                style={{width : '400px'}}
                id="outlined-multiline-static"
                margin="normal"
                // variant="outlined"
                >
                    Notes: {text || 'None'}
                    </Typography>
                </TableCell>
            </TableRow>
            <TableRow>
                {/* <TableCell>Tax</TableCell> */}
                <TableCell colSpan={2}>total delivery price</TableCell>
                <TableCell  >{state.totalDeliveryCost} JOD</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={2}>returned orders number</TableCell>
                <TableCell >{state.cancelledCount}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={2}>total for client</TableCell>
                <TableCell >{state.refundedMoney} JOD</TableCell>
            </TableRow>
            </TableBody>
        </Table>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px'}}>
            <div>
                <div style={{margin: 5}}><strong>Arrow Delivery Service</strong></div>
                <div style={{margin: 5}}><strong>Receipt Date:</strong> {moment().format('YYYY-MM-DD')}</div>
            </div>
            <img style={{width: '200px', height: '200px'}} src={`/ARROW-logos_transparent.png`} alt='user-logo' />
        </div>
    </Paper>
  )
}

export default PrintPage