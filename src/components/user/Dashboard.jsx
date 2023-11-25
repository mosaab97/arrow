import React, { useContext, useEffect, useState } from 'react'
import OrdersDashboard from '../order/OrdersDashboard'
import MainContext from '../../context/main/mainContext'
import { SELECT_USER } from '../../context/types/mainTypes';
import Header from './Header';
import ChangePassword from './ChangePassword';

function Dashboard() {
  const { dispatch, mainState } = useContext(MainContext);
  const [activePage, setActivePage] = useState('Orders')

  useEffect(() => {
    dispatch({type: SELECT_USER, payload: JSON.parse(localStorage.getItem('loggedInUser'))})
  }, [dispatch])
  
  return (
    <div>
      <Header setActivePage={setActivePage}/>
      {
        activePage === 'Orders' ? mainState.selectedUser && <OrdersDashboard/>
        : <ChangePassword />
      }

    </div>
  )
}

export default Dashboard