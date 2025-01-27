/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import { ApiBusinessModule } from "@eshg/employee-portal-api/businessProcedures";
import { Row } from "@eshg/lib-portal/components/Row";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { ApiGetProcedure200Response } from "@eshg/measles-protection-api";
import { EditOutlined, Preview, ToggleOffOutlined } from "@mui/icons-material";
import { Chip } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";

import { useGetProceduresQuery } from "@/lib/businessModules/measlesProtection/api/queries/procedures";
import {
  caseStatusNames,
  facilityTypeNames,
} from "@/lib/businessModules/measlesProtection/components/procedures/constants";
import { useProceduresContext } from "@/lib/businessModules/measlesProtection/shared/ProceduresContext";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { useGetGdprValidationBannerQuery } from "@/lib/shared/api/queries/gdpr";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { useGdprValidationTasksAlert } from "@/lib/shared/components/gdpr/useGdprValidationTasksAlert";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import {
  procedureStatusNames,
  statusColors,
} from "@/lib/shared/components/procedures/constants";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

import {
  ProceduresTableFilters,
  useProceduresFilters,
} from "./ProceduresTableFilters";
import { ReopenProcedureModal } from "./ReopenProcedureModal";

const initialSorting: ColumnSort = {
  id: "createdAt",
  desc: true,
};

const columnHelper = createColumnHelper<ApiGetProcedure200Response>();

function getProceduresColumns({
  onReopenProcedure,
  isMeaslesProtectionLeader,
}: {
  onReopenProcedure: (procedure: ApiGetProcedure200Response) => unknown;
  isMeaslesProtectionLeader: boolean;
}) {
  return [
    columnHelper.accessor("affectedPerson.firstName", {
      header: "Vorname",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("affectedPerson.lastName", {
      header: "Nachname",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("affectedPerson.dateOfBirth", {
      header: "Geburtstag",
      cell: (props) => formatDate(props.getValue()),
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("createdAt", {
      header: "Erstellt",
      cell: (props) => formatDate(props.getValue()),
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("facility.name", {
      header: "Einrichtung",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("facility.type", {
      header: "Einrichtungsart",
      cell: (props) => facilityTypeNames[props.getValue()],
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("caseStatus", {
      header: "Bearbeitungsstand",
      cell: (props) => {
        const val = props.getValue();
        if (!val) {
          return "";
        }
        return caseStatusNames[val];
      },
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("procedureStatus", {
      header: "Status",
      cell: (props) => (
        <Chip color={statusColors[props.getValue()]}>
          {procedureStatusNames[props.getValue()]}
        </Chip>
      ),
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Aktionen",
      cell: ({ row: { original: procedure } }) => (
        <Row justifyContent="flex-end">
          <ActionsMenu
            rowHeight
            actionItems={[
              {
                label: procedure.isOpen ? "Bearbeiten" : "Anzeigen",
                onClick: getLinkToProcedure(procedure),
                startDecorator: procedure.isOpen ? (
                  <EditOutlined />
                ) : (
                  <Preview />
                ),
              },
              ...(isMeaslesProtectionLeader && !procedure.isOpen
                ? [
                    {
                      label: "Wiedereröffnen",
                      onClick: () => onReopenProcedure(procedure),
                      startDecorator: <ToggleOffOutlined />,
                    },
                  ]
                : []),
            ]}
          />
        </Row>
      ),
      meta: {
        width: 96,
      },
    }),
  ];
}

export function ProceduresTable() {
  const filters = useProceduresFilters();

  const proceduresContext = useProceduresContext();
  const { openProcedureReopenModal } = proceduresContext.action;

  const isMeaslesProtectionLeader = useHasUserRoleCheck(
    ApiUserRole.MeaslesProtectionLeader,
  );

  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting,
  });

  const proceduresQuery = useGetProceduresQuery(
    tableControl.paginationProps,
    tableControl.tableSorting,
    filters,
  );

  const gdprBannerQuery = useGetGdprValidationBannerQuery(
    ApiBusinessModule.MeaslesProtection,
  );

  const [procedures, gdprBanner] = useSuspenseQueries({
    queries: [proceduresQuery, gdprBannerQuery],
  });

  useGdprValidationTasksAlert({
    banner: gdprBanner.data,
    businessModule: ApiBusinessModule.MeaslesProtection,
  });

  return (
    <>
      <TablePage
        aria-label="Vorgänge"
        filterSettings={<ProceduresTableFilters />}
      >
        <TableSheet
          loading={procedures.isFetching}
          footer={
            <Pagination
              totalCount={procedures.data.totalElements}
              {...tableControl.paginationProps}
            />
          }
        >
          <DataTable
            data={procedures.data.procedures}
            sorting={tableControl.tableSorting}
            enableSortingRemoval={false}
            columns={getProceduresColumns({
              isMeaslesProtectionLeader,
              onReopenProcedure: (procedureId) =>
                openProcedureReopenModal(procedureId),
            })}
            rowNavigation={{
              route: ({ original: { id: procedureId } }) =>
                routes.procedures.details(procedureId).index,
              focusColumnAccessorKey: "affectedPerson.lastName",
            }}
          />
        </TableSheet>
      </TablePage>
      <ReopenProcedureModal />
    </>
  );
}

function getLinkToProcedure(procedure: ApiGetProcedure200Response) {
  if (procedure.type === "DraftMeaslesProcedure") {
    return routes.procedures.draft(procedure.id);
  }
  return routes.procedures.details(procedure.id).index;
}
