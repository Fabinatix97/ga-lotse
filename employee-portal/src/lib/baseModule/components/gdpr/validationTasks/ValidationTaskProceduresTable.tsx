/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiBusinessProcedureInclusionStatus,
  ApiBusinessProcedureWithInclusionStatus,
  ApiProcedureStatus,
  GdprValidationTaskApiInterface,
} from "@eshg/employee-portal-api/businessProcedures";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import IncludedIcon from "@mui/icons-material/CheckOutlined";
import UndecidedIcon from "@mui/icons-material/ClearOutlined";
import { Chip, Typography } from "@mui/joy";
import { DefaultColorPalette } from "@mui/joy/styles/types";
import { createColumnHelper } from "@tanstack/react-table";
import { useTransition } from "react";

import { resolveProcedureDetailsRoute } from "@/lib/baseModule/moduleRegister/routeResolver";
import { PROCEDURE_STATUS } from "@/lib/businessModules/schoolEntry/features/procedures/translations";
import { useAddDownloadPackage } from "@/lib/shared/api/mutations/gdpr";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { procedureTypeNames } from "@/lib/shared/components/procedures/constants";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

interface ValidationTaskProceduresTableProps {
  gdprValidationTaskApi: GdprValidationTaskApiInterface;
  gdprProcedureId: string;
  procedures: ApiBusinessProcedureWithInclusionStatus[];
  loading: boolean;
}

export function ValidationTaskProceduresTable({
  gdprValidationTaskApi,
  gdprProcedureId,
  procedures,
  loading,
}: Readonly<ValidationTaskProceduresTableProps>) {
  const [isPendingUpdate, startTransition] = useTransition();
  const addDownloadPackage = useAddDownloadPackage(gdprValidationTaskApi);

  const columns = getColumns({
    onStatusChange: (event) => {
      startTransition(() =>
        addDownloadPackage.mutate({
          gdprProcedureId,
          businessModuleProcedureId: event.businessModuleProcedureId,
        }),
      );
    },
  });

  return (
    <TablePage fullHeight>
      <TableSheet
        loading={loading || isPendingUpdate}
        title={
          <Typography component="h2" level="h3" marginBlockEnd={1}>
            Betroffene Vorgänge
          </Typography>
        }
      >
        <DataTable
          data={procedures}
          columns={columns}
          minWidth={"60rem"}
          rowNavigation={{
            route: (row) =>
              resolveProcedureDetailsRoute({
                businessModule: row.original.businessProcedure.businessModule,
                procedureId: row.original.businessProcedure.procedureId,
                status: row.original.businessProcedure.procedureStatus,
              }),
            focusColumnAccessorKey: "businessProcedure.summary",
          }}
        />
      </TableSheet>
    </TablePage>
  );
}

const columnHelper =
  createColumnHelper<ApiBusinessProcedureWithInclusionStatus>();

// TODO(ISSUE-6657): Replace this with shared constant once it was fixed to align with design

const procedureStatusColor = {
  [ApiProcedureStatus.Open]: "neutral",
  [ApiProcedureStatus.Draft]: "warning",
  [ApiProcedureStatus.InProgress]: "primary",
  [ApiProcedureStatus.Closed]: "success",
  [ApiProcedureStatus.Aborted]: "danger",
} as const satisfies Record<ApiProcedureStatus, DefaultColorPalette>;

function ProcedureStatus({ status }: { status: ApiProcedureStatus }) {
  return (
    <Chip variant="soft" size="md" color={procedureStatusColor[status]}>
      {PROCEDURE_STATUS[status]}
    </Chip>
  );
}

function InclusionStatus({
  status,
}: {
  status: ApiBusinessProcedureInclusionStatus;
}) {
  const included = isIncluded(status);
  return (
    <Typography
      startDecorator={
        included ? (
          <IncludedIcon color="success" size="md" />
        ) : (
          <UndecidedIcon color="danger" size="md" />
        )
      }
    >
      {included ? "Ja" : "Nein"}
    </Typography>
  );
}

function isIncluded(status: ApiBusinessProcedureInclusionStatus) {
  return status === ApiBusinessProcedureInclusionStatus.Included;
}

function getColumns({
  onStatusChange,
}: {
  onStatusChange: (event: {
    businessModuleProcedureId: string;
    included: boolean;
  }) => void;
}) {
  return [
    columnHelper.accessor("inclusionStatus", {
      header: "Freigeben",
      enableSorting: false,
      cell: (props) => <InclusionStatus status={props.getValue()} />,
      meta: {
        width: 100,
        cellStyle: "icon",
        headerLabel: "Freigeben",
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("businessProcedure.modifiedAt", {
      header: "Geändert am",
      enableSorting: false,
      cell: (props) => formatDateTime(props.getValue()),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("businessProcedure.procedureType", {
      header: "Vorgangsart",
      enableSorting: false,
      cell: (props) => procedureTypeNames[props.getValue()],
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("businessProcedure.summary", {
      header: "Beschreibung",
      enableSorting: false,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("businessProcedure.procedureStatus", {
      header: "Bearbeitungsstand",
      enableSorting: false,
      cell: (props) => <ProcedureStatus status={props.getValue()} />,
      meta: {
        width: 200,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.display({
      header: "Aktionen",
      enableSorting: false,
      cell: (props) =>
        !isIncluded(props.row.original.inclusionStatus) && (
          <ActionsMenu
            actionItems={[
              {
                label: "Freigeben",
                startDecorator: <IncludedIcon color="success" />,
                onClick: () =>
                  onStatusChange({
                    businessModuleProcedureId:
                      props.row.original.businessProcedure.procedureId,
                    included: true,
                  }),
              },
            ]}
          />
        ),
      meta: {
        cellStyle: "button",
        textAlign: "right",
        width: 96,
      },
    }),
  ];
}
