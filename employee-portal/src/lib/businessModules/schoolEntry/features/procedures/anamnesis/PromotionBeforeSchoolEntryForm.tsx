/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { SoftRequiredBooleanSelectField } from "@eshg/lib-portal/components/form/fieldVariants";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { HorizontalField } from "@eshg/lib-portal/components/formFields/HorizontalField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { useValidators } from "@eshg/lib-portal/hooks/useValidators";
import { SetFieldValueHelper } from "@eshg/lib-portal/types/form";

import {
  AnamnesisFormValues,
  PromotionBeforeSchoolEntryValues,
} from "@/lib/businessModules/schoolEntry/features/procedures/anamnesis/AnamnesisForm";
import { SetAllBooleanSelect } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/SetAllSelect";
import { BOOLEAN_SELECT_STYLE } from "@/lib/businessModules/schoolEntry/features/procedures/styles";

const FIXED_WIDTH_BOOLEAN_SELECT_STYLE: SxProps = {
  ".MuiFormLabel-root": { width: "150px" },
  ...BOOLEAN_SELECT_STYLE,
};

interface PromotionBeforeSchoolEntryProps {
  values: AnamnesisFormValues;
  setFieldValue: SetFieldValueHelper;
}

export function PromotionBeforeSchoolEntryForm(
  props: PromotionBeforeSchoolEntryProps,
) {
  const { validatePastOrTodayDate } = useValidators();
  const promotionBeforeSchoolEntry = createFieldNameMapper(
    "promotionBeforeSchoolEntry",
  );
  const promotionTherapyAndAidInfo = createFieldNameMapper(
    "promotionTherapyAndAidInfo",
  );

  function handleChange(value: boolean) {
    for (const fieldName of [
      "earlySupport",
      "integrationPlace",
      "speechTherapy",
      "ergotherapy",
      "physiotherapy",
    ]) {
      void props.setFieldValue(promotionBeforeSchoolEntry(fieldName), value);
    }
  }

  return (
    <Stack gap={2} data-testid="promotionBeforeSchoolEntryForm">
      <Typography level="title-sm">
        Fördermaßnahmen / Therapien / Hilfsmittel
      </Typography>
      <Grid direction="row" container spacing={2}>
        <Grid xs={7}>
          <Stack direction="row" gap={2}>
            <SetAllBooleanSelect
              label="Alle"
              onChange={handleChange}
              sx={BOOLEAN_SELECT_STYLE}
            />
            <Stack gap={2}>
              <SoftRequiredBooleanSelectField
                name={promotionBeforeSchoolEntry("earlySupport")}
                label="Frühförderung"
                sx={FIXED_WIDTH_BOOLEAN_SELECT_STYLE}
                softRequired
                allowDeselection
              />
              <SoftRequiredBooleanSelectField
                name={promotionBeforeSchoolEntry("integrationPlace")}
                label="Integrationsplatz"
                sx={FIXED_WIDTH_BOOLEAN_SELECT_STYLE}
                softRequired
                allowDeselection
              />
              <BooleanWithDateFields
                nameBoolean={promotionBeforeSchoolEntry("speechTherapy")}
                labelBoolean="Logopädie"
                nameStartDate={promotionTherapyAndAidInfo("speechTherapyStart")}
                nameEndDate={promotionTherapyAndAidInfo("speechTherapyEnd")}
                values={props.values.promotionBeforeSchoolEntry}
              />
              <BooleanWithDateFields
                nameBoolean={promotionBeforeSchoolEntry("ergotherapy")}
                labelBoolean="Ergotherapie"
                nameStartDate={promotionTherapyAndAidInfo("ergoTherapyStart")}
                nameEndDate={promotionTherapyAndAidInfo("ergoTherapyEnd")}
                values={props.values.promotionBeforeSchoolEntry}
              />
              <BooleanWithDateFields
                nameBoolean={promotionBeforeSchoolEntry("physiotherapy")}
                labelBoolean="Krankengymnastik"
                nameStartDate={promotionTherapyAndAidInfo("physioTherapyStart")}
                nameEndDate={promotionTherapyAndAidInfo("physioTherapyEnd")}
                values={props.values.promotionBeforeSchoolEntry}
              />
            </Stack>
          </Stack>
        </Grid>
        <Grid xs={5}>
          <Stack gap={2}>
            <DateField
              name={promotionTherapyAndAidInfo("spectaclesSince")}
              label="Brille? Wenn ja, seit"
              component={HorizontalField}
              validate={validatePastOrTodayDate}
            />
            <DateField
              name={promotionTherapyAndAidInfo("visionSchoolSince")}
              label="Schielbehandlung, Sehschule? Wenn ja, seit"
              component={HorizontalField}
              validate={validatePastOrTodayDate}
            />
          </Stack>
        </Grid>
      </Grid>
      <Stack direction="row" gap={2} flexWrap="wrap">
        <SoftRequiredBooleanSelectField
          name={promotionTherapyAndAidInfo("visionImpairment")}
          label="Sehstörung"
          sx={BOOLEAN_SELECT_STYLE}
          allowDeselection
        />
        <SoftRequiredBooleanSelectField
          name={promotionTherapyAndAidInfo("hearingImpairment")}
          label="Hörstörung"
          sx={BOOLEAN_SELECT_STYLE}
          allowDeselection
        />
        <InputField
          name={promotionTherapyAndAidInfo("hearingAid")}
          label="Hörhilfen"
          type="text"
          component={HorizontalField}
        />
        <SoftRequiredBooleanSelectField
          name={promotionTherapyAndAidInfo("speechImpairment")}
          label="Sprachstörung"
          sx={BOOLEAN_SELECT_STYLE}
          allowDeselection
        />
      </Stack>
      <Stack direction="row" gap={2} flexWrap="wrap">
        <InputField
          name={promotionTherapyAndAidInfo("additionalTherapies")}
          label="Andere Fördermaßnahmen / Therapien"
          type="text"
          component={HorizontalField}
          sx={{ width: "flexEnd" }}
        />
      </Stack>
    </Stack>
  );
}

function BooleanWithDateFields(props: {
  nameBoolean: string;
  labelBoolean: string;
  nameStartDate: string;
  nameEndDate: string;
  values: PromotionBeforeSchoolEntryValues;
}) {
  const { validatePastOrTodayDate } = useValidators();
  const fieldName = props.nameBoolean.split(".")[1];

  return (
    <Stack direction="row" gap={2} flexWrap="wrap" data-testid={fieldName}>
      <SoftRequiredBooleanSelectField
        name={props.nameBoolean}
        label={props.labelBoolean}
        sx={FIXED_WIDTH_BOOLEAN_SELECT_STYLE}
        softRequired
        allowDeselection
      />
      {props.values[fieldName as keyof PromotionBeforeSchoolEntryValues] && (
        <Stack direction="row" gap={2}>
          <DateField
            name={props.nameStartDate}
            label="Von"
            component={HorizontalField}
            validate={validatePastOrTodayDate}
          />
          <DateField
            name={props.nameEndDate}
            label="Bis"
            component={HorizontalField}
            validate={validatePastOrTodayDate}
          />
        </Stack>
      )}
    </Stack>
  );
}
