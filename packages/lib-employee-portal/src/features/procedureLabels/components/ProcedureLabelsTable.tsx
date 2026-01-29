/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { PaginatedList } from "../../../api/models/PaginatedList";
import { ButtonBar } from "../../../components/buttons/ButtonBar";
import { DataTable } from "../../table/components/DataTable";
import { TablePage } from "../../table/components/TablePage";
import { TableSheet } from "../../table/components/TableSheet";
import { Pagination } from "../../table/components/pagination/Pagination";
import { UseTableControlResult } from "../../table/hooks/useTableControl";
import { ProcedureLabel } from "../api/models/ProcedureLabel";
import { ProcedureLabelClient } from "../types/procedureLabelClient";
import { procedureLabelColumns } from "../utils/procedureLabelsTableColumns";

import { useCreateProcedureLabelSidebar } from "./CreateProcedureLabelSidebar";
import { useUpdateProcedureLabelSidebar } from "./UpdateProcedureLabelSidebar";

interface ProcedureLabelsTableProps {
  procedureLabels: PaginatedList<ProcedureLabel>;
  tableControl: UseTableControlResult;
  loading: boolean;
  procedureLabelApi: ProcedureLabelClient;
  hasReadOnlyProcedureLabels: boolean;
  canUserWrite: boolean;
}

export function ProcedureLabelsTable(props: ProcedureLabelsTableProps) {
  const createProcedureLabelSidebar = useCreateProcedureLabelSidebar();
  const updateProcedureLabelSidebar = useUpdateProcedureLabelSidebar();

  return (
    <TablePage
      data-testid="procedureLabelTable"
      controls={
        props.canUserWrite ? (
          <ButtonBar
            right={
              <Button
                autoFocus
                startDecorator={<Add />}
                size="sm"
                onClick={() =>
                  createProcedureLabelSidebar.open({
                    labelApi: props.procedureLabelApi,
                  })
                }
              >
                Kennung hinzufügen
              </Button>
            }
          />
        ) : null
      }
    >
      <TableSheet
        loading={props.loading}
        footer={
          <Pagination
            loading={props.loading}
            totalCount={props.procedureLabels.totalNumberOfElements ?? 0}
            {...props.tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={props.procedureLabels.elements}
          columns={procedureLabelColumns({
            onEdit: (item) =>
              updateProcedureLabelSidebar.open({
                procedureLabelApi: props.procedureLabelApi,
                procedureLabel: item,
              }),
            hasReadOnlyProcedureLabels: props.hasReadOnlyProcedureLabels,
            canUserWrite: props.canUserWrite,
          })}
          minWidth={750}
        />
      </TableSheet>
    </TablePage>
  );
}
