import React, { useEffect, useRef, useContext } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import ReactToPrint from "react-to-print";
import PrintPage from "./PrintPage";
import MainContext from "../../context/main/mainContext";
import { getOrdersByUser } from "../../services.js/order";
import moment from "moment";
import { ERROR } from "../../context/types/mainTypes";

export default function OrderReceipt(props) {
  const { mainState, setFeedBack } = useContext(MainContext);
  const { filterStartDate, filterEndDate, filterStatus, selectedUser } =
    mainState;
  const componentRef = useRef(null);

  const [state, setState] = React.useState({
    rows: [],
    totalCashResived: 0,
    totalDeliveryCost: 0,
    cancelledCount: 0,
    refundedMoney: 0,
  });
  const [text, setText] = React.useState("");

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, []);

  const reactToPrintTrigger = React.useCallback(() => {
    return <Button>print</Button>;
  }, []);

  useEffect(() => {
    let tcr = 0;
    let cancelledCount = 0;
    state.rows &&
      state.rows.forEach((row) => {
        if (row.orderStatus === "delivered") {
          tcr += parseFloat(row.orderPrice);
        }
        if (
          row.orderStatus === "returned after delivery" ||
          row.orderStatus === "returned before delivery" ||
          row.orderStatus === "cancelled"
        ) {
          cancelledCount++;
        }
      });
    setState({
      ...state,
      totalCashResived: tcr,
      cancelledCount,
      refundedMoney: tcr - state.totalDeliveryCost,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.rows]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userOrders = await getOrdersByUser(
          selectedUser.id,
          filterStartDate,
          filterEndDate,
          filterStatus
        );
        const formatedOrders = userOrders.data.orders.map((d) => ({
          ...d,
          receivedDate: moment(d.receivedDate).format("YYYY-MM-DD"),
        }));
        setState({
          ...state,
          totalDeliveryCost: userOrders.data.fullDeliveryPrice,
          rows:
            props.view === "receipt"
              ? formatedOrders.filter(
                  (d) =>
                    d.orderStatus === "delivered" ||
                    d.orderStatus === "returned before delivery" ||
                    d.orderStatus === "returned after delivery" ||
                    d.orderStatus === "cancelled"
                )
              : formatedOrders,
        });
      } catch (e) {
        if (e && e.response) {
          if (e.response.status === 401) {
            localStorage.clear();
            window.location.href = "/";
          }
          if (e.response.data) {
            setFeedBack({
              type: ERROR,
              msg: e.response.data.error,
              open: true,
            });
          }
        } else {
          setFeedBack({
            type: ERROR,
            msg: "Error fetching data check your network and try again",
            open: true,
          });
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser, filterStartDate, filterEndDate, filterStatus, props.view]);

  return (
    <Paper>
      <ReactToPrint
        content={reactToPrintContent}
        documentTitle="AwesomeFileName"
        // onAfterPrint={handleAfterPrint}
        // onBeforeGetContent={handleOnBeforeGetContent}
        // onBeforePrint={handleBeforePrint}
        removeAfterPrint
        trigger={reactToPrintTrigger}
      />
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
          {state.rows.map((row, index) => (
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
            <TableCell>{state.totalCashResived} JOD</TableCell>
            <TableCell rowSpan={4} colSpan={2} style={{ textAlign: "center" }}>
              <TextField
                style={{ width: "400px" }}
                id="outlined-multiline-static"
                label="notes"
                multiline
                rows="4"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={(e) => localStorage.setItem("txt", e.target.value)}
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
            <TableCell>{state.totalDeliveryCost} JOD</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>returned orders number</TableCell>
            <TableCell>{state.cancelledCount}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>total for client</TableCell>
            <TableCell>{state.refundedMoney} JOD</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div style={{ display: "none" }}>
        <PrintPage text={text} state={state} componentRef={componentRef} />
      </div>
    </Paper>
  );
}
