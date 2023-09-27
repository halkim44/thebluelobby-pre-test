import { createContext, useContext } from "react";
import { IListOptionsLocalStorage, updateData } from "../utils/localStorage";
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
    isAscendingOrder: false,
  },
  page: 1,
  pageSize: 12,
};

export interface IListOption {
  filter?: FilterTypes;
  sort?: {
    by?: SortTypes;
    isAscendingOrder?: boolean;
  };
  page?: number;
  pageSize?: number;
}

type IAction = {
  type: "update-options" | "replace-options" | "increment-page" | "reset";
  payload?: IListOption;
};
type IDispatch = (action: IAction) => void;

const ListOptionContext = createContext<
  { state: IListOption; dispatch: IDispatch } | undefined
>(undefined);

function listOptionReducer(state: IListOption, action: IAction) {
  let newContext: IListOption;
  try {
    switch (action.type) {
      case "update-options": {
        newContext = {
          ...state,
          ...action.payload,
        };
        return newContext;
      }
      case "replace-options": {
        newContext = {
          ...listOptionInitial,
          ...action.payload,
        };
        return newContext;
      }
      case "increment-page": {
        newContext = {
          ...state,
          page: state.page + 1,
        };
        return newContext;
      }
      case "reset": {
        newContext = listOptionInitial;
        return newContext;
      }
      default: {
        throw new Error(`Unhandled action type: ${action.type}`);
      }
    }
  } finally {
    if (newContext) {
      const localStorageData: IListOptionsLocalStorage = {
        filter: newContext?.filter,
        sort: newContext?.sort,
      };
      updateData<IListOptionsLocalStorage>(
        "list-options-context",
        () => localStorageData
      );
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
