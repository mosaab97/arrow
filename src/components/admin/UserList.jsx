import { useEffect, useMemo, useState, useContext } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Avatar, Box, IconButton, Tooltip } from "@mui/material";
import MainContext from "../../context/main/mainContext";
import {
  DELETE_USER,
  ERROR,
  SELECT_USER,
  SUCCESS,
} from "../../context/types/mainTypes";
import { deleteUser } from "../../services.js/user";

const UserList = ({ setActivePage }) => {
  const { mainState, setFeedBack, dispatch } = useContext(MainContext);
  const { userList } = mainState;

  //data and fetching state
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(userList);
  }, [userList]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(() => [
    {
      accessorKey: "logo",
      header: "Logo",
      size: 80,
      Cell: ({ cell }) => {
        return (
          <Tooltip title={cell.row.original.userName}>
            <IconButton
              onClick={() => {
                dispatch({ type: SELECT_USER, payload: cell.row.original });
                setActivePage("Orders");
              }}
              sx={{ p: 0 }}
            >
              <Avatar alt="Remy Sharp" src={`/${cell.row.original.logo}`} />
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "displayName",
      header: "User Name",
      size: 80,
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 80,
    },
    {
      accessorKey: "address",
      header: "Address",
      size: 80,
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
      size: 80,
    },
  ]);
  const handleDelete = async (row) => {
    if (
      window.confirm(
        `are you sure you want to delete ${row.original.displayName}?`
      )
    ) {
      const res = await deleteUser(row.original.id);
      if (res.status === 200) {
        dispatch({
          type: DELETE_USER,
          payload: {
            res: res.data,
            userId: row.original.id,
            users: mainState.userList,
          },
        });
        setFeedBack({
          type: SUCCESS,
          msg: "User Deleted successfully",
          open: true,
        });
      } else {
        setFeedBack({
          type: ERROR,
          msg: "Can not delete user",
          open: true,
        });
      }
    }
  };

  const handleUpdate = (row) => {
    dispatch({ type: SELECT_USER, payload: row.original });
    setActivePage("Sign up");
  };
  const table = useMaterialReactTable({
    columns,
    data,
    // onEditingRowSave: handleUpdate,
    enableRowActions:
      JSON.parse(localStorage.getItem("loggedInUser")).userRole === "admin",
    renderRowActions: ({ row, table }) => (
      <Box>
        <Tooltip title="Edit">
          <IconButton onClick={() => handleUpdate(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => handleDelete(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    initialState: { density: "compact" },
  });

  return <MaterialReactTable table={table} />;
};

export default UserList;
