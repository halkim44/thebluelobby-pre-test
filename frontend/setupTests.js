import "intersection-observer";
import { render } from "@testing-library/react";
import { ListOptionProvider } from "./src/context/ListOptionProvider.tsx";
import React from "react";

const AllTheProviders = ({ children }) => {
  return <ListOptionProvider>{children}</ListOptionProvider>;
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";

export { customRender as render };
