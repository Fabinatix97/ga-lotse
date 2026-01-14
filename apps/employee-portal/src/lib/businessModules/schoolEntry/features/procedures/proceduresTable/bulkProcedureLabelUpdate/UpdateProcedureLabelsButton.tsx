/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TurnedInNotOutlined } from "@mui/icons-material";

import { RowSelectionTableToolbarButton } from "@eshg/lib-employee-portal";

import { useUpdateProcedureLabelsSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/bulkProcedureLabelUpdate/UpdateProcedureLabelsSidebar";
import { ProcedureIdVersion } from "@/lib/businessModules/schoolEntry/shared/types";

interface UpdateLabelsButtonProps {
  procedureIdsAndVersion: ProcedureIdVersion;
}

export function UpdateProcedureLabelsButton(props: UpdateLabelsButtonProps) {
  const updateLabelsSidebar = useUpdateProcedureLabelsSidebar();
  return (
    <RowSelectionTableToolbarButton
      decorator={<TurnedInNotOutlined />}
      onClick={() =>
        updateLabelsSidebar.open({
          procedureIdsAndVersion: props.procedureIdsAndVersion,
        })
      }
    >
      Kennungen zuweisen
    </RowSelectionTableToolbarButton>
  );
}
