import { useState, MouseEvent } from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import FormControl from "@mui/material/FormControl";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import {
  FilterTypes,
  SortTypes,
  useListOption,
} from "../context/ListOptionContext";

export const ListOptionMenu = () => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLButtonElement>(
    null
  );
  const { state, dispatch } = useListOption();
  const open = !!menuAnchorEl;
  const sorter = {
    [SortTypes.PRIORITY]: {
      name: "Priority",
      tag: "priority",
      paramName: "priority",
    },
    [SortTypes.CREATION_DATE]: {
      name: "Creation Date",
      tag: "creation-date",
      paramName: "creationDate",
    },
    [SortTypes.DUE_DATE]: {
      name: "Due Date",
      tag: "due-date",
      paramName: "dueDate",
    },
  };

  const isMobile = useMediaQuery("(max-width:650px)");
  const isSmallMobile = useMediaQuery("(max-width:570px)");

  const handleMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (type?: SortTypes) => {
    if (type) {
      dispatch({
        type: "replace-options",
        payload: {
          filter: state.filter,
          sort: {
            by: type,
            isAscendingOrder:
              state.sort.by === type
                ? !state.sort.isAscendingOrder
                : state.sort.isAscendingOrder,
          },
        },
      });
    }
    setMenuAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1, marginTop: "12px" }}>
      <Grid container>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          gutterBottom
          sx={{
            flex: 1,
          }}
        >
          Simple Task
        </Typography>
        <Box
          sx={{
            display: "flex",
            ...(isSmallMobile
              ? {
                  justifyContent: "flex-end",
                  width: "100%",
                }
              : {}),
          }}
        >
          <Box
            sx={{
              margin: "8px",
            }}
          >
            <Button
              aria-label="Sort By"
              aria-haspopup="menu"
              aria-expanded={open ? "true" : "false"}
              aria-controls={open ? "sort-menu" : undefined}
              onClick={handleMenuClick}
            >
              Sort By: {sorter[state.sort.by].name}
            </Button>
            <Menu
              id="sort-menu"
              anchorEl={menuAnchorEl}
              open={open}
              onClose={() => handleMenuClose()}
            >
              {Object.keys(sorter).map((key) => (
                <MenuItem
                  key={sorter[key].tag}
                  onClick={() => handleMenuClose(key as SortTypes)}
                >
                  <ListItemIcon>
                    {state?.sort.by === key &&
                      (state?.sort.isAscendingOrder ? (
                        <ArrowDownwardIcon />
                      ) : (
                        <ArrowUpwardIcon />
                      ))}
                  </ListItemIcon>
                  {sorter[key].name}
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="filter-select">Filter</InputLabel>
            <Select
              labelId="filter-select"
              label="filter"
              name="filter"
              value={state.filter}
              onChange={(e) =>
                dispatch({
                  type: "replace-options",
                  payload: {
                    sort: state.sort,
                    filter: e.target.value as FilterTypes,
                  },
                })
              }
              size="small"
            >
              <MenuItem value={FilterTypes.ALL}>All</MenuItem>
              <MenuItem value={FilterTypes.PENDING}>Pending</MenuItem>
              <MenuItem value={FilterTypes.COMPLETED}>Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Grid>
    </Box>
  );
};
