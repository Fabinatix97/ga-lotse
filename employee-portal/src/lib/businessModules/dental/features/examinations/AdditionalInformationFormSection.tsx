/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiOralHygieneStatus } from "@eshg/dental-api";
import { ExaminationStatus } from "@eshg/dental/api/models/ExaminationStatus";
import { Alert } from "@eshg/lib-portal/components/Alert";
import {
  SoftRequiredBooleanSelectField,
  SoftRequiredSelectField,
} from "@eshg/lib-portal/components/form/fieldVariants";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";

import { ExaminationStatusChip } from "@/lib/businessModules/dental/features/examinations/ExaminationStatusChip";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";

import { ORAL_HYGIENE_STATUS } from "./translations";

export const ORAL_HYGIENE_STATUS_OPTIONS =
  buildEnumOptions<ApiOralHygieneStatus>(ORAL_HYGIENE_STATUS, true);

export interface AdditionalInformationFormValues {
  oralHygieneStatus?: OptionalFieldValue<ApiOralHygieneStatus>;
  fluorideVarnishApplied: OptionalFieldValue<boolean>;
}

interface AdditionalInformationFormSectionProps {
  screening: boolean;
  fluoridation: boolean;
  fluoridationConsentGiven?: boolean;
  status: ExaminationStatus;
}

export function AdditionalInformationFormSection(
  props: AdditionalInformationFormSectionProps,
) {
  const { screening, fluoridation, fluoridationConsentGiven } = props;

  return (
    <InformationSheet>
      <DetailsSection title="Zusatzinfos">
        <ExaminationStatusChip status={props.status} />
        {screening && (
          <SoftRequiredSelectField
            name="oralHygieneStatus"
            label="Mundhygienestatus"
            options={ORAL_HYGIENE_STATUS_OPTIONS}
            orientation="vertical"
          />
        )}
        {fluoridation && (
          <FluoridationField
            fluoridationConsentGiven={fluoridationConsentGiven}
          />
        )}
      </DetailsSection>
    </InformationSheet>
  );
}

interface FluoridationFieldProps {
  fluoridationConsentGiven?: boolean;
}

function FluoridationField(props: FluoridationFieldProps) {
  if (!props.fluoridationConsentGiven) {
    return (
      <Alert
        color="warning"
        message="Keine Einverständniserklärung für die Fluoridierung."
      />
    );
  }

  return (
    <SoftRequiredBooleanSelectField
      name="fluorideVarnishApplied"
      label="Fluoridierung"
      orientation="vertical"
      softRequired
    />
  );
}
