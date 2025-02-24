/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDentitionType, ApiOralHygieneStatus } from "@eshg/dental-api";
import { ExaminationStatus } from "@eshg/dental/api/models/ExaminationStatus";
import { Alert } from "@eshg/lib-portal/components/Alert";
import {
  SoftRequiredBooleanSelectField,
  SoftRequiredSelectField,
} from "@eshg/lib-portal/components/form/fieldVariants";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Divider, Stack, Typography } from "@mui/joy";

import { ExaminationStatusChip } from "@/lib/businessModules/dental/features/examinations/ExaminationStatusChip";
import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { DENTITION_TYPE_OPTIONS } from "@/lib/businessModules/dental/features/prophylaxisSessions/options";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { DetailsItem } from "@/lib/shared/components/detailsSection/items/DetailsItem";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";

import { ORAL_HYGIENE_STATUS } from "./translations";

export const ORAL_HYGIENE_STATUS_OPTIONS =
  buildEnumOptions<ApiOralHygieneStatus>(ORAL_HYGIENE_STATUS, true);

export interface AdditionalInformationFormValues {
  dentitionType: OptionalFieldValue<ApiDentitionType>;
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
  const { screening, fluoridation, fluoridationConsentGiven, status } = props;
  const dmftValues = useDentalExaminationStore((store) => store.dmftValues);

  return (
    <InformationSheet>
      <DetailsSection title="Zusatzinfos">
        <ExaminationStatusChip status={status} />
        {screening && <ScreeningFields />}
        {fluoridation && (
          <FluoridationField
            fluoridationConsentGiven={fluoridationConsentGiven}
          />
        )}
        <Divider orientation="horizontal" />
        <Typography component="h3" fontWeight={600}>
          Automatisierte Werte
        </Typography>
        <Stack direction="row" gap={3}>
          <DetailsItem
            label="dmf-t/DMF-T"
            value={`${dmftValues.primaryTeeth}/${dmftValues.secondaryTeeth}`}
          />
        </Stack>
      </DetailsSection>
    </InformationSheet>
  );
}

function ScreeningFields() {
  return (
    <>
      <SelectField
        name="dentitionType"
        label="Gebisstyp"
        options={DENTITION_TYPE_OPTIONS}
      />
      <SoftRequiredSelectField
        name="oralHygieneStatus"
        label="Mundhygienestatus"
        options={ORAL_HYGIENE_STATUS_OPTIONS}
        orientation="vertical"
      />
    </>
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
