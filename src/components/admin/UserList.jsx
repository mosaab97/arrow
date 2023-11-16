import React, { useContext } from 'react'
import UserCard from './UserCard'
import MainContext from '../../context/main/mainContext'
import { Container } from '@mui/material';


function UserList({setActivePage}) {
    const { mainState, dispatch } = useContext(MainContext);
    const { userList } = mainState
  return (
    <Container sx={{display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap'}}>
        {
            userList.map(user => (
                <UserCard setActivePage={setActivePage} key={user.id} user={user}/>
            ))
        }
    </Container>
  )
}

export default UserList