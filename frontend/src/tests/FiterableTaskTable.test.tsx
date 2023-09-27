import React from "react";
import { waitFor, cleanup } from "@testing-library/react";
import { render, screen } from "../../setupTests";
import "@testing-library/jest-dom";

import FilterableTaskTable from "../components/FiterableTaskTable";

jest.mock("../api/tasks", () => ({
  getTasks: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          id: "1",
          description: "Task 1",
          priority: "LOW",
          isCompleted: false,
        },
        {
          id: "2",
          description: "Task 2",
          priority: "HIGH",
          isCompleted: true,
        },
        {
          id: "3",
          description: "Task 3",
          priority: "MEDIUM",
          isCompleted: false,
        },
      ],
      maxPage: 2,
      pageSize: 10,
    })
  ),
}));

describe("FilterableTaskTable component", () => {
  afterEach(cleanup);
  it("renders tasks correctly", async () => {
    render(<FilterableTaskTable />);

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
      expect(screen.getByText("Task 3")).toBeInTheDocument();
    });
  });
});
