import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useContext } from 'react';
import MainContext from '../../context/main/mainContext';
import { DELETE_USER, SELECT_USER } from '../../context/types/mainTypes';
import { Button, CardActions } from '@mui/material';
import { deleteUser } from '../../services.js/user';

export default function UserCard(props) {
    const {displayName, email, address, phoneNumber, userName, id, logo} = props.user
    const { dispatch, mainState, saveState } = useContext(MainContext);

    const handleDelete = async () => {
      if(window.confirm('are you sure ?')) {
        const res = await deleteUser(id);
        if(res.status === 200) {
          dispatch({type: DELETE_USER, payload: {res: res.data, userId: id, users: mainState.userList}})
        }
      }
    }

    const handleUpdate = () => {
      dispatch({type: SELECT_USER, payload: props.user})
      props.setActivePage('Sign up')
    }
  return (
    <Card sx={{ maxWidth: 345, minWidth: 300, margin: 1 }}>
      <CardMedia
        sx={{ height: 140 }}
        // src={`${logo}`}
        image={logo}
        title={userName}

      />
      <CardContent sx={{ cursor: 'pointer' }} onClick={() => {
            dispatch({type: SELECT_USER, payload: props.user})
            props.setActivePage('orders')
        }}>
        <Typography gutterBottom variant="h5" component="div">
          {displayName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            <Typography component='div'>{address}</Typography >
            <Typography >{email}</Typography >
            
            {phoneNumber}
          {/* Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica */}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleDelete}>Delete</Button>
        <Button size="small" onClick={handleUpdate}>update</Button>
      </CardActions>
    </Card>
  );
}
