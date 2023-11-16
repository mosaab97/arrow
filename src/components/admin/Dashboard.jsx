import React, { useContext, useEffect, useState } from 'react'
import UserList from './UserList'
import { getAllUsers } from '../../services.js/user';
import MainContext from '../../context/main/mainContext';
import { GET_ALL_USERS } from '../../context/types/mainTypes';
import Header from './Header';
import CreateUser from './CreateUser';
import OrdersTable from '../order/OrdersTable';
import CreateOrder from '../order/CreateOrder';
import OrdersDashboard from '../order/OrdersDashboard';

function Dashboard() {
    const { dispatch } = useContext(MainContext);
    const [activePage, setActivePage] = useState('Users')

    useEffect(() => {
        const effect = async () => {
            try {
                const users = await getAllUsers();
                if(users.status === 200) {
                    dispatch({type: GET_ALL_USERS, payload: users.data})
                } else {
                    localStorage.clear();
                    window.location.href = '/'
                }
            } catch(e) {
                if(e.response.status === 401) {
                    localStorage.clear();
                    window.location.href = '/'
                }
            }

        }
        effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  return (
    <>
        <Header setActivePage={setActivePage} />
        {
            activePage === 'Users'
            ? <UserList setActivePage={setActivePage}/>
            :  activePage === 'Sign up'
                ? <CreateUser />
                 : activePage === 'Create Order'
                    ? <CreateOrder />
                    : <OrdersDashboard />
        }
    </>
  )
}

export default Dashboard