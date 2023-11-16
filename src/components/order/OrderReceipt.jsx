import React, { useEffect, useRef } from 'react';
import { Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import ReactToPrint from "react-to-print";
import PrintPage from './PrintPage';

export default function OrderReceipt(props) {
    const componentRef = useRef(null);

  const [state , setState] = React.useState({
      rows : [],
      totalCashResived : 0,
      totalDeliveryCost: 0,
      cancelledCount: 0,
      refundedMoney: 0
  })
  const [text, setText] = React.useState('')

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const reactToPrintTrigger = React.useCallback(() => {
    // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
    // to the root node of the returned component as it will be overwritten.

    // Bad: the `onClick` here will be overwritten by `react-to-print`
    // return <button onClick={() => alert('This will not work')}>Print this out!</button>;

    // Good
        return <Button >print</Button>
  }, []);

  React.useEffect(() => {
    //   setState({...state , rows : props.receiptRows || []});
        let tcr = 0
        let tdc = 0
        let cancelledCount = 0
        props.receiptRows && props.receiptRows.forEach(row => {
            if(row.orderStatus === 'delivered') {
                tcr += parseFloat(row.orderPrice);
            }
            if(row.orderStatus === 'delivered' || row.orderStatus === 'returned after delivery') {
                tdc += parseFloat(row.deliveryPrice)
            }
            if(row.orderStatus === 'returned after delivery' || row.orderStatus === 'returned before delivery' || row.orderStatus === 'cancelled'){
                cancelledCount++;
            }
        })
        setState({
            ...state,
            totalCashResived: tcr,
            totalDeliveryCost: tdc,
            cancelledCount,
            refundedMoney: tcr - tdc,
            rows: props.receiptRows
        })
  }, [props.receiptRows]);
  useEffect(() => {
    
  }, [state.rows])
  
  return (
    <Paper >
        <ReactToPrint
        content={reactToPrintContent}
        documentTitle="AwesomeFileName"
        // onAfterPrint={handleAfterPrint}
        // onBeforeGetContent={handleOnBeforeGetContent}
        // onBeforePrint={handleBeforePrint}
        removeAfterPrint
        trigger={reactToPrintTrigger}
      />
      <Table >
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
              <TableCell align="center">{row.cutomerPhone}</TableCell>
              <TableCell align="center">{row.orderStatus}</TableCell>
              {/* <TableCell align="right">{ccyFormat(row.price)}</TableCell> */}
            </TableRow>
          ))}

          <TableRow>
            <TableCell colSpan={2}>total orders price </TableCell>
            <TableCell >{state.totalCashResived} JOD</TableCell>
            <TableCell rowSpan={4} colSpan={2} style={{textAlign: 'center'}}>
            <TextField
              style={{width : '400px'}}
              id="outlined-multiline-static"
              label="notes"
              multiline
              rows="4"
              value={text}
              onChange={(e)=> setText(e.target.value)}
              onBlur={(e)=> localStorage.setItem('txt', e.target.value)}
              // defaultValue="Default Value"
              // className={classes.textField}
              margin="normal"
              // variant="outlined"
            />
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
      <div style={{display: 'none'}}><PrintPage text={text} state={state} componentRef={componentRef}/></div>
    </Paper>
  );
}
