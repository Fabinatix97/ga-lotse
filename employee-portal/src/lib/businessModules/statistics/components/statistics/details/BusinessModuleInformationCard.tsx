/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { LabelValuePair } from "@/lib/shared/components/infoTile/LabelValuePair";

export interface BusinessModuleInformationCardProps {
  titleLabel: string;
  dataSource: string;
  datasetAmount: number;
  attributeLabels: string[];
}

export function BusinessModuleInformationCard(
  props: BusinessModuleInformationCardProps,
) {
  const attributes = [
    {
      label: "Datenquelle",
      value: props.dataSource,
    },
    {
      label: "Datensätze",
      value: props.datasetAmount.toString(),
    },
    {
      label: "Attribute",
      value: props.attributeLabels.join(", "),
    },
  ];

  return (
    <InfoTile name="aggregation-businessModule-info" title={props.titleLabel}>
      <Stack gap={1}>
        {attributes.map((it) => (
          <LabelValuePair key={it.label} label={it.label} value={it.value} />
        ))}
      </Stack>
    </InfoTile>
  );
}
