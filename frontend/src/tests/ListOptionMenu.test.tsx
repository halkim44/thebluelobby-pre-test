import React from "react";
import { fireEvent, cleanup } from "@testing-library/react";
import { render, screen } from "../../setupTests";

import "@testing-library/jest-dom";
import { ListOptionMenu } from "../components/ListOptionMenu";
import { FilterTypes } from "../context/ListOptionContext";

describe("ListOptionMenu component", () => {
  afterEach(cleanup);
  test("renders the component with default values", () => {
    render(<ListOptionMenu />);

    expect(screen.getByText("Simple Task")).toBeInTheDocument();
    expect(screen.getByLabelText("Sort By")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter").nextSibling).toHaveValue(
      FilterTypes.ALL
    );
  });

  test("changes the sort order", () => {
    render(<ListOptionMenu />);

    fireEvent.click(screen.getByLabelText("Sort By"));

    fireEvent.click(screen.getByText("Creation Date"));

    expect(screen.getByText("Sort By: Creation Date")).toBeInTheDocument();
  });

  test("changes the filter", () => {
    render(<ListOptionMenu />);

    fireEvent.change(screen.getByLabelText("Filter").nextSibling, {
      target: { value: FilterTypes.PENDING },
    });

    expect(screen.getByLabelText("Filter").nextSibling).toHaveValue(
      FilterTypes.PENDING
    );
  });
});
