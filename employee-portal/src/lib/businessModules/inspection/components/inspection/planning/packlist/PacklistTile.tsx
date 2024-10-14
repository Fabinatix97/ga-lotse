/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiInspection,
  ApiPacklist,
} from "@eshg/employee-portal-api/inspection";
import { Stack, Textarea, Typography } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { useCheckPacklistElement } from "@/lib/businessModules/inspection/api/mutations/packlist";
import { inspectionGettersQueryKey } from "@/lib/businessModules/inspection/api/queries/inspection";
import {
  getPacklistsQueryKey,
  useGetPacklists,
} from "@/lib/businessModules/inspection/api/queries/packlist";
import { Packlist } from "@/lib/businessModules/inspection/components/inspection/planning/packlist/Packlist";
import { PacklistSelectSidebar } from "@/lib/businessModules/inspection/components/inspection/planning/packlist/PacklistSelectSidebar";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { InfoTileAddButton } from "@/lib/shared/components/infoTile/InfoTileAddButton";

export interface PacklistTileProps {
  readonly?: boolean;
  isOffline?: boolean;
  inspection: ApiInspection;
}

export function PacklistTile({
  readonly,
  isOffline,
  inspection,
}: Readonly<PacklistTileProps>) {
  const queryClient = useQueryClient();

  const currentSelectedRevisions =
    inspection.selectedPacklistDefinitionRevisions.map((revision) => revision);

  const { data: packlists } = useGetPacklists(inspection.externalId);
  const { mutateAsync: updateInspection } = useUpdateInspection();
  const { mutateAsync: checkPacklistElement } = useCheckPacklistElement();
  const { openCancelDialog } = useConfirmationDialog();

  const [packlistSidebar, setPacklistSidebar] = useState(false);

  async function handleAddClick() {
    // before opening the sidebar we must clear the query cache for inspection
    // and available PLDRs, because they could have changed from the outside.
    await queryClient.invalidateQueries({
      queryKey: inspectionGettersQueryKey(inspection.externalId),
    });
    setPacklistSidebar(true);
  }

  function handleDeleteClick(idx: number) {
    openCancelDialog({
      onConfirm: async () => {
        await handleDelete(idx);
      },
      title: "Packliste löschen",
      description: "Möchten Sie diese Packliste wirklich löschen?",
      confirmLabel: "Löschen",
    });
  }

  async function handleDelete(idxToRemove: number) {
    const request = {
      packlistDefinitionRevisionIds: [] as string[],
    };

    request.packlistDefinitionRevisionIds = [
      ...inspection.selectedPacklistDefinitionRevisions
        .filter((revision, i) => i !== idxToRemove)
        .map((revision) => revision.revisionId),
    ];

    await updateInspection({
      id: inspection.externalId,
      apiUpdateInspectionRequest: request,
    });
  }

  async function handleCheck(
    packlistId: string,
    packlistElementId: string,
    checked: boolean,
  ) {
    const request = {
      inspectionExternalId: inspection.externalId,
      packlistId,
      packlistElementId,
      apiUpdatePacklistElementRequest: { checked },
    };

    await checkPacklistElement(request);
  }

  const packlistRevisionIdToPacklistMap = new Map<string, ApiPacklist>();
  packlists.map((packlist) =>
    packlistRevisionIdToPacklistMap.set(packlist.revisionId, packlist),
  );

  async function handleEditNotes(notes: string) {
    const request = {
      notes,
    };

    await updateInspection({
      id: inspection.externalId,
      apiUpdateInspectionRequest: request,
    });
  }

  const handleEditNotesWithDebounce = useDebouncedCallback(
    handleEditNotes,
    500,
  );

  async function handleEditNotesWithDebounceAndCancel(notes: string) {
    await handleEditNotesWithDebounce(notes);
    await queryClient.cancelQueries({
      queryKey: getPacklistsQueryKey(inspection.externalId),
    });
  }

  return (
    <InfoTile
      name="packlistDefinition"
      title="Packliste"
      footer={
        !readonly && (
          <InfoTileAddButton onClick={handleAddClick}>
            Packliste auswählen
          </InfoTileAddButton>
        )
      }
    >
      {packlistSidebar && (
        <PacklistSelectSidebar
          open
          inspectionExternalId={inspection.externalId}
          currentSelectedRevisions={currentSelectedRevisions}
          onClose={() => setPacklistSidebar(false)}
        />
      )}
      <Typography
        level={"body-sm"}
        textColor="text.secondary"
        noWrap
        sx={{
          width: "fit-content",
          maxWidth: "100%",
        }}
        label-id={"notes"}
      >
        Notizen
      </Typography>
      <Textarea
        label-id={"notes"}
        sx={{
          flex: 1,
          display: "flex",
          flexGrow: 1,
          width: "100%",
          maxHeight: "150px",
        }}
        name={"name"}
        readOnly={readonly}
        defaultValue={inspection.notes}
        onChange={(event) =>
          handleEditNotesWithDebounceAndCancel(event.target.value)
        }
      />

      <Stack
        direction="column"
        spacing={1}
        sx={{
          maxHeight: "342px",
          overflow: "auto",
          marginLeft: -1,
          marginRight: -1,
        }}
      >
        {inspection.selectedPacklistDefinitionRevisions.map((revision, idx) => {
          const packlist = packlistRevisionIdToPacklistMap.get(
            revision.revisionId,
          );
          return (
            packlist && (
              <Packlist
                revisionName={revision.name}
                packlist={packlist}
                idx={idx}
                handleCheck={handleCheck}
                handleDeleteClick={handleDeleteClick}
                readonly={readonly ?? isOffline}
              />
            )
          );
        })}
      </Stack>
    </InfoTile>
  );
}
