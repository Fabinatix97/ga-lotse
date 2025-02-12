/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiChecklistDefinitionCentralRepoMetadata } from "@eshg/inspection-api";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { Grid } from "@mui/joy";
import { isNonNullish } from "remeda";

import { DetailsItem } from "@/lib/shared/components/detailsSection/items/DetailsItem";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import { useSidebar } from "@/lib/shared/components/drawer/useSidebar";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface CreateChecklistVersionsSidebarProps extends DrawerProps {
  metadata?: ApiChecklistDefinitionCentralRepoMetadata;
}

export function useMetadataDetailsSidebar() {
  return useSidebar({
    component: MetadataDetailsSidebar,
  });
}

export function MetadataDetailsSidebar({
  metadata,
}: Readonly<CreateChecklistVersionsSidebarProps>) {
  const createdAt = isNonNullish(metadata?.createdAt)
    ? formatDateTime(metadata.createdAt)
    : undefined;

  return (
    <SidebarContent title="Details">
      <Grid container direction="column" gap={2}>
        <DetailsItem label={"Beschreibung"} value={metadata?.description} />
        <DetailsItem label={"Änderungshinweis"} value={metadata?.changeLog} />
        <DetailsItem label={"Kontakt"} value={metadata?.contact} />
        <DetailsItem label={"Erstellt am"} value={createdAt} />
      </Grid>
    </SidebarContent>
  );
}
