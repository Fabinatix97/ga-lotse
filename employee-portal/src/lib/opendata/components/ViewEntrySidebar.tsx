/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiVersion } from "@eshg/employee-portal-api/opendata";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Button, Chip, Divider, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isEmpty } from "remeda";

import { routes } from "@/lib/baseModule/shared/routes";
import { EditEntrySidebar } from "@/lib/opendata/components/EditEntrySidebar";
import { VersionFileCard } from "@/lib/opendata/components/VersionFileCard";
import { OpenDataVersion } from "@/lib/opendata/components/openDataColumns";
import { deleteVersionDialogOptions } from "@/lib/opendata/helper";
import { useDeleteVersion } from "@/lib/opendata/mutations/opendata";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import {
  DetailsCell,
  DetailsCellProps,
} from "@/lib/shared/components/detailsSection/DetailsCell";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";
import { useBuildRoutePreservingSearchParams } from "@/lib/shared/components/procedures/hooks/useBuildRoutePreservingSearchParams";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface ViewEntrySidebarProps {
  version: OpenDataVersion;
}

export function ViewEntrySidebar({ version }: ViewEntrySidebarProps) {
  const { data: versionData, name } = version;
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();
  const buildRoutePreservingSearchParams =
    useBuildRoutePreservingSearchParams();

  const { openConfirmationDialog } = useConfirmationDialog();
  const deleteVersion = useDeleteVersion();

  const startDate = formatDate(versionData.statisticStartDate);
  const endDate = formatDate(versionData.statisticEndDate);
  const sources = Array.from(versionData.sources);

  function onClose() {
    router.push(buildRoutePreservingSearchParams(routes.opendata.index));
  }

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

  if (isEditing) {
    return (
      <EditEntrySidebar
        version={version}
        onAbort={() => setIsEditing(false)}
        onClose={() => onClose()}
      />
    );
  }

  return (
    <Sidebar open onClose={() => onClose()}>
      <SidebarContent title={name}>
        <Stack spacing={2}>
          <OpenDataCell
            label="Name"
            value={
              isEmpty(versionData.versionName) ? "-" : versionData.versionName
            }
            name="name"
          />
          <OpenDataCell
            label="Beschreibung"
            value={
              isEmpty(versionData.description) ? "-" : versionData.description
            }
            name="description"
          />
          <Stack direction="row" spacing={2}>
            <OpenDataCell
              label="Startdatum"
              value={isEmpty(startDate) ? "-" : startDate}
              name="statisticStartDate"
              flexGrow
            />
            <OpenDataCell
              label="Enddatum"
              value={isEmpty(endDate) ? "-" : endDate}
              name="statisticEndDate"
              flexGrow
            />
          </Stack>
          <OpenDataCell
            label="Lizenz URL"
            value={
              <a href={versionData.licence} target="_blank" rel="noreferrer">
                {versionData.licence}
              </a>
            }
            name="licence"
          />
          <OpenDataCell
            label="Fachmodule"
            name="sources"
            valueIsDiv
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
          <Divider orientation="horizontal" />
          <Typography level="title-md">Dateien</Typography>
          <VersionFileCard version={versionData} />
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          left={
            <Button
              variant="plain"
              color="danger"
              onClick={() => handleDeleteVersion(versionData)}
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
    </Sidebar>
  );
}

function OpenDataCell(props: DetailsCellProps) {
  return (
    <DetailsCell
      {...props}
      sx={{ gap: 0, ...props.sx }}
      valueSx={{
        paddingY: 0.75,
        overflowWrap: "anywhere",
        ...props.valueSx,
      }}
    />
  );
}
