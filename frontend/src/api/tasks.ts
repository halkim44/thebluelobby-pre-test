import { HttpMethod, initFetch } from "../utils/fetch";
import { CreateTask, Task } from "../types/tasks";

const fetchCall = initFetch("http://localhost:3000");

const generateTaskListUrl = (
  filter?: {
    isCompleted?: boolean;
  },
  sort?: { by: "createdAt" | "priority" | "dueDate"; order: "DESC" | "ASC" },
  page?: number,
  pageSize?: number
) => {
  const queryParams = [];
  const filterKeys = Object.keys(filter || {});

  if (filterKeys?.length) {
    filterKeys.forEach((key) => {
      queryParams.push(`filter[${key}]=${filter[key]}`);
    });
  }

  const sortKeys = Object.keys(sort || {});
  if (sortKeys?.length) {
    sortKeys.forEach((key) => {
      queryParams.push(`sort[${key}]=${sort[key]}`);
    });
  }
  if (page) {
    queryParams.push(`page=${page}`);
  }

  if (pageSize) {
    queryParams.push(`pageSize=${pageSize}`);
  }

  const queryString = queryParams.join("&");
  const url = `${queryString ? `?${queryString}` : ""}`;

  return url;
};

export const getTasks = (
  filter?: {
    isCompleted?: boolean;
  },
  sort?: { by: "createdAt" | "priority" | "dueDate"; order: "DESC" | "ASC" },
  page?: number,
  pageSize?: number
) => {
  return fetchCall<{
    data: Task[];
    nextPage?: number;
    previousPage?: number;
    maxPage: number;
    pageSize: number;
  }>(
    HttpMethod.GET,
    `/tasks${generateTaskListUrl(filter, sort, page, pageSize)}`
  );
};

export const createTask = (body: CreateTask) => {
  return fetchCall<Task>(HttpMethod.POST, `/tasks`, {
    body,
  });
};
export const completeTask = (id: string) => {
  return fetchCall<Task>(HttpMethod.PATCH, `/tasks/${id}/complete`);
};

export const uncompleteTask = (id: string) => {
  return fetchCall<Task>(HttpMethod.PATCH, `/tasks/${id}/uncomplete`);
};

export const deleteTask = (id: string) => {
  return fetchCall<Task>(HttpMethod.DELETE, `/tasks/${id}`);
};
