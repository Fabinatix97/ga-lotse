/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import { ApiGetDepartmentInfoResponse } from "@eshg/base-api";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { useGetDepartmentInfo } from "@/lib/businessModules/travelMedicine/api/queries/citizenPublicApi";

interface DepartmentContextProps {
  department?: ApiGetDepartmentInfoResponse;
  setDepartment: Dispatch<SetStateAction<ApiGetDepartmentInfoResponse>>;
}

export const DepartmentContext = createContext<DepartmentContextProps | null>(
  null,
);

type DepartmentContextProviderProps = RequiresChildren;

export function DepartmentContextProvider(
  props: DepartmentContextProviderProps,
) {
  const [department, setDepartment] = useState<ApiGetDepartmentInfoResponse>(
    useGetDepartmentInfo().data,
  );

  return (
    <DepartmentContext value={{ department, setDepartment }}>
      {props.children}
    </DepartmentContext>
  );
}

export function useDepartmentContext() {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error(
      "useDepartmentContext must be used with a DepartmentProvider",
    );
  }
  return context;
}
