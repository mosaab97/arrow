import { useState } from 'react';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Box, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import OrdersTable from './OrdersTable';
import OrderReceipt from './OrderReceipt';
import FilterDialog from './FilterDialog';

export default function OrdersDashboard() {
    const [openFilter, setOpenFilter] = useState(false)
    const [view, setView] = useState('Orders');
    const [receiptRows, setReceiptRows] = useState([]);

  return (
    <>
        <Button onClick={()=> setView('Orders')}>Orders</Button>
        <Button onClick={()=> setView('receipt')}>get receipt</Button>
        <Button onClick={()=> setOpenFilter(true)}>filter</Button>
        {
            view === 'Orders' ? <OrdersTable setReceiptRows={setReceiptRows}/> : <OrderReceipt receiptRows={receiptRows}/>
        }
        <FilterDialog open={openFilter} setOpen={setOpenFilter}/>
    </>
  );
}
