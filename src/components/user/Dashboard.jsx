import React, { useContext, useEffect, useState } from 'react'
import OrdersDashboard from '../order/OrdersDashboard'
import MainContext from '../../context/main/mainContext'
import { SELECT_USER } from '../../context/types/mainTypes';
import Header from './Header';

function Dashboard() {
  const { dispatch, mainState } = useContext(MainContext);
  const [activePage, setActivePage] = useState('Users')

  useEffect(() => {
    dispatch({type: SELECT_USER, payload: JSON.parse(localStorage.getItem('loggedInUser'))})
  }, [])
  
  return (
    <div>
      <Header setActivePage={setActivePage}/>
      {
        mainState.selectedUser && <OrdersDashboard/>
      }

    </div>
  )
}

export default Dashboard