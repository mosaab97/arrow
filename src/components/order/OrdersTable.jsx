import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ThumbUp from "@mui/icons-material/ThumbUp";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
  deleteOrder,
  getOrdersByUser,
  updateOrder,
} from "../../services.js/order";
import { useContext } from "react";
import MainContext from "../../context/main/mainContext";
import { ERROR, SUCCESS } from "../../context/types/mainTypes";

const ORDER_STATUS = [
  "received",
  "in progress",
  "delivered",
  "returned before delivery",
  "returned after delivery",
  "cancelled",
];

const OrdersTable = ({ setReceiptRows, setReport }) => {
  const { mainState, setFeedBack } = useContext(MainContext);
  const { filterStartDate, filterEndDate, filterStatus, selectedUser } =
    mainState;

  //data and fetching state
  const [data, setData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    setIsAdmin(
      JSON.parse(localStorage.getItem("loggedInUser")).userRole === "admin"
    );
  }, []);

  useEffect(() => {
    setReceiptRows(
      data.filter(
        (order) =>
          order.orderStatus === "delivered" ||
          order.orderStatus === "returned before delivery" ||
          order.orderStatus === "returned after delivery" ||
          order.orderStatus === "cancelled"
      )
    );
    setReport(data);
  }, [data, setReceiptRows, setReport]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userOrders = await getOrdersByUser(
          selectedUser.id,
          filterStartDate,
          filterEndDate,
          filterStatus
        );
        setData(
          userOrders.data.orders.map((d) => ({
            ...d,
            receivedDate: moment(d.receivedDate).format("YYYY-MM-DD"),
          }))
        );
        setReceiptRows(
          userOrders.data.orders.filter(
            (order) =>
              order.orderStatus === "delivered" ||
              order.orderStatus === "returned before delivery" ||
              order.orderStatus === "returned after delivery" ||
              order.orderStatus === "cancelled"
          )
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(
    isAdmin
      ? () => [
          {
            accessorKey: "order_id",
            header: "Id",
            enableEditing: false,
            size: 50,
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
            muiEditTextFieldProps: {
              required: true,
            },
          },
          {
            accessorKey: "receivedDate",
            header: "Recevied Price",
            size: 80,
            muiEditTextFieldProps: {
              type: "date",
              format: "YYYY-MM-DD",
              required: true,
            },
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
            editSelectOptions: ORDER_STATUS,
            size: 80,
            muiEditTextFieldProps: {
              select: true,
            },
          },
          {
            accessorKey: "comment",
            header: "comment",
            size: 80,
          },
        ]
      : () => [
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
            accessorKey: "fullPrice",
            header: "Full Price",
            size: 80,
            muiEditTextFieldProps: {
              required: true,
            },
          },
          {
            accessorKey: "receivedDate",
            header: "Recevied Price",
            size: 80,
            muiEditTextFieldProps: {
              type: "date",
              format: "YYYY-MM-DD",
              required: true,
            },
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
            editSelectOptions: ORDER_STATUS,
            muiEditTextFieldProps: {
              select: true,
            },
          },
        ],
    [isAdmin]
  );
  const openDeleteConfirmModal = async (row) => {
    if (window.confirm("Are you sure you want to delete this Order?")) {
      const res = await deleteOrder(row.original.order_id);
      setData(data.filter((d) => d.order_id !== row.original.order_id));
      return res;
    }
  };

  const handleUpdate = async (props) => {
    try {
      delete props.values.receiptNumber;
      props.values.fullPrice =
        parseFloat(props.values.deliveryPrice) +
        parseFloat(props.values.orderPrice);
      await updateOrder(props.values.order_id, props.values);
      props.exitEditingMode();
      setFeedBack({
        type: SUCCESS,
        msg: "Order updated successfully",
        open: true,
      });
    } catch (e) {
      setFeedBack({
        type: ERROR,
        msg: "Can not update order",
        open: true,
      });
      if (e.response.status === 401) {
        localStorage.clear();
        window.location.href = "/";
      }
    }
  };

  const handleUpdateStatus = async (row, status) => {
    try {
      const newRow = {
        ...row.original,
        orderStatus: status,
        deliveryDate: moment(row.original.deliveryDate).format("YYYY-MM-DD"),
      };
      delete newRow.receiptNumber;
      const res = await updateOrder(row.original.order_id, newRow);
      if (res.status === 200) {
        const newData = data.map((d) => {
          if (d.order_id === row.original.order_id) {
            return { ...d, orderStatus: status };
          }
          return d;
        });
        setData(newData);
        setFeedBack({
          type: SUCCESS,
          msg: "Order updated successfully",
          open: true,
        });
      }
    } catch (e) {
      setFeedBack({
        type: ERROR,
        msg: "Can not update order",
        open: true,
      });
    }
  };
  const table = useMaterialReactTable({
    columns,
    data,
    onEditingRowSave: handleUpdate,
    enableRowActions:
      JSON.parse(localStorage.getItem("loggedInUser")).userRole === "admin",
    renderRowActions: ({ row, table }) => (
      <Box>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="In Progress">
          <IconButton
            color="primary"
            onClick={() => handleUpdateStatus(row, "in progress")}
          >
            <LocalShippingIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delivered">
          <IconButton
            color="success"
            onClick={() => handleUpdateStatus(row, "delivered")}
          >
            <ThumbUp />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    initialState: { density: "compact" },
  });

  return <MaterialReactTable table={table} />;
};

export default OrdersTable;
