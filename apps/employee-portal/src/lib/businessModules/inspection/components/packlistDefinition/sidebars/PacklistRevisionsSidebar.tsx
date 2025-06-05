/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import AddIcon from "@mui/icons-material/Add";
import { Box, Stack, Typography } from "@mui/joy";

import {
  OverlayBoundary,
  Sidebar,
  SidebarContent,
} from "@eshg/lib-employee-portal";
import { ButtonLink } from "@eshg/lib-portal";

import { useGetPacklistDefinitionRevisions } from "@/lib/businessModules/inspection/api/queries/packlistDefinition";
import { PacklistDefinitionRevisionTile } from "@/lib/businessModules/inspection/components/packlistDefinition/sidebars/PacklistDefinitionRevisionTile";

interface CreatePacklistRevisionsSidebarProps {
  open: boolean;
  onClose: () => void;
  packlistDefinitionId: string;
  version: number;
  onClickOnRevision: (
    defId: string,
    version: number,
    revisionId: string,
  ) => void;
  onClickNewRevision: (
    defId: string,
    version: number,
    revisionId: string,
  ) => void;
}

export function PacklistRevisionsSidebar(
  props: CreatePacklistRevisionsSidebarProps,
) {
  return (
    <OverlayBoundary>
      <PacklistRevisionsSidebarWithQuery {...props} />
    </OverlayBoundary>
  );
}

function PacklistRevisionsSidebarWithQuery({
  open,
  onClose,
  packlistDefinitionId,
  version,
  onClickOnRevision,
  onClickNewRevision,
}: Readonly<CreatePacklistRevisionsSidebarProps>) {
  const { data: revisions } =
    useGetPacklistDefinitionRevisions(packlistDefinitionId);

  const newestRevision = revisions.find((v) => v.validTo === undefined);

  function handleClose() {
    onClose();
  }

  return (
    <Sidebar open={open} onClose={handleClose}>
      <SidebarContent title="Versionen">
        <Typography
          level="h4"
          component="p"
          textColor="text.secondary"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={0.5}>
            Packliste: {newestRevision?.name ?? ""}
          </Stack>
        </Typography>
        <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
          <ButtonLink
            variant="plain"
            startDecorator={<AddIcon />}
            onClick={() =>
              onClickNewRevision(
                newestRevision?.defId ?? "",
                version,
                newestRevision?.id ?? "",
              )
            }
          >
            Neue Version anlegen
          </ButtonLink>
        </Box>
        <Stack direction="column-reverse">
          {revisions.map((revision, index) => (
            <PacklistDefinitionRevisionTile
              key={revision.id}
              revision={revision}
              previousName={
                index === 0 ? undefined : revisions[index - 1]?.name
              }
              version={version}
              label="versionTile"
              onClickOnRevision={onClickOnRevision}
            />
          ))}
        </Stack>
      </SidebarContent>
    </Sidebar>
  );
}
