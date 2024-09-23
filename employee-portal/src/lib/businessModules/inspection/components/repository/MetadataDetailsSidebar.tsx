/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiChecklistDefinitionCentralRepoMetadata } from "@eshg/employee-portal-api/inspection";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { Grid } from "@mui/joy";
import { isNonNullish } from "remeda";

import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface CreateChecklistVersionsSidebarProps {
  open: boolean;
  onClose: () => void;
  metadata?: ApiChecklistDefinitionCentralRepoMetadata;
}

export function MetadataDetailsSidebar({
  open,
  onClose,
  metadata,
}: Readonly<CreateChecklistVersionsSidebarProps>) {
  function handleClose() {
    onClose();
  }

  const createdAt = isNonNullish(metadata?.createdAt)
    ? formatDateTime(metadata.createdAt)
    : undefined;

  return (
    <Sidebar open={open} onClose={handleClose}>
      <SidebarContent title={"Details"}>
        <Grid container direction="column" gap={2}>
          <DetailsCell
            name={"description"}
            label={"Beschreibung"}
            value={metadata?.description}
          />
          <DetailsCell
            name={"changeLog"}
            label={"Änderungshinweis"}
            value={metadata?.changeLog}
          />
          <DetailsCell
            name={"contact"}
            label={"Kontakt"}
            value={metadata?.contact}
          />
          <DetailsCell
            name={"createdAt"}
            label={"Erstellt am"}
            value={createdAt}
          />
        </Grid>
      </SidebarContent>
    </Sidebar>
  );
}
