import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import moment from 'moment'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { deleteOrder, getOrdersByUser, updateOrder } from '../../services.js/order';
import { useContext } from 'react';
import MainContext from '../../context/main/mainContext';

const ORDER_STATUS = ['received', 'in progress', 'delivered', 'returned before delivery', 'returned after delivery', 'cancelled'];


const OrdersTable = ({setReceiptRows}) => {
  const { mainState } = useContext(MainContext);
  const { filterStartDate, filterEndDate, filterStatus, selectedUser } = mainState;

  //data and fetching state
  const [data, setData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    setIsAdmin(JSON.parse(localStorage.getItem('loggedInUser')).userRole === 'admin')
  }, [])

  useEffect(() => {
    setReceiptRows(data.filter(order => order.orderStatus === 'delivered' || order.orderStatus ==='returned before delivery' || order.orderStatus ==='returned after delivery' || order.orderStatus ==='cancelled'))
  },[data, setReceiptRows])

  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userOrders = await getOrdersByUser(selectedUser.id, filterStartDate, filterEndDate, filterStatus);
        setData(userOrders.data.map(d => ({...d, receivedDate: moment(d.receivedDate).format('YYYY-MM-DD')})))
        setReceiptRows(userOrders.data.filter(order => order.orderStatus === 'delivered' || order.orderStatus ==='returned before delivery' || order.orderStatus ==='returned after delivery' || order.orderStatus ==='cancelled'))
      } catch(e) {
        if(e.response.status === 401) {
            localStorage.clear();
            window.location.href = '/'
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser, filterStartDate, filterEndDate, filterStatus]);

  const columns = useMemo(
    isAdmin ? () => [
      {
        accessorKey: 'order_id',
        header: 'Id',
        enableEditing: false,
        size: 50,
      },
      {
        accessorKey: 'receiptNumber',
        header: 'Receipt Number',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'orderPrice',
        header: 'Order Price',
        size: 80,
      },
      {
        accessorKey: 'deliveryPrice',
        header: 'Delivery Price',
        size: 80,
      },
      {
        accessorKey: 'fullPrice',
        header: 'Full Price',
        size: 80,
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'receivedDate',
        header: 'Recevied Price',
        size: 80,
        muiEditTextFieldProps: {
          type: 'date',
          format: 'YYYY-MM-DD',
          required: true,
        },
      },
      {
        accessorKey: 'deliveryAddress',
        header: 'Delivery Address',
        size: 80,
      },
      {
        accessorKey: 'customerPhone',
        header: 'Customer Phone Number',
        size: 80,
      },
      {
        accessorKey: 'orderStatus',
        header: 'status',
        editSelectOptions: ORDER_STATUS,
        muiEditTextFieldProps: {
          select: true,
        },
      },
    ] : () => [
      {
        accessorKey: 'receiptNumber',
        header: 'Receipt Number',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'orderPrice',
        header: 'Order Price',
        size: 80,
      },
      {
        accessorKey: 'fullPrice',
        header: 'Full Price',
        size: 80,
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'receivedDate',
        header: 'Recevied Price',
        size: 80,
        muiEditTextFieldProps: {
          type: 'date',
          format: 'YYYY-MM-DD',
          required: true,
        },
      },
      {
        accessorKey: 'deliveryAddress',
        header: 'Delivery Address',
        size: 80,
      },
      {
        accessorKey: 'customerPhone',
        header: 'Customer Phone Number',
        size: 80,
      },
      {
        accessorKey: 'orderStatus',
        header: 'status',
        editSelectOptions: ORDER_STATUS,
        muiEditTextFieldProps: {
          select: true,
        },
      },
    ],
  [isAdmin]);
  const openDeleteConfirmModal = async (row) => {
    if (window.confirm('Are you sure you want to delete this Order?')) {
      const res = await deleteOrder(row.original.order_id)
      setData(data.filter((d) => d.order_id !==row.original.order_id))
      return res;
    }
  };

  const handleUpdate = async (props) => {
    try {
      delete props.values.receiptNumber
      props.values.fullPrice = parseFloat(props.values.deliveryPrice) + parseFloat(props.values.orderPrice)
      await updateOrder(props.values.order_id, props.values);
      props.exitEditingMode()
    } catch(e) {
        if(e.response.status === 401) {
            localStorage.clear();
            window.location.href = '/'
        }
      }
  }
  const table = useMaterialReactTable({
    columns,
    data,
    onEditingRowSave: handleUpdate,
    enableRowActions: JSON.parse(localStorage.getItem('loggedInUser')).userRole === 'admin',
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
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
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default OrdersTable;
