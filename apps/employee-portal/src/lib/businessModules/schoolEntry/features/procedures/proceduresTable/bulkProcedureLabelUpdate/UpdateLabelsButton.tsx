/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TurnedInNotOutlined } from "@mui/icons-material";

import { RowSelectionTableToolbarButton } from "@eshg/lib-employee-portal";

import { useUpdateProceduresSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/bulkProcedureLabelUpdate/UpdateProceduresSidebar";
import { ProcedureIdVersion } from "@/lib/businessModules/schoolEntry/shared/types";

interface UpdateLabelsButtonProps {
  procedureIdsAndVersion: ProcedureIdVersion;
}

export function UpdateLabelsButton(props: UpdateLabelsButtonProps) {
  const updateLabelsSidebar = useUpdateProceduresSidebar();
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
