/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiProcedure } from "@eshg/base-api";
import {
  PROCEDURE_STATUS_COLORS,
  PROCEDURE_STATUS_NAMES,
} from "@eshg/lib-employee-portal";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { Chip } from "@mui/joy";
import { SortingState, createColumnHelper } from "@tanstack/react-table";

import {
  businessModuleNames,
  procedureTypeNames,
} from "@/lib/shared/components/procedures/constants";

const columnHelper = createColumnHelper<ApiProcedure>();

export const proceduresColumns = [
  columnHelper.accessor("createdAt", {
    header: "Erstellt am",
    cell: (props) => formatDateTime(props.getValue()),
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("modifiedAt", {
    header: "Geändert am",
    cell: (props) => formatDateTime(props.getValue()),
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("businessModule", {
    header: "Fachmodul",
    cell: (props) => businessModuleNames[props.getValue()],
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("procedureType", {
    header: "Vorgangsart",
    cell: (props) => procedureTypeNames[props.getValue()],
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("summary", {
    header: "Beschreibung",
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("procedureStatus", {
    header: "Status",
    cell: (props) => (
      <Chip color={PROCEDURE_STATUS_COLORS[props.getValue()]}>
        {PROCEDURE_STATUS_NAMES[props.getValue()]}
      </Chip>
    ),
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
];

export const initialSorting: SortingState = [
  {
    id: "modifiedAt",
    desc: true,
  },
];
