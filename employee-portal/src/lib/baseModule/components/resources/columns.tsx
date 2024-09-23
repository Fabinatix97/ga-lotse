/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiResource } from "@eshg/employee-portal-api/base";
import { createColumnHelper } from "@tanstack/react-table";

import { LabelList } from "@/lib/baseModule/components/labels/LabelList";

import { resourceTypeNames } from "./constants";

const columnHelper = createColumnHelper<ApiResource>();

export const resourceTableColumns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (props) => props.getValue(),
    meta: {
      canNavigate: {
        parentRow: true,
      },
      width: 400,
    },
  }),
  columnHelper.accessor("type", {
    header: "Typ",
    cell: (props) => resourceTypeNames[props.getValue()],
    meta: {
      canNavigate: {
        parentRow: true,
      },
      width: 200,
    },
  }),
  columnHelper.accessor("labels", {
    header: "Labels",
    enableSorting: false,
    cell: (props) => (
      <LabelList labels={props.getValue()} maxVisible={5} disableWrap />
    ),
  }),
];
