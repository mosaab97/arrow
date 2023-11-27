import React, { useContext, useEffect, useState } from "react";
import UserList from "./UserList";
import { getAllUsers } from "../../services.js/user";
import MainContext from "../../context/main/mainContext";
import { ERROR, GET_ALL_USERS } from "../../context/types/mainTypes";
import Header from "./Header";
import CreateUser from "./CreateUser";
import CreateOrder from "../order/CreateOrder";
import OrdersDashboard from "../order/OrdersDashboard";
import AllOrders from "../order/AllOrders";

function Dashboard() {
  const { dispatch, setFeedBack } = useContext(MainContext);
  const [activePage, setActivePage] = useState("Users");

  useEffect(() => {
    const effect = async () => {
      if (activePage === "Users") {
        try {
          const users = await getAllUsers();
          if (users.status === 200) {
            dispatch({ type: GET_ALL_USERS, payload: users.data });
          } else {
            localStorage.clear();
            window.location.href = "/";
          }
        } catch (e) {
          // if (e.response.status === 401) {
          //   localStorage.clear();
          //   window.location.href = "/";
          // }
          setFeedBack({
            type: ERROR,
            msg: "Error fetching users check network and try again",
            open: true,
          });
        }
      }
    };
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);
  return (
    <>
      <Header setActivePage={setActivePage} />
      {activePage === "Users" ? (
        <UserList setActivePage={setActivePage} />
      ) : activePage === "Sign up" ? (
        <CreateUser activePage={activePage} setActivePage={setActivePage} />
      ) : activePage === "Create Order" ? (
        <CreateOrder />
      ) : activePage === "All Orders" ? (
        <AllOrders />
      ) : (
        <OrdersDashboard />
      )}
    </>
  );
}

export default Dashboard;
