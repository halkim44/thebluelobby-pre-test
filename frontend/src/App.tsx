import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";

import "./App.css";
import FilterableTaskTable from "./components/FiterableTaskTable";

import { ListOptionProvider } from "./context/ListOptionProvider";

function App() {
  return (
    <>
      <CssBaseline />
      <Container>
        <ListOptionProvider>
          <FilterableTaskTable />
        </ListOptionProvider>
      </Container>
    </>
  );
}

export default App;
