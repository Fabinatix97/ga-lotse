/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DeleteOutlined } from "@mui/icons-material";
import { Chip, IconButton, Stack, Typography } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  ApiFollowupType,
  ApiInspection,
  ApiInspectionAvailableCLDVersionsResponse,
  ApiInspectionCLDVersion,
} from "@eshg/inspection-api";
import { useConfirmationDialog } from "@eshg/lib-employee-portal";
import { Alert } from "@eshg/lib-portal/components/Alert";

import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { inspectionGettersQueryKey } from "@/lib/businessModules/inspection/api/queries/inspection";
import { ChecklistSelectSidebar } from "@/lib/businessModules/inspection/components/inspection/planning/checklist/ChecklistSelectSidebar";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { InfoTileAddButton } from "@/lib/shared/components/infoTile/InfoTileAddButton";

export interface ChecklistTileProps {
  readonly?: boolean;
  inspection: ApiInspection;
  availableCldvs: ApiInspectionAvailableCLDVersionsResponse;
}

export function ChecklistTile({
  readonly,
  inspection,
  availableCldvs,
}: Readonly<ChecklistTileProps>) {
  const queryClient = useQueryClient();

  const currentSelectedNonCoreVersions =
    inspection.selectedChecklistDefinitionVersions
      .filter((version) => !version.isCoreChecklist)
      .map((version) => version);

  const { mutateAsync: updateInspection } = useUpdateInspection();
  const { openCancelDialog } = useConfirmationDialog();

  const [checklistSidebar, setChecklistSidebar] = useState(false);

  const listIsEmpty =
    inspection.selectedChecklistDefinitionVersions.length === 0;

  const isFollowupInspection =
    inspection.followupInfo?.followupType ===
      ApiFollowupType.DocumentInspection ||
    inspection.followupInfo?.followupType === ApiFollowupType.Review;

  async function handleAddClick() {
    // before opening the sidebar we must clear the query cache for inspection
    // and available CLDVs, because they could have changed from the outside.
    await queryClient.invalidateQueries({
      queryKey: inspectionGettersQueryKey(inspection.externalId),
    });
    setChecklistSidebar(true);
  }

  function showDeleteButton(version: ApiInspectionCLDVersion) {
    return (
      !version.isCoreChecklist &&
      !readonly &&
      !isFollowupInspection &&
      currentSelectedNonCoreVersions.length > 1
    );
  }

  function handleDeleteClick(idx: number) {
    openCancelDialog({
      onConfirm: async () => {
        await handleDelete(idx);
      },
      title: "Checkliste löschen",
      description: "Möchten Sie diese Checkliste wirklich löschen?",
      confirmLabel: "Löschen",
    });
  }

  async function handleDelete(idxToRemove: number) {
    const isExpandable = !availableCldvs.coreVersions.some(
      (coreCldv) => !coreCldv.isExpandable,
    );

    const request = {
      checklistDefinitionVersionIds: [] as string[],
    };

    if (isExpandable) {
      request.checklistDefinitionVersionIds = [
        ...inspection.selectedChecklistDefinitionVersions
          .filter((version, i) => !version.isCoreChecklist && i !== idxToRemove)
          .map((version) => version.versionId),
      ];
    }

    await updateInspection({
      id: inspection.externalId,
      apiUpdateInspectionRequest: request,
    });
  }

  return (
    <InfoTile
      name="checklistDefinition"
      title="Checkliste"
      onEdit={
        !listIsEmpty && !readonly && !isFollowupInspection
          ? () => setChecklistSidebar(true)
          : undefined
      }
      footer={
        listIsEmpty &&
        !readonly &&
        !isFollowupInspection && (
          <InfoTileAddButton onClick={handleAddClick}>
            Checkliste auswählen
          </InfoTileAddButton>
        )
      }
    >
      {checklistSidebar && (
        <ChecklistSelectSidebar
          open
          withCoreVersions
          inspectionExternalId={inspection.externalId}
          currentSelectedNonCoreVersions={currentSelectedNonCoreVersions}
          onClose={() => setChecklistSidebar(false)}
        />
      )}

      <Stack direction="column" spacing={1}>
        {!inspection.selectedChecklistDefinitionVersions.length && (
          <Alert
            color="primary"
            message="Mindestens eine Checkliste muss ausgewählt sein, um eine Begehung durchzuführen."
          />
        )}
        {inspection.selectedChecklistDefinitionVersions.map((version, idx) => {
          return (
            <Stack
              direction="row"
              spacing={2}
              key={"version-info-" + version.name + "-" + idx}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
                sx={(theme) => ({
                  bgcolor: theme.palette.neutral.softBg,
                  padding: theme.spacing(1),
                  borderRadius: theme.radius.md,
                  flexGrow: 1,
                })}
              >
                <Typography fontSize="md" fontWeight="400">
                  {version.name} (Version {version.version})
                </Typography>
                {version.isCoreChecklist && (
                  <Chip color="primary">Kern - Checkliste</Chip>
                )}
              </Stack>
              {showDeleteButton(version) && (
                <IconButton
                  aria-label="Löschen"
                  variant="plain"
                  color="danger"
                  onClick={() => handleDeleteClick(idx)}
                >
                  <DeleteOutlined />
                </IconButton>
              )}
            </Stack>
          );
        })}
      </Stack>
    </InfoTile>
  );
}
