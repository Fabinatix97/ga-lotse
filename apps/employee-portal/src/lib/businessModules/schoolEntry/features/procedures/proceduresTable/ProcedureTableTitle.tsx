/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider } from "@mui/joy";
import { RowSelectionState } from "@tanstack/react-table";

import {
  RowSelectionTableToolbar,
  mapRowSelectionToRowIds,
} from "@eshg/lib-employee-portal";

import { Procedure } from "@/lib/businessModules/schoolEntry/api/models/Procedure";
import { BulkCreateAppointmentsButton } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/bulkCreateAppointments/BulkCreateAppointmentsButton";
import { BulkDownloadInvitationsButton } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/bulkDownloadInvitations/BulkDownloadInvitationsButton";
import { UpdateProcedureLabelsButton } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/bulkProcedureLabelUpdate/UpdateProcedureLabelsButton";
import { SetInvitationSentButton } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/bulkSetInvitationSent/SetInvitationSentButton";
import { ProcedureIdVersion } from "@/lib/businessModules/schoolEntry/shared/types";

interface ProcedureTableTitleProps {
  rowSelection: RowSelectionState;
  procedures: Procedure[];
}

export function ProceduresTableTitle(props: ProcedureTableTitleProps) {
  const selectedProcedureIds = mapRowSelectionToRowIds(props.rowSelection);

  const selectedProcedures = props.procedures.filter((p) =>
    selectedProcedureIds.includes(p.id),
  );
  const procedureIdsAndVersion: ProcedureIdVersion = Object.fromEntries(
    selectedProcedures.map((p) => [p.id, p.version]),
  );

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
          <Divider orientation="vertical" sx={{ marginY: 1 }} />
          <BulkDownloadInvitationsButton
            selectedProcedureIds={selectedProcedureIds}
            procedures={props.procedures}
          />
          <Divider orientation="vertical" sx={{ marginY: 1 }} />
          <UpdateProcedureLabelsButton
            procedureIdsAndVersion={procedureIdsAndVersion}
          />
          <Divider orientation="vertical" sx={{ marginY: 1 }} />
          <SetInvitationSentButton procedures={selectedProcedures} />
        </>
      )}
    </RowSelectionTableToolbar>
  );
}
