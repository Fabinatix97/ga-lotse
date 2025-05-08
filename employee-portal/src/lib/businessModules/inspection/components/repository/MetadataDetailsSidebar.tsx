/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid } from "@mui/joy";
import { isNonNullish } from "remeda";

import { ApiChecklistDefinitionCentralRepoMetadata } from "@eshg/inspection-api";
import {
  DetailsItem,
  DrawerProps,
  SidebarContent,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";

interface CreateChecklistVersionsSidebarProps extends DrawerProps {
  metadata?: ApiChecklistDefinitionCentralRepoMetadata;
}

export function useMetadataDetailsSidebar() {
  return useSidebar({
    component: MetadataDetailsSidebar,
  });
}

function MetadataDetailsSidebar({
  metadata,
}: Readonly<CreateChecklistVersionsSidebarProps>) {
  const createdAt = isNonNullish(metadata?.createdAt)
    ? formatDateTime(metadata.createdAt)
    : undefined;

  return (
    <SidebarContent title="Details">
      <Grid container direction="column" gap={2}>
        <DetailsItem label="Beschreibung" value={metadata?.description} />
        <DetailsItem label="Änderungshinweis" value={metadata?.changeLog} />
        <DetailsItem label="Kontakt" value={metadata?.contact} />
        <DetailsItem label="Erstellt am" value={createdAt} />
      </Grid>
    </SidebarContent>
  );
}
