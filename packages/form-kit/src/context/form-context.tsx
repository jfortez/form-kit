import { createContext, useContext } from "react";
import type { Components } from "../types";

const FormComponentsContext = createContext<Components | undefined>(undefined);

export const FormComponentsProvider = FormComponentsContext.Provider;

export const useFormComponents = () => {
  const ctx = useContext(FormComponentsContext);
  if (!ctx) throw new Error("FormComponentsContext not found");
  return ctx;
};
