/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import {
  BusinessModuleInformationCard,
  BusinessModuleInformationCardProps,
} from "@/lib/businessModules/statistics/components/evaluations/details/BusinessModuleInformationCard";
import {
  DetailsInformationCard,
  DetailsInformationCardProps,
} from "@/lib/businessModules/statistics/components/evaluations/details/DetailsInformationCard";

export function InformationCards(props: {
  detailsInformationCardProps: DetailsInformationCardProps;
  businessModuleInformationCardsProps: BusinessModuleInformationCardProps[];
}) {
  return (
    <Stack direction="row" gap={2} width="100%">
      <DetailsInformationCard {...props.detailsInformationCardProps} />
      {props.businessModuleInformationCardsProps.map((it) => (
        <BusinessModuleInformationCard key={it.titleLabel} {...it} />
      ))}
    </Stack>
  );
}
