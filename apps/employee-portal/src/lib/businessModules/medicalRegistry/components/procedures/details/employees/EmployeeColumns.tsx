/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createColumnHelper } from "@tanstack/react-table";

import { formatDate } from "@eshg/lib-portal";
import { ApiEmployee, ApiEmployeeChange } from "@eshg/medical-registry-api";

import { EmployeeChangeTypeChip } from "@/lib/businessModules/medicalRegistry/components/procedures/EmployeeChangeChip";

const employeeColumnHelper = createColumnHelper<ApiEmployee>();
export function employeeColumns() {
  return [
    employeeColumnHelper.accessor("lastName", {
      header: "Name",
      cell: (props) => props.getValue(),
      meta: { width: 300 },
    }),
    employeeColumnHelper.accessor("firstName", {
      header: "Vorname",
      cell: (props) => props.getValue(),
      meta: { width: 300 },
    }),
    employeeColumnHelper.accessor("dateOfBirth", {
      header: "Geburtsdatum",
      cell: (props) => formatDate(props.getValue()),
    }),
  ];
}

const employeeChangeColumnHelper = createColumnHelper<ApiEmployeeChange>();
export function employeeChangeColumns() {
  return [
    employeeChangeColumnHelper.accessor("lastName", {
      header: "Name",
      cell: (props) => props.getValue(),
      meta: { width: 180 },
    }),
    employeeChangeColumnHelper.accessor("firstName", {
      header: "Vorname",
      cell: (props) => props.getValue(),
      meta: { width: 180 },
    }),
    employeeChangeColumnHelper.accessor("dateOfBirth", {
      header: "Geburtsdatum",
      cell: (props) => formatDate(props.getValue()),
    }),
    employeeChangeColumnHelper.accessor("changeType", {
      header: "Aktion",
      cell: (props) => {
        const changeType = props.getValue();
        return <EmployeeChangeTypeChip changeType={changeType} />;
      },
      meta: { width: 150 },
    }),
  ];
}
