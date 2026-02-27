/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DeleteOutline } from "@mui/icons-material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { isNullish } from "remeda";

import {
  ConfirmationDialog,
  DataTable,
  IconButton,
  Pagination,
  TablePage,
  TableSheet,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { Row, formatWeekdayDateTime } from "@eshg/lib-portal";
import {
  AbortProcedureRequest,
  ApiProstituteProtectionProcedureOverview,
} from "@eshg/prostitute-protection-api";

import { useSimpleAbortProcedureMutation } from "../../../api/mutations/procedures";
import { useProceduresQueryOptions } from "../../../api/queries/procedures";
import { routes } from "../../../config/routes";
import { PROCEDURE_TYPE_VALUES } from "../../../shared/constants";

import { LanguagesCell } from "./LanguagesCell";
import { ProstituteProtectionProceduresTableControls } from "./ProstituteProtectionProceduresTableControls";

const initialSorting: ColumnSort = {
  id: "appointmentStart",
  desc: false,
};

const columnHelper =
  createColumnHelper<ApiProstituteProtectionProcedureOverview>();

interface RowActions {
  onAbortProcedure: (id: string, version: number) => void;
}

function getProceduresColumns({ onAbortProcedure }: RowActions) {
  return [
    columnHelper.accessor("alias", {
      header: "Alias",
      cell: ({ getValue }) => getValue(),
      enableSorting: true,
      meta: {
        width: 160,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("appointmentStart", {
      header: "Termin",
      cell: ({ getValue }) =>
        isNullish(getValue()) ? "" : `${formatWeekdayDateTime(getValue())} Uhr`,
      enableSorting: true,
      meta: {
        width: 240,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("procedureType", {
      header: "Beratungstyp",
      cell: ({ getValue }) => PROCEDURE_TYPE_VALUES[getValue()],
      enableSorting: false,
      meta: {
        width: 160,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("languages", {
      header: "Sprachen",
      cell: ({ getValue }) => <LanguagesCell languages={getValue()} />,
      enableSorting: false,
    }),
    columnHelper.display({
      id: "actions",
      header: "Aktionen",
      cell: ({ row: { original: procedure } }) => (
        <Row justifyContent="flex-end">
          <IconButton
            variant="plain"
            label="Löschen"
            onClick={() => onAbortProcedure(procedure.id, procedure.version)}
          >
            <DeleteOutline />
          </IconButton>
        </Row>
      ),
      meta: {
        cellStyle: "button",
        width: 90,
        textAlign: "right",
      },
    }),
  ];
}

export function ProstituteProtectionProceduresTable() {
  const searchParams = useSearchParams();
  const [confirmAbort, setConfirmAbort] = useState<
    AbortProcedureRequest | undefined
  >();
  const tableControl = useTableControl({
    serverSideSorting: true,
    initialSorting,
    sortFieldName: "sortBy",
    sortDirectionName: "sortOrder",
  });

  const proceduresQueryOptions = useProceduresQueryOptions({
    page: tableControl.paginationProps,
    sorting: tableControl.tableSorting,
    alias: searchParams.get("alias") ?? undefined,
  });

  const abortProcedure = useSimpleAbortProcedureMutation();

  async function handleAbort() {
    if (confirmAbort === undefined) {
      return;
    }
    await abortProcedure.mutateAsync(confirmAbort);
    setConfirmAbort(undefined);
  }

  const {
    data: { elements, totalNumberOfElements },
    isLoading,
  } = useSuspenseQuery(proceduresQueryOptions);

  return (
    <>
      <TablePage
        data-testid="procedureTable"
        aria-label="Vorgänge"
        controls={
          <ProstituteProtectionProceduresTableControls
            tableControl={tableControl}
          />
        }
        filterSettings={null}
        search={null}
        fullHeight
      >
        <TableSheet
          loading={isLoading}
          footer={
            <Pagination
              totalCount={totalNumberOfElements}
              {...tableControl.paginationProps}
            />
          }
        >
          <DataTable
            data={elements}
            columns={getProceduresColumns({
              onAbortProcedure: (id) =>
                setConfirmAbort({
                  procedureId: id,
                }),
            })}
            rowNavigation={{
              route: ({ original: { id: procedureId } }) =>
                routes.procedures.byId(procedureId).details,
              focusColumnAccessorKey: "alias",
            }}
          />
        </TableSheet>
      </TablePage>
      <ConfirmationDialog
        open={confirmAbort !== undefined}
        title="Termin stornieren?"
        confirmLabel="Stornieren"
        color="danger"
        onCancel={() => {
          setConfirmAbort(undefined);
        }}
        onClose={() => {
          setConfirmAbort(undefined);
        }}
        onConfirm={handleAbort}
      />
    </>
  );
}
