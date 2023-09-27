import { ReactNode, useReducer } from "react";
import {
  ListOptionContext,
  listOptionInitial,
  listOptionReducer,
} from "./ListOptionContext";

type CountProviderProps = { children: ReactNode };

function ListOptionProvider({ children }: CountProviderProps) {
  const [state, dispatch] = useReducer(listOptionReducer, listOptionInitial);

  const value = { state, dispatch };
  return (
    <ListOptionContext.Provider value={value}>
      {children}
    </ListOptionContext.Provider>
  );
}

//
export { ListOptionProvider };
