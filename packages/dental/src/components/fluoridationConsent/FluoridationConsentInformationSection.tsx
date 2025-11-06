/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useId } from "react";
import { isDefined } from "remeda";

import {
  ApiBooleanWithUnknown,
  ApiFluoridationConsent,
} from "@eshg/dental-api";
import {
  DetailsItem,
  DetailsRow,
  formatBoolean,
} from "@eshg/lib-employee-portal";
import { DetailsList, formatDate, formatOptional } from "@eshg/lib-portal";

import { formatBooleanWithUnknown } from "../../utils/formatters";
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
      <DetailsList>
        <DetailsItem
          label="Einverständnis zur Fluoridierung"
          value="Liegt nicht vor"
        />
      </DetailsList>
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
      <DetailsList>
        <DetailsRow>
          <DetailsItem
            label="Einverständnis"
            value={formatBooleanWithUnknown(fluoridationConsent.consented)}
          />
          <DetailsItem
            label="Datum"
            value={formatDate(fluoridationConsent.dateOfConsent)}
          />
          {fluoridationConsent.consented !== ApiBooleanWithUnknown.Unknown && (
            <DetailsItem
              label="Allergie"
              value={formatOptional(
                fluoridationConsent.hasAllergy,
                formatBoolean,
              )}
            />
          )}
        </DetailsRow>
      </DetailsList>
    </Stack>
  );
}
