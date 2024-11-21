/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { Analysis } from "@/lib/businessModules/statistics/api/models/analysis";
import { CollapsableList } from "@/lib/businessModules/statistics/components/shared/CollapsableList";
import { SearchableGroups } from "@/lib/shared/components/SearchableGroups";

export function Attributes({ attributeLabels }: { attributeLabels: string[] }) {
  return (
    <Stack gap={1}>
      <Typography level="title-md">Attribute</Typography>
      <CollapsableList items={attributeLabels} />
    </Stack>
  );
}

export function Analyses({ analyses }: { analyses: Analysis[] }) {
  const groups = analyses.map((evaluation) => ({
    name: evaluation.name,
    inAccordion: true,
    items: evaluation.diagramTitles.map((it) => ({
      key: it,
      searchableValue: it,
    })),
  }));

  return (
    <Stack gap={1}>
      <Typography level="title-md">Analysen</Typography>
      {groups.length === 0 && (
        <Typography level="body-md" textColor="text.secondary">
          Keine Analysen vorhanden
        </Typography>
      )}
      {groups.length > 0 && (
        <SearchableGroups
          groups={groups}
          renderItem={(item) => item.searchableValue}
          hideSearch={true}
        />
      )}
    </Stack>
  );
}
