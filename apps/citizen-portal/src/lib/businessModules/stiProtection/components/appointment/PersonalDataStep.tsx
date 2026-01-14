/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { styled } from "@mui/joy";
import assert from "assert";

import {
  InputField,
  NumberField,
  PortalErrorCode,
  RadioButtonsField,
  SelectField,
} from "@eshg/lib-portal";

import { useAddPersonalDetails } from "@/lib/businessModules/stiProtection/api/mutations/publicCitizenApi";
import { useGenderOptions } from "@/lib/businessModules/stiProtection/components/shared/options";
import { useTranslation } from "@/lib/i18n/client";

import { useFormData } from "./AppointmentDataContext";
import { AppointmentFormData } from "./AppointmentStepper";
import { StepLayout } from "./StepLayout";
import { StepSubTitle } from "./StepSubTitle";
import {
  PersonalData,
  mapToAddPersonalDetails,
  validateYearWithinRange,
} from "./helpers";

const initialValues = {
  gender: null,
  birthYear: "",
  pronouns: "",
  hasSufficientGermanLanguageSkills: null,
  otherKnownLanguages: "",
} as const;

export function PersonalDataStep() {
  const { t } = useTranslation("stiProtection/forms");
  const genderOptions = useGenderOptions();
  const thisYear = new Date().getFullYear();
  const minYear = 1900;
  const [formData] = useFormData<AppointmentFormData>();
  const procedureId = formData.procedureId;
  assert.ok(procedureId);

  const addPersonalDetails = useAddPersonalDetails(procedureId);
  async function onSubmit(values: PersonalData) {
    const mappedValues = mapToAddPersonalDetails({
      ...formData,
      ...values,
    });
    const results = await addPersonalDetails.mutateAsync(mappedValues);
    if (results === PortalErrorCode.Conflict) {
      return PortalErrorCode.Conflict;
    }
    return { ...values, procedureId: results.procedureId };
  }

  function invalidYearRangeMessage(
    startInclusive: number,
    endInclusive: number,
  ) {
    return t("personal_data.fields.invalid_year_range", {
      startInclusive,
      endInclusive,
    });
  }

  return (
    <StepLayout initialValues={initialValues} onSubmit={onSubmit}>
      <StepSubTitle title={t("personal_data.title")} />
      <PersonalDataGrid>
        <SelectField
          name="gender"
          options={genderOptions}
          label={t("personal_data.fields.gender")}
          required={t("personal_data.fields.gender_required")}
        />
        <NumberField
          name="birthYear"
          label={t("personal_data.fields.birth_year")}
          required={t("personal_data.fields.birth_year_required")}
          min={minYear}
          max={thisYear}
          validate={validateYearWithinRange(
            minYear,
            thisYear,
            invalidYearRangeMessage,
          )}
        />
        <InputField
          label={t("personal_data.fields.pronouns")}
          name="pronouns"
        />
        <RadioButtonsField
          label={t("personal_data.fields.sufficient_german_skills")}
          name="hasSufficientGermanLanguageSkills"
          resettable
          options={[
            { label: t("common.yes"), value: "yes" },
            { label: t("common.no"), value: "no" },
          ]}
        />
        <InputField
          label={t("personal_data.fields.other_known_languages")}
          name="otherKnownLanguages"
        />
      </PersonalDataGrid>
    </StepLayout>
  );
}

const PersonalDataGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  rowGap: theme.spacing(3),
  columnGap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "minmax(0, 1fr)",
  },
}));
