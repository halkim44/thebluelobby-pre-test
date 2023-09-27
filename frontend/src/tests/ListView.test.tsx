import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ListView } from "../components/ListView";

jest.mock("../context/ListOptionContext", () => ({
  useListOption: () => ({
    state: { page: 1 },
    dispatch: jest.fn(),
  }),
}));

import * as tasksApi from "../api/tasks";
import { Priority } from "../types/tasks";

const mockTasks = [
  {
    id: "1",
    description: "Task 1",
    isCompleted: true,
    priority: Priority.LOW,
  },
  {
    id: "2",
    description: "Task 2",
    isCompleted: false,
    priority: Priority.HIGH,
  },
];
const TaskMock = {
  id: "2a18487b-130a-4d78-b71a-fdd3c68d9783",
  description: "Task Mock",
  isCompleted: false,
  priority: Priority.MEDIUM,
  createdAt: "2023-09-23T23:48:50.350Z",
  updatedAt: "2023-09-26T04:36:02.370Z",
  deletedAt: null,
};

const renderListView = () => {
  const setTasks = jest.fn();
  const maxPage = 2;

  return render(
    <ListView tasks={mockTasks} setTasks={setTasks} maxPage={maxPage} />
  );
};

describe("ListView component", () => {
  afterEach(cleanup);
  it("renders tasks with checkboxes and delete buttons", () => {
    renderListView();

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();

    expect(screen.getAllByRole("checkbox")).toHaveLength(2);

    expect(screen.getAllByLabelText("delete task")).toHaveLength(2);
  });

  it("toggles task completion when clicked", () => {
    renderListView();

    const completeTaskMock = jest.spyOn(tasksApi, "completeTask");
    const uncompleteTaskMock = jest.spyOn(tasksApi, "uncompleteTask");

    completeTaskMock.mockResolvedValueOnce(TaskMock);
    uncompleteTaskMock.mockResolvedValueOnce(TaskMock);

    fireEvent.click(screen.getByText("Task 1"));

    expect(uncompleteTaskMock).toHaveBeenCalledWith("1");

    fireEvent.click(screen.getByText("Task 2"));

    expect(completeTaskMock).toHaveBeenCalledWith("2");
  });

  it("deletes a task when delete button is clicked", async () => {
    renderListView();

    const deleteTaskMock = jest.spyOn(tasksApi, "deleteTask");
    deleteTaskMock.mockResolvedValueOnce(TaskMock);

    fireEvent.click(screen.getAllByLabelText("delete task")[0]);

    expect(deleteTaskMock).toHaveBeenCalledWith("1");
  });
});
