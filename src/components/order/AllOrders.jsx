import React, { useEffect, useContext, useState, useMemo } from "react";
import MainContext from "../../context/main/mainContext";
import { getAllOrders } from "../../services.js/order";
import moment from "moment";
import { ERROR } from "../../context/types/mainTypes";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import FilterDialog from "./FilterDialog";

const initialSummary = {
  totalFullPrice: 0,
  totalDeliveryPrice: 0,
  totalForClient: 0,
  returnedCount: 0,
  totalReturnedPrice: 0,
  deliveredCount: 0,
  receivedCount: 0,
};
function AllOrders() {
  const { mainState, setFeedBack } = useContext(MainContext);
  const { filterStartDate, filterEndDate, filterStatus, selectedUser } =
    mainState;
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(initialSummary);
  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orders = await getAllOrders(
          filterStartDate,
          filterEndDate,
          filterStatus
        );
        setData(
          orders.data.map((d) => ({
            ...d,
            receivedDate: moment(d.receivedDate).format("YYYY-MM-DD"),
            deliveryDate: moment(d.deliveryDate).format("YYYY-MM-DD"),
          }))
        );
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
  }, [selectedUser, filterStartDate, filterEndDate, filterStatus]);

  useEffect(() => {
    const effect = () => {
      let totalFullPrice = 0;
      let totalDeliveryPrice = 0;
      let totalReturnedPrice = 0;
      let returnedCount = 0;
      let deliveredCount = 0;
      let receivedCount = 0;
      data.forEach((d) => {
        //check done status
        if (d.orderStatus === "delivered") {
          totalFullPrice += parseFloat(d.fullPrice);
          deliveredCount++;
        }
        if (
          d.orderStatus === "delivered" ||
          d.orderStatus === "returned after delivery"
        ) {
          totalDeliveryPrice += parseFloat(d.deliveryPrice);
        }
        if (
          d.orderStatus === "returned after delivery" ||
          d.orderStatus === "returned before delivery" ||
          d.orderStatus === "cancelled"
        ) {
          totalReturnedPrice += parseFloat(d.orderPrice);
          returnedCount++;
        }
        if (d.orderStatus === "received") receivedCount++;
      });
      setSummary({
        totalFullPrice: totalFullPrice,
        totalDeliveryPrice: totalDeliveryPrice,
        totalForClient: totalFullPrice - totalDeliveryPrice,
        returnedCount: returnedCount,
        totalReturnedPrice: totalReturnedPrice,
        deliveredCount: deliveredCount,
        receivedCount: receivedCount,
      });
    };
    effect();
  }, [data]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "order_id",
        header: "Id",
        enableEditing: false,
        size: 50,
      },
      {
        accessorKey: "displayName",
        header: "User Name",
        size: 80,
      },
      {
        accessorKey: "receiptNumber",
        header: "Receipt Number",
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: "orderPrice",
        header: "Order Price",
        size: 80,
      },
      {
        accessorKey: "deliveryPrice",
        header: "Delivery Price",
        size: 80,
      },
      {
        accessorKey: "fullPrice",
        header: "Full Price",
        size: 80,
      },
      {
        accessorKey: "receivedDate",
        header: "Recevied Date",
        size: 80,
      },
      {
        accessorKey: "deliveryDate",
        header: "Delivery Date",
        size: 80,
      },
      {
        accessorKey: "deliveryAddress",
        header: "Delivery Address",
        size: 80,
      },
      {
        accessorKey: "customerPhone",
        header: "Customer Phone Number",
        size: 80,
      },
      {
        accessorKey: "orderStatus",
        header: "status",
        size: 80,
      },
      {
        accessorKey: "comment",
        header: "comment",
        size: 80,
      },
    ],
    []
  );
  const table = useMaterialReactTable({
    columns,
    data,
    initialState: { density: "compact", pagination: { pageSize: 50 } },
  });

  return (
    <>
      <Paper sx={{ margin: "10px 0" }}>
        <Button onClick={() => setOpenFilter(true)}>filter</Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Full Price - delivered</TableCell>
              <TableCell align="center">Delivery Price </TableCell>
              <TableCell align="center">Total For Clients</TableCell>
              <TableCell align="center">
                Total Price for Returned/Cancelled Orders{" "}
              </TableCell>
              <TableCell align="center">
                # Returned/Cancelled
              </TableCell>
              <TableCell align="center"># Delivered</TableCell>
              <TableCell align="center"># Received</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">{summary.totalFullPrice}</TableCell>
              <TableCell align="center">{summary.totalDeliveryPrice}</TableCell>
              <TableCell align="center">{summary.totalForClient}</TableCell>
              <TableCell align="center">{summary.totalReturnedPrice}</TableCell>
              <TableCell align="center">{summary.returnedCount}</TableCell>
              <TableCell align="center">{summary.deliveredCount}</TableCell>
              <TableCell align="center">{summary.receivedCount}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
      <MaterialReactTable table={table} />
      <FilterDialog open={openFilter} setOpen={setOpenFilter} />
    </>
  );
}

export default AllOrders;
