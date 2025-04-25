/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { SearchableGroups } from "@eshg/lib-employee-portal";

import { Analysis } from "@/lib/businessModules/statistics/api/models/analysis";
import {
  DataSourceSensitivity,
  translateDataSourceSensitivity,
} from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import { CollapsableList } from "@/lib/businessModules/statistics/components/shared/CollapsableList";

export function DataSource({ dataSourceName }: { dataSourceName: string }) {
  return (
    <Stack gap={1}>
      <Typography level="title-md">Datenquelle</Typography>
      <Typography level="body-md">{dataSourceName}</Typography>
    </Stack>
  );
}

export function Sensitivity({
  dataSourceSensitivity,
}: {
  dataSourceSensitivity?: DataSourceSensitivity;
}) {
  return (
    <Stack gap={1}>
      <Typography level="title-md">Sensibilität</Typography>
      <Typography level="body-md">
        {translateDataSourceSensitivity(dataSourceSensitivity)}
      </Typography>
    </Stack>
  );
}

export function Attributes({ attributeLabels }: { attributeLabels: string[] }) {
  return (
    <Stack gap={1}>
      <Typography level="title-md">Attribute</Typography>
      <CollapsableList items={attributeLabels} />
    </Stack>
  );
}

export function Analyses({ analyses }: { analyses: Analysis[] }) {
  const groups = analyses.map((analysis) => ({
    name: analysis.name,
    inAccordion: true,
    items: analysis.diagramTitles.map((it) => ({
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
