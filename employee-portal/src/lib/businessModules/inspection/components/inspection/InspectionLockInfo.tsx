/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/base-api";
import { type ApiInspection } from "@eshg/inspection-api";
import {
  useConfirmationDialog,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";
import { Clear } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/joy";

import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { UserLink } from "@/lib/shared/components/users/UserLink";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

export function InspectionLockInfo({
  inspection,
}: {
  inspection: ApiInspection;
}) {
  const { openCancelDialog } = useConfirmationDialog();
  const { mutateAsync: updateInspection } = useUpdateInspection();

  const isOffline = useIsOffline();
  const isTeamlead = useHasUserRoleCheck(ApiUserRole.InspectionLeader);

  function handleUnlockClick() {
    openCancelDialog({
      onConfirm: unlockInspection,
      title: "Vorgang entsperren",
      description:
        "Soll der Vorgang wirklich entsperrt werden? Beim Entsperren könnten Informationen, die Offline erfasst wurden, verloren gehen.",
      confirmLabel: "Entsperren",
    });
  }

  async function unlockInspection() {
    await updateInspection({
      id: inspection.externalId,
      apiUpdateInspectionRequest: { lock: false },
    });
  }

  return (
    <>
      {inspection?.lockedByUser && (
        <Box
          sx={{
            display: "flex",
            ml: "auto",
            mr: "auto",
          }}
        >
          <Typography level="body-md" color="neutral" noWrap>
            Gesperrt durch {<UserLink user={inspection?.lockedByUser} />}
          </Typography>
          {isTeamlead && !isOffline && (
            <IconButton
              aria-label="Sperrung aufheben"
              variant="plain"
              color="danger"
              size="sm"
              sx={{ minHeight: 0 }}
              onClick={() => handleUnlockClick()}
            >
              <Clear />
            </IconButton>
          )}
        </Box>
      )}
    </>
  );
}
