/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MailOutline } from "@mui/icons-material";

import { RowSelectionTableToolbarButton } from "@eshg/lib-employee-portal";

import { Procedure } from "@/lib/businessModules/schoolEntry/api/models/Procedure";
import { useUpdateProceduresInvitationSentSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/bulkSetInvitationSent/UpdateInvitationSentSidebar";

interface SetInvitationSentProps {
  procedures: Procedure[];
}

export function SetInvitationSentButton({
  procedures,
}: SetInvitationSentProps) {
  const updateLabelsSidebar = useUpdateProceduresInvitationSentSidebar();

  return (
    <RowSelectionTableToolbarButton
      decorator={<MailOutline />}
      onClick={() =>
        updateLabelsSidebar.open({
          procedures,
        })
      }
    >
      Einladungen versandt
    </RowSelectionTableToolbarButton>
  );
}
