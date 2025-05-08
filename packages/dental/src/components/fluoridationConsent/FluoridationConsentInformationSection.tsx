/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useId } from "react";
import { isDefined } from "remeda";

import { ApiFluoridationConsent } from "@eshg/dental-api";
import { DetailsItem, formatBoolean } from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { formatOptional } from "@eshg/lib-portal/formatters/optional";

import {
  ExaminationSectionHeader,
  ExaminationSectionSecondaryTitle,
} from "../examination/ExaminationSection";
import { OpenHistorySidebarButton } from "../examination/OpenHistorySidebarButton";

import { useFluoridationConsentHistorySidebar } from "./FluoridationConsentHistorySidebar";

interface FluoridationConsentInformationSectionProps {
  allFluoridationConsents: ApiFluoridationConsent[];
}

export function FluoridationConsentInformationSection(
  props: FluoridationConsentInformationSectionProps,
) {
  const titleId = useId();
  const fluoridationConsent = props.allFluoridationConsents[0];
  const fluoridationOverviewSidebar = useFluoridationConsentHistorySidebar();

  if (!isDefined(fluoridationConsent)) {
    return (
      <DetailsItem
        label="Einverständnis zur Fluoridierung"
        value="Liegt nicht vor"
      />
    );
  }
  return (
    <Stack
      component="section"
      direction="column"
      gap={2}
      aria-labelledby={titleId}
    >
      <ExaminationSectionHeader>
        <ExaminationSectionSecondaryTitle titleId={titleId}>
          Fluoridierung
        </ExaminationSectionSecondaryTitle>
        <OpenHistorySidebarButton
          onClick={() =>
            fluoridationOverviewSidebar.open({
              allFluoridationConsents: props.allFluoridationConsents,
            })
          }
        />
      </ExaminationSectionHeader>
      <Stack direction="row" gap={3} flexWrap="wrap">
        <DetailsItem
          label="Einverständnis"
          value={formatBoolean(fluoridationConsent.consented)}
        />
        <DetailsItem
          label="Datum"
          value={formatDate(fluoridationConsent.dateOfConsent)}
        />
        <DetailsItem
          label="Allergie"
          value={formatOptional(fluoridationConsent.hasAllergy, formatBoolean)}
        />
      </Stack>
    </Stack>
  );
}
