/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { type ApiInspection } from "@eshg/employee-portal-api/inspection";
import { Clear } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography } from "@mui/joy";

import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { InspectionPhaseSelect } from "@/lib/businessModules/inspection/components/inspection/InspectionPhaseSelect";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "@/lib/shared/components/tabNavigationToolbar/TabNavigationHeader";
import { UserLink } from "@/lib/shared/components/users/UserLink";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

export function InspectionTabHeader({
  inspection,
}: {
  inspection: ApiInspection;
}) {
  const facility = inspection.facility;
  const name = facility?.baseFacility.name ?? "";
  const postalAddress = facility?.baseFacility.contactAddress;
  const postalCode = postalAddress?.postalCode ?? "";
  const city = postalAddress?.city ?? "";
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
    <TabNavigationHeader titleAsH1>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", width: "100%" }}
      >
        <Stack direction="row" gap={4}>
          <TabNavigationHeaderTypography>{name}</TabNavigationHeaderTypography>
          <TabNavigationHeaderTypography>
            {postalCode} {city}
          </TabNavigationHeaderTypography>
        </Stack>
        <Stack direction="row" gap={4}>
          {inspection?.lockedByUser && (
            <Box
              sx={{
                display: "flex",
              }}
            >
              <Typography level="body-md" color="neutral">
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
        </Stack>
        <Stack direction="row" gap={4}>
          <InspectionPhaseSelect inspection={inspection} />
        </Stack>
      </Stack>
    </TabNavigationHeader>
  );
}
