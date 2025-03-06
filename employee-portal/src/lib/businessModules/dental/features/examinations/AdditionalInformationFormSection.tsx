/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExaminationStatus } from "@eshg/dental";
import { ApiDentitionType, ApiOralHygieneStatus } from "@eshg/dental-api";
import { Alert } from "@eshg/lib-portal/components/Alert";
import {
  SoftRequiredBooleanSelectField,
  SoftRequiredSelectField,
} from "@eshg/lib-portal/components/form/fieldVariants";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Divider, Grid, Stack, Typography } from "@mui/joy";

import { ExaminationStatusChip } from "@/lib/businessModules/dental/features/examinations/ExaminationStatusChip";
import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { DENTITION_TYPE_OPTIONS } from "@/lib/businessModules/dental/features/prophylaxisSessions/options";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { DetailsItem } from "@/lib/shared/components/detailsSection/items/DetailsItem";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";

import { ORAL_HYGIENE_STATUS } from "./translations";

export const ORAL_HYGIENE_STATUS_OPTIONS =
  buildEnumOptions<ApiOralHygieneStatus>(ORAL_HYGIENE_STATUS, true);

export interface AdditionalInformationFormValues {
  dentitionType: OptionalFieldValue<ApiDentitionType>;
  oralHygieneStatus?: OptionalFieldValue<ApiOralHygieneStatus>;
  fluorideVarnishApplied: OptionalFieldValue<boolean>;
  plaque: boolean;
  calculus: boolean;
  gingivitis: boolean;
  parodontitis: boolean;
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

  return (
    <InformationSheet>
      <DetailsSection title="Zusatzinfos">
        <ExaminationStatusChip status={status} />
        {fluoridation && (
          <FluoridationField
            fluoridationConsentGiven={fluoridationConsentGiven}
          />
        )}
        {screening && <ScreeningFields />}
      </DetailsSection>
    </InformationSheet>
  );
}

function ScreeningFields() {
  const dmftValues = useDentalExaminationStore((store) => store.dmftValues);

  const toggleDentition = useDentalExaminationStore(
    (state) => state.toggleDentition,
  );

  return (
    <>
      <SelectField
        name="dentitionType"
        label="Gebisstyp"
        options={DENTITION_TYPE_OPTIONS}
        onChange={(value) => {
          toggleDentition(value as ApiDentitionType);
        }}
      />
      <SoftRequiredSelectField
        name="oralHygieneStatus"
        label="Mundhygienestatus"
        options={ORAL_HYGIENE_STATUS_OPTIONS}
        orientation="vertical"
      />
      <Divider orientation="horizontal" />
      <Typography component="h3" fontWeight={600}>
        Parodontalstatus
      </Typography>
      <ParodontalCheckboxes />
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

function ParodontalCheckboxes() {
  return (
    <Grid container spacing={2}>
      <Grid md={12} xl={6}>
        <CheckboxField name="plaque" label="Plaque" />
      </Grid>
      <Grid md={12} xl={6}>
        <CheckboxField name="calculus" label="Zahnstein" />
      </Grid>
      <Grid md={12} xl={6}>
        <CheckboxField name="gingivitis" label="Gingivitis" />
      </Grid>
      <Grid md={12} xl={6}>
        <CheckboxField name="parodontitis" label="Parodontitis" />
      </Grid>
    </Grid>
  );
}
