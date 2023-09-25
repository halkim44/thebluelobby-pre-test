import { createContext, useContext } from "react";
export enum FilterTypes {
  "ALL" = "ALL",
  "PENDING" = "PENDING",
  "COMPLETED" = "COMPLETED",
}

export enum SortTypes {
  "PRIORITY" = "PRIORITY",
  "CREATION_DATE" = "CREATION_DATE",
  "DUE_DATE" = "DUE_DATE",
}

const listOptionInitial = {
  filter: FilterTypes.ALL,
  sort: {
    by: SortTypes.CREATION_DATE,
    isAscendingOrder: true,
  },
};

export interface IListOption {
  filter?: FilterTypes;
  sort?: {
    by?: SortTypes;
    isAscendingOrder?: boolean;
  };
}

type IAction = { type: "update-options" | "reset"; payload?: IListOption };
type IDispatch = (action: IAction) => void;

const ListOptionContext = createContext<
  { state: IListOption; dispatch: IDispatch } | undefined
>(undefined);

function listOptionReducer(state: IListOption, action: IAction) {
  switch (action.type) {
    case "update-options": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "reset": {
      return state;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
function useListOption() {
  const context = useContext(ListOptionContext);
  if (context === undefined) {
    throw new Error("useListOption must be used within a ListOptionProvider");
  }
  return context;
}

export {
  ListOptionContext,
  useListOption,
  listOptionReducer,
  listOptionInitial,
};