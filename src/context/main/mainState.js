import React, { useReducer } from 'react';
import moment from 'moment'
import mainContext from './mainContext';
import MainReducer from './mainReducer';
import { SAVE_STATE, SET_LOADING, SET_LOADING_FALSE } from '../types/mainTypes';

const MainState = (props) => {
  const initialState = {
    isAuthenticated: false,
    userList: [],
    deleteResponse: null,
    selectedUser: null,
    token: '',
    filterStartDate: moment('2020-01-01').format('YYYY-MM-DD'),
    filterEndDate: moment('2025-01-01').format('YYYY-MM-DD'),
    filterStatus: null
  };

  const [state, dispatch] = useReducer(MainReducer, initialState);

  const saveState = async (payload) => {
    dispatch({
      type: SAVE_STATE,
      payload,
    });
  };

  const setLoading = () => dispatch({ type: SET_LOADING });
  const setLoadingFalse = () => dispatch({ type: SET_LOADING_FALSE });


  return (
    <mainContext.Provider
      value={{
        mainState: state,
        dispatch,
        setLoading,
        setLoadingFalse,
        saveState,
      }}
    >
      {props.children}
    </mainContext.Provider>
  );
};

export default MainState;
