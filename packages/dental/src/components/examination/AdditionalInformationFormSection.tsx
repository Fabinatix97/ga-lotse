/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Grid, Stack } from "@mui/joy";
import { useId } from "react";

import {
  ApiDentitionType,
  ApiMihStatus,
  ApiOralHygieneStatus,
  ApiOrthodonticStatus,
} from "@eshg/dental-api";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { SoftRequiredBooleanSelectField } from "@eshg/lib-portal/components/form/fieldVariants";
import { CheckboxField } from "@eshg/lib-portal/components/formFields/CheckboxField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import { DENTITION_TYPE_OPTIONS } from "../../config/prophylaxisSession";
import { useExaminationStore } from "../../stores/examination/ExaminationStoreProvider";
import {
  MIH_STATUS,
  ORAL_HYGIENE_STATUS,
  ORTHODONTIC_STATUS,
} from "../../translations/examination";

import {
  ExaminationSection,
  ExaminationSectionSecondaryTitle,
} from "./ExaminationSection";
import { OrthodonticFindingsField } from "./OrthodonticFindingsField";

const ORAL_HYGIENE_STATUS_OPTIONS = buildEnumOptions<ApiOralHygieneStatus>(
  ORAL_HYGIENE_STATUS,
  true,
);

const MIH_STATUS_OPTIONS = buildEnumOptions<ApiMihStatus>(MIH_STATUS, true);

const ORTHODONTIC_STATUS_OPTIONS = buildEnumOptions<ApiOrthodonticStatus>(
  ORTHODONTIC_STATUS,
  true,
);

const FIELD_BREAKPOINTS = { xxs: 2, xl: 1 } as const;

interface AdditionalInformationFormSectionProps {
  isScreening: boolean;
  isFluoridation: boolean;
  isFluoridationConsentGiven?: boolean;
}

export function AdditionalInformationFormSection(
  props: AdditionalInformationFormSectionProps,
) {
  const { isScreening, isFluoridation, isFluoridationConsentGiven } = props;
  const hasResult = useExaminationStore((store) => store.hasResult);
  const toggleDentition = useExaminationStore((state) => state.toggleDentition);

  if (!(isFluoridation || isScreening)) {
    throw new Error("Either screening or fluoridation must be active");
  }

  if (isFluoridation && !isScreening) {
    return (
      <ExaminationSection title="Zusatzinfos">
        <Grid container columns={2} spacing={2}>
          <Grid {...FIELD_BREAKPOINTS}>
            <FluoridationField
              fluoridationConsentGiven={props.isFluoridationConsentGiven}
            />
          </Grid>
        </Grid>
      </ExaminationSection>
    );
  }

  return (
    <ExaminationSection title="Zusatzinfos">
      <Grid container columns={2} spacing={2}>
        <Grid {...FIELD_BREAKPOINTS}>
          <SelectField
            name="dentitionType"
            label="Gebisstyp"
            options={DENTITION_TYPE_OPTIONS}
            disabled={hasResult}
            hint={
              hasResult ? "Es wurden bereits Befunde eingetragen" : undefined
            }
            onChange={(value) => {
              toggleDentition(value as ApiDentitionType);
            }}
          />
        </Grid>
        <Grid {...FIELD_BREAKPOINTS}>
          <SelectField
            name="oralHygieneStatus"
            label="Mundhygienestatus"
            options={ORAL_HYGIENE_STATUS_OPTIONS}
          />
        </Grid>
        {isFluoridation && (
          <Grid {...FIELD_BREAKPOINTS}>
            <FluoridationField
              fluoridationConsentGiven={isFluoridationConsentGiven}
            />
          </Grid>
        )}
        <Grid {...FIELD_BREAKPOINTS} xlOffset={isFluoridation ? 0 : 1}>
          <SelectField
            name="mihStatus"
            label="MIH-Status"
            options={MIH_STATUS_OPTIONS}
          />
        </Grid>
        <Grid {...FIELD_BREAKPOINTS}>
          <OrthodonticFindingsField />
        </Grid>
        <Grid {...FIELD_BREAKPOINTS}>
          <SelectField
            name="orthodonticStatus"
            label="KFO-Behandlung"
            options={ORTHODONTIC_STATUS_OPTIONS}
          />
        </Grid>
      </Grid>
      <Divider />
      <ParodontalStatusFormGroup />
    </ExaminationSection>
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

const CHECKBOX_BREAKPOINTS = { xxs: 4, xs: 2, xl: 1 } as const;

function ParodontalStatusFormGroup() {
  const titleId = useId();

  return (
    <Stack
      component="section"
      direction="column"
      gap={3}
      aria-labelledby={titleId}
    >
      <ExaminationSectionSecondaryTitle titleId={titleId}>
        Parodontalstatus
      </ExaminationSectionSecondaryTitle>
      <Grid container columns={4} spacing={2} wrap="wrap">
        <Grid {...CHECKBOX_BREAKPOINTS}>
          <CheckboxField name="plaque" label="Plaque" />
        </Grid>
        <Grid {...CHECKBOX_BREAKPOINTS}>
          <CheckboxField name="calculus" label="Zahnstein" />
        </Grid>
        <Grid {...CHECKBOX_BREAKPOINTS}>
          <CheckboxField name="gingivitis" label="Gingivitis" />
        </Grid>
        <Grid {...CHECKBOX_BREAKPOINTS}>
          <CheckboxField name="parodontitis" label="Parodontitis" />
        </Grid>
      </Grid>
    </Stack>
  );
}
