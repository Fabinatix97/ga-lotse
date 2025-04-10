/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { ButtonBar } from "@/components/buttons/ButtonBar";
import { ProcedureLabel } from "@/features/procedureLabels/api/models/ProcedureLabel";
import { useCreateProcedureLabelSidebar } from "@/features/procedureLabels/components/CreateProcedureLabelSidebar";
import { useUpdateProcedureLabelSidebar } from "@/features/procedureLabels/components/UpdateProcedureLabelSidebar";
import { ProcedureLabelClient } from "@/features/procedureLabels/types/procedureLabelClient";
import { procedureLabelColumns } from "@/features/procedureLabels/utils/procedureLabelsTableColumns";
import { DataTable } from "@/features/table/components/DataTable";
import { TablePage } from "@/features/table/components/TablePage";
import { TableSheet } from "@/features/table/components/TableSheet";

interface ProcedureLabelsTableProps {
  procedureLabels: ProcedureLabel[];
  loading: boolean;
  procedureLabelApi: ProcedureLabelClient;
  hasReadOnlyProcedureLabels: boolean;
}

export function ProcedureLabelsTable(props: ProcedureLabelsTableProps) {
  const createProcedureLabelSidebar = useCreateProcedureLabelSidebar();
  const updateProcedureLabelSidebar = useUpdateProcedureLabelSidebar();

  return (
    <>
      <TablePage
        controls={
          <ButtonBar
            right={
              <Button
                startDecorator={<Add />}
                onClick={() =>
                  createProcedureLabelSidebar.open({
                    labelApi: props.procedureLabelApi,
                  })
                }
                size="sm"
              >
                Kennung hinzufügen
              </Button>
            }
          />
        }
      >
        <TableSheet loading={props.loading}>
          <DataTable
            data={props.procedureLabels}
            columns={procedureLabelColumns({
              onEdit: (item) =>
                updateProcedureLabelSidebar.open({
                  procedureLabelApi: props.procedureLabelApi,
                  procedureLabel: item,
                }),
              hasReadOnlyProcedureLabels: props.hasReadOnlyProcedureLabels,
            })}
            minWidth={750}
          />
        </TableSheet>
      </TablePage>
    </>
  );
}
