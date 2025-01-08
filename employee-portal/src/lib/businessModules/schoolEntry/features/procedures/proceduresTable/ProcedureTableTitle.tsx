/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider } from "@mui/joy";
import { RowSelectionState } from "@tanstack/react-table";

import { Procedure } from "@/lib/businessModules/schoolEntry/api/models/Procedure";
import { BulkCreateAppointmentsButton } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/bulkCreateAppointments/BulkCreateAppointmentsButton";
import { BulkDownloadInvitationsButton } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/bulkDownloadInvitations/BulkDownloadInvitationsButton";
import { RowSelectionTableToolbar } from "@/lib/shared/components/table/RowSelectionTableToolbar";
import { mapToRowIds } from "@/lib/shared/hooks/table/useRowSelection";

interface ProcedureTableTitleProps {
  rowSelection: RowSelectionState;
  procedures: Procedure[];
}

export function ProceduresTableTitle(props: ProcedureTableTitleProps) {
  const selectedProcedureIds = mapToRowIds(props.rowSelection);

  return (
    <RowSelectionTableToolbar
      rowSelection={props.rowSelection}
      elementName={{
        singular: "Vorgang ausgewählt",
        plural: "Vorgänge ausgewählt",
      }}
    >
      {selectedProcedureIds.length > 0 && (
        <>
          <BulkCreateAppointmentsButton
            selectedProcedureIds={selectedProcedureIds}
          />
          <Divider orientation={"vertical"} sx={{ marginY: 1 }} />
          <BulkDownloadInvitationsButton
            selectedProcedureIds={selectedProcedureIds}
            procedures={props.procedures}
          />
        </>
      )}
    </RowSelectionTableToolbar>
  );
}
