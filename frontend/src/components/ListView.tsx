import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

import { Priority } from "../types/tasks";
import { TaskSimplified } from "./FiterableTaskTable";
import { completeTask, deleteTask, uncompleteTask } from "../api/tasks";
import { Dispatch, useEffect, useState } from "react";
import useInfiniteScroll from "./InfiniteScroll";
import { useListOption } from "../context/ListOptionContext";

export const ListView = ({
  tasks,
  setTasks,
  maxPage,
}: {
  tasks: TaskSimplified[];
  setTasks: Dispatch<TaskSimplified[]>;
  maxPage: number;
}) => {
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loaderRef, converge, setConverge] = useInfiniteScroll();

  const { state, dispatch } = useListOption();

  useEffect(() => {
    if (converge && hasMore) {
      dispatch({
        type: "increment-page",
      });
    }
    setConverge(false);
  }, [converge, hasMore, dispatch, setConverge]);

  useEffect(() => {
    setHasMore(state.page < maxPage);
  }, [state.page, maxPage]);

  const toggleTaskCompletion = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    let completionToggler = completeTask;
    if (task.isCompleted) {
      completionToggler = uncompleteTask;
    }
    completionToggler(id).then(() => {
      setTasks(
        tasks.map((task) => {
          if (task.id === id) {
            return { ...task, isCompleted: !task.isCompleted };
          }
          return task;
        })
      );
    });
  };

  const removeTask = (id: string) => {
    deleteTask(id)
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((err) => console.log(err));
  };
  return (
    <Box
      sx={{
        maxWidth: "650px",
        margin: "0 auto",
        height: "80vh",
        overflow: "scroll",
        border: "2px solid #f5f5f5",
        borderRadius: "8px",
      }}
    >
      <Box>
        <TableContainer component={Paper}>
          <Table aria-label="Task Lists">
            <TableBody>
              {tasks.map((task) => (
                <TableRow
                  key={task.id}
                  sx={{
                    ...(task.isCompleted
                      ? {
                          backgroundColor: "#f5f5f5",
                        }
                      : {}),
                  }}
                  onClick={() => toggleTaskCompletion(task?.id)}
                >
                  <TableCell
                    sx={{
                      ...(task.isCompleted
                        ? {
                            textDecoration: "line-through",
                            color: "gray",
                          }
                        : {}),
                    }}
                  >
                    {task.description}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      width: "168px",
                    }}
                  >
                    {task.priority === Priority.HIGH ? (
                      <Chip
                        label="High"
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    ) : task.priority === Priority.LOW ? (
                      <Chip label="Low" size="small" variant="outlined" />
                    ) : (
                      ""
                    )}
                    <IconButton
                      type="button"
                      sx={{ p: "10px" }}
                      aria-label="delete task"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTask(task.id);
                      }}
                    >
                      <DeleteOutline />
                    </IconButton>
                    <Checkbox
                      inputProps={{ "aria-label": "Task Checkbox" }}
                      id={`checkbox-${task.id}`}
                      checked={task.isCompleted}
                      onChange={() => toggleTaskCompletion(task?.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box ref={loaderRef}>
        {hasMore && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "12px 0",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
};
