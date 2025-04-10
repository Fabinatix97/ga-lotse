/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiFluoridationConsent } from "@eshg/dental-api";
import { DetailsItem, formatBoolean } from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { OpenHistorySidebarButton } from "@/components/examination/OpenHistorySidebarButton";
import { useFluoridationConsentHistorySidebar } from "@/components/fluoridationConsent/FluoridationConsentHistorySidebar";

interface FluoridationConsentInformationSectionProps {
  allFluoridationConsents: ApiFluoridationConsent[];
}

export function FluoridationConsentInformationSection(
  props: FluoridationConsentInformationSectionProps,
) {
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
    <>
      <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
        <Typography fontWeight={600}>Fluoridierung</Typography>
        <OpenHistorySidebarButton
          onClick={() =>
            fluoridationOverviewSidebar.open({
              allFluoridationConsents: props.allFluoridationConsents,
            })
          }
        >
          Übersicht
        </OpenHistorySidebarButton>
      </Stack>
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
          value={formatBoolean(fluoridationConsent.hasAllergy)}
        />
      </Stack>
    </>
  );
}
