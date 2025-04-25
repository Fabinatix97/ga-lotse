/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { ApiGetDepartmentInfoResponse } from "@eshg/base-api";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { useGetDepartmentInfoQuery } from "@/lib/businessModules/officialMedicalService/api/queries/citizenPublicApi";

interface DepartmentContextProps {
  department?: ApiGetDepartmentInfoResponse;
  setDepartment: Dispatch<SetStateAction<ApiGetDepartmentInfoResponse>>;
}

export const DepartmentContext = createContext<DepartmentContextProps | null>(
  null,
);

type DepartmentContextProviderProps = RequiresChildren;

export function DepartmentContextProvider(
  props: Readonly<DepartmentContextProviderProps>,
) {
  const [{ data: departmentInfo }] = useSuspenseQueries({
    queries: [useGetDepartmentInfoQuery()],
  });

  const [department, setDepartment] =
    useState<ApiGetDepartmentInfoResponse>(departmentInfo);

  const value = useMemo(() => ({ department, setDepartment }), [department]);

  return <DepartmentContext value={value}>{props.children}</DepartmentContext>;
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
