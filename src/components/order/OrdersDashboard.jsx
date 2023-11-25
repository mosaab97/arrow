import { useState } from 'react';
import { Button } from '@mui/material';
import OrdersTable from './OrdersTable';
import OrderReceipt from './OrderReceipt';
import FilterDialog from './FilterDialog';

export default function OrdersDashboard() {
    const [openFilter, setOpenFilter] = useState(false)
    const [view, setView] = useState('Orders');
    const [receiptRows, setReceiptRows] = useState([]);
    const [report, setReport] = useState([]);

  return (
    <>
        <Button onClick={()=> setView('Orders')}>Orders</Button>
        <Button onClick={()=> setView('receipt')}>get receipt</Button>
        {
          JSON.parse(localStorage.getItem('loggedInUser')).userRole === 'admin' && <Button onClick={()=> setView('report')}>get report</Button>
        }
        <Button onClick={()=> setOpenFilter(true)}>filter</Button>
        {
            view === 'Orders' ? 
              <OrdersTable setReceiptRows={setReceiptRows} setReport={setReport}/> 
            : view === 'receipt' ? <OrderReceipt view={view} receiptRows={receiptRows}/>
             : <OrderReceipt view={view} receiptRows={report}/>
        }
        <FilterDialog open={openFilter} setOpen={setOpenFilter}/>
    </>
  );
}
