/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Chip, Divider, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { isEmpty } from "remeda";

import {
  ButtonBar,
  DetailsItem,
  DetailsRow,
  SidebarActions,
  SidebarContent,
  SidebarWithFormRefProps,
  useConfirmationDialog,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  DetailsColumn,
  DetailsList,
  ExternalLink,
  formatDate,
} from "@eshg/lib-portal";
import { ApiVersion } from "@eshg/opendata-api";

import { EditEntrySidebarContent } from "@/lib/opendata/components/EditEntrySidebarContent";
import { VersionFileCard } from "@/lib/opendata/components/VersionFileCard";
import { deleteVersionDialogOptions } from "@/lib/opendata/helper";
import { useDeleteVersion } from "@/lib/opendata/mutations/opendata";
import { useGetVersion } from "@/lib/opendata/queries/opendata";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export function useEntryDetailsSidebar() {
  return useSidebarWithFormRef({
    component: EntryDetailsSidebar,
  });
}

export interface EntryDetailsSidebarProps extends SidebarWithFormRefProps {
  versionId: string;
}

function EntryDetailsSidebar({
  versionId,
  onClose,
  formRef,
}: EntryDetailsSidebarProps) {
  const { data } = useGetVersion(versionId);
  const [isEditing, setIsEditing] = useState(false);

  const { openConfirmationDialog } = useConfirmationDialog();
  const deleteVersion = useDeleteVersion();

  if (isEditing) {
    return (
      <EditEntrySidebarContent
        version={data}
        formRef={formRef}
        onAbort={() => setIsEditing(false)}
      />
    );
  }

  const startDate = formatDate(data.statisticStartDate);
  const endDate = formatDate(data.statisticEndDate);
  const sources = Array.from(data.sources);

  function handleDeleteVersion(version: ApiVersion) {
    openConfirmationDialog({
      ...deleteVersionDialogOptions(version),
      onConfirm: () =>
        deleteVersion.mutate(
          { versionId: version.externalId },
          { onSuccess: () => onClose() },
        ),
    });
  }

  return (
    <>
      <SidebarContent title={data.versionName}>
        <Stack spacing={2}>
          <DetailsList>
            <DetailsColumn>
              <DetailsItem
                label="Name"
                value={isEmpty(data.versionName) ? "-" : data.versionName}
              />
              <DetailsItem
                label="Beschreibung"
                value={isEmpty(data.description) ? "-" : data.description}
              />
              <DetailsRow>
                <DetailsItem
                  label="Startdatum"
                  value={isEmpty(startDate) ? "-" : startDate}
                />
                <DetailsItem
                  label="Enddatum"
                  value={isEmpty(endDate) ? "-" : endDate}
                />
              </DetailsRow>
              <DetailsItem
                label="Lizenz URL"
                value={
                  <ExternalLink href={data.licence} openInNewTab>
                    {data.licence}
                  </ExternalLink>
                }
              />
              <DetailsItem
                label="Fachmodule"
                value={
                  isEmpty(sources) ? (
                    "-"
                  ) : (
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {sources.map((source) => (
                        <Chip key={source} color="primary">
                          {businessModuleNames[source]}
                        </Chip>
                      ))}
                    </Stack>
                  )
                }
              />
            </DetailsColumn>
          </DetailsList>
          <Divider orientation="horizontal" />
          <Typography level="title-md">Dateien</Typography>
          <VersionFileCard version={data} />
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          left={
            <Button
              variant="plain"
              color="danger"
              onClick={() => handleDeleteVersion(data)}
            >
              Löschen
            </Button>
          }
          right={
            <>
              <Button variant="soft" color="neutral" onClick={() => onClose()}>
                Schließen
              </Button>
              <Button variant="solid" onClick={() => setIsEditing(true)}>
                Bearbeiten
              </Button>
            </>
          }
        />
      </SidebarActions>
    </>
  );
}
