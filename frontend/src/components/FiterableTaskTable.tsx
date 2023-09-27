import { useEffect, useRef, useState } from "react";

import { Task } from "../types/tasks";
import { getTasks } from "../api/tasks";
import {
  FilterTypes,
  SortTypes,
  useListOption,
} from "../context/ListOptionContext";
import { ListOptionMenu } from "./ListOptionMenu";
import { CreateTaskForm } from "./CreateTaskForm";
import Box from "@mui/material/Box";
import { ListView } from "./ListView";

export interface IFilterSortSetup {
  filter: FilterTypes;
  sort: {
    by: SortTypes;
    isAscendingOrder: boolean;
  };
}

export type TaskSimplified = Omit<
  Task,
  "deletedAt" | "createdAt" | "updatedAt"
>;

const FilterableTaskTable = () => {
  const [tasks, setTasks] = useState<TaskSimplified[]>([]);
  const [taskListProps, setTaskListProps] = useState<
    | {
        nextPage?: number;
        previousPage?: number;
        maxPage: number;
        pageSize: number;
      }
    | undefined
  >();

  const { state, dispatch } = useListOption();

  const prevPageRef = useRef<number>(1);

  useEffect(() => {
    getTasks(
      state.filter === FilterTypes.ALL
        ? null
        : { isCompleted: state.filter === FilterTypes.COMPLETED },
      state.sort?.by?.length
        ? {
            by:
              state.sort?.by === SortTypes.CREATION_DATE
                ? "createdAt"
                : state.sort?.by === SortTypes.PRIORITY
                ? "priority"
                : "dueDate",
            order: state.sort.isAscendingOrder ? "ASC" : "DESC",
          }
        : null,
      state?.page,
      state?.pageSize
    )
      .then((results) => {
        const { data, ...otherKeys } = results;
        setTaskListProps(otherKeys);
        if (state?.page - prevPageRef.current === 1) {
          setTasks((prev) => [...(prev || []), ...data]);
        } else {
          setTasks([...data]);
        }
        prevPageRef.current = state.page;
      })
      .catch((err) => console.log(err));
  }, [state]);

  return (
    <Box>
      <ListOptionMenu />
      <ListView
        tasks={tasks}
        setTasks={setTasks}
        maxPage={taskListProps?.maxPage || 1}
      />
      <CreateTaskForm
        successFunction={() => {
          setTasks([]);
          dispatch({
            type: "reset",
          });
        }}
      />
    </Box>
  );
};

export default FilterableTaskTable;
