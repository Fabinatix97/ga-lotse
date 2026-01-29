/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Grid, Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { useEffect, useId } from "react";
import { useShallow } from "zustand/react/shallow";

import {
  ApiDentitionType,
  ApiMihStatus,
  ApiOralHygieneStatus,
  ApiOrthodonticStatus,
} from "@eshg/dental-api";
import {
  Alert,
  CheckboxField,
  SelectField,
  SoftRequiredBooleanSelectField,
  buildEnumOptions,
} from "@eshg/lib-portal";

import { DENTITION_TYPE_OPTIONS } from "../../config/prophylaxisSession";
import { useExaminationStore } from "../../stores/examination/ExaminationStoreProvider";
import {
  MIH_STATUS,
  ORAL_HYGIENE_STATUS,
  ORTHODONTIC_STATUS,
} from "../../translations/examination";
import { ExaminationFormValues } from "../../types/examination";

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

const FIELD_BREAKPOINTS = { xxs: 2, xs: 1 } as const;

interface AdditionalInformationFormSectionProps {
  isScreening: boolean;
  isFluoridation: boolean;
  isFluoridationConsentGiven?: boolean;
  columns: number;
}

export function AdditionalInformationFormSection(
  props: AdditionalInformationFormSectionProps,
) {
  const { isScreening, isFluoridation, isFluoridationConsentGiven } = props;
  const hasResult = useExaminationStore((store) => store.hasResult);
  const toggleDentition = useExaminationStore((state) => state.toggleDentition);
  const dentitionType = useExaminationStore(
    useShallow((state) => state.dentitionType),
  );

  const { values, setFieldValue } = useFormikContext<ExaminationFormValues>();

  useEffect(() => {
    if (isScreening && values.dentitionType !== dentitionType) {
      void setFieldValue("dentitionType", dentitionType);
    }
  }, [isScreening, values, setFieldValue, dentitionType]);

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
      <Grid container columns={props.columns} spacing={2}>
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
            label="MIH/MMH-Status"
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
        sx={{ overflowWrap: "break-word", hyphens: "auto" }}
      />
    );
  }

  return (
    <SoftRequiredBooleanSelectField
      name="fluorideVarnishApplied"
      label="Fluoridierung"
      orientation="vertical"
      softRequired
      allowDeselection
    />
  );
}

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
      <Stack direction="row" gap={4} sx={{ flexWrap: "wrap" }}>
        <CheckboxField name="plaque" label="Plaque" />
        <CheckboxField name="calculus" label="Zahnstein" />
        <CheckboxField name="gingivitis" label="Gingivitis" />
        <CheckboxField name="blackStain" label="Black Stain" />
        <CheckboxField name="parodontitis" label="Parodontitis" />
      </Stack>
    </Stack>
  );
}
