import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";

import { CreateTaskForm } from "../components/CreateTaskForm";
import { createTask } from "../api/tasks";
import "@testing-library/jest-dom";

jest.mock("../api/tasks", () => ({
  createTask: jest.fn(() => Promise.resolve()),
}));
describe("CreateTaskForm component", () => {
  afterEach(cleanup);
  it("renders form elements correctly", () => {
    render(<CreateTaskForm />);

    expect(screen.getByLabelText("Add Task")).toBeInTheDocument();
    expect(screen.getByLabelText("Priority")).toBeInTheDocument();
    expect(screen.getByLabelText("submit")).toBeInTheDocument();
  });

  it("handles form submission with valid input", async () => {
    render(<CreateTaskForm />);

    fireEvent.change(screen.getByLabelText("Add Task"), {
      target: { value: "New Task Description" },
    });

    fireEvent.change(screen.getByLabelText("Priority").nextSibling, {
      target: { value: "LOW" },
    });

    fireEvent.click(screen.getByLabelText("submit"));

    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith({
        description: "New Task Description",
        priority: "LOW",
      });
    });

    expect(screen.getByLabelText("Add Task")).toHaveValue("");
  });

  it("displays an alert for empty description on form submission", async () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<CreateTaskForm />);

    fireEvent.change(screen.getByLabelText("Priority").nextSibling, {
      target: { value: "HIGH" },
    });

    fireEvent.click(screen.getByLabelText("submit"));

    expect(window.alert).toHaveBeenCalledWith(
      "please provide task description."
    );
  });

  it("handles form submission without priority", async () => {
    render(<CreateTaskForm />);

    fireEvent.change(screen.getByLabelText("Add Task"), {
      target: { value: "New Task Description" },
    });

    fireEvent.click(screen.getByLabelText("submit"));

    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith({
        description: "New Task Description",
        priority: "LOW",
      });
    });

    expect(screen.getByLabelText("Add Task")).toHaveValue("");
  });
});
