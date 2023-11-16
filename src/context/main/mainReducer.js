import moment from 'moment';
import { SET_LOADING, SAVE_STATE, SET_LOADING_FALSE, LOGIN, GET_ALL_USERS, CREATE_USER, SELECT_USER, CREATE_ORDER, DELETE_USER, FILTER_ORDERS, CLEAR_FILTER } from '../types/mainTypes';

const MainReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
  case SAVE_STATE: {
    return {
      ...state,
      [payload.id]: payload.value,
    };
  }
  case LOGIN: {
    return {
      ...state,
      token: payload.token,
      isAuthenticated: true
    };
  }
  case CREATE_USER: {
    return {
      ...state,
      createUserResponse: payload
    }
  }
  case GET_ALL_USERS: {
    return {
      ...state,
      userList: payload.users,
    };
  }
  case SELECT_USER: {
    return {
      ...state,
      selectedUser: payload
    }
  }
  case DELETE_USER: {
    return {
      ...state,
      deleteReponse: payload.res,
      userList: payload.users.filter(user => user.id !== payload.userId)
    }
  }
  case CREATE_ORDER: {
    return {
      ...state,
      createOrderResponse: payload
    }
  }
  case FILTER_ORDERS: {
    return {
      ...state,
      filterStartDate: payload.startDate,
      filterEndDate: payload.endDate,
      filterStatus: payload.status
    }
  }
  case CLEAR_FILTER: {
    return {
      ...state,
      filterStartDate: moment('2020-01-01').format('YYYY-MM-DD'),
    filterEndDate: moment('2025-01-01').format('YYYY-MM-DD'),
    filterStatus: null
    }
  }
  case SET_LOADING:
    return {
      ...state,
      loading: true,
    };

  case SET_LOADING_FALSE:
    return {
      ...state,
      loading: false,
    };
  default: return state;
  }
};

export default MainReducer;
