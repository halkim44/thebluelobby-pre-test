import { ReactNode, useReducer } from "react";
import {
  IListOption,
  ListOptionContext,
  listOptionInitial,
  listOptionReducer,
} from "./ListOptionContext";
import { getData } from "../utils/localStorage";

type CountProviderProps = { children: ReactNode };

function ListOptionProvider({ children }: CountProviderProps) {
  const defaultContext = {
    ...listOptionInitial,
    ...getData<IListOption>("list-options-context", listOptionInitial),
  };
  const [state, dispatch] = useReducer(listOptionReducer, defaultContext);

  const value = { state, dispatch };
  return (
    <ListOptionContext.Provider value={value}>
      {children}
    </ListOptionContext.Provider>
  );
}

//
export { ListOptionProvider };
