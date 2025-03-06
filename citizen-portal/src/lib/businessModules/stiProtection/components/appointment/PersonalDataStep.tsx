/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCountryCode } from "@eshg/base-api";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { GENDER_OPTIONS } from "@eshg/lib-portal/components/formFields/constants";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { validateRange } from "@eshg/lib-portal/helpers/validators";
import {
  ApiAddPersonalDetailsRequest,
  ApiGender,
} from "@eshg/sti-protection-api";
import { styled } from "@mui/joy";
import assert from "assert";
import { useFormikContext } from "formik";
import { isNumber } from "remeda";

import { useAddPersonalDetails } from "@/lib/businessModules/stiProtection/api/mutations/publicCitizensApi";
import { useTranslation } from "@/lib/i18n/client";
import { CountryField } from "@/lib/shared/components/form/CountryField";

import { useFormData } from "./AppointmentDataContext";
import { AppointmentFormData } from "./AppointmentStepper";
import { StepLayout } from "./StepLayout";
import { StepSubTitle } from "./StepSubTitle";

interface PersonalData {
  gender: ApiGender;
  birthYear: number;
  countryOfBirth: ApiCountryCode | null;
  inGermanySince: number | "";
}

const initialValues = {
  gender: null,
  birthYear: "",
  countryOfBirth: null,
  inGermanySince: "",
} as const;

export function PersonalDataStep() {
  const { t } = useTranslation("stiProtection/forms");
  const thisYear = new Date().getFullYear();
  const [{ procedureId }] = useFormData<AppointmentFormData>();
  assert.ok(procedureId);

  const addPersonalDetails = useAddPersonalDetails(procedureId);
  async function onSubmit(values: PersonalData) {
    const mappedValues = mapToAddPersonalDetails(values);
    await addPersonalDetails.mutateAsync(mappedValues);
    return values;
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
          options={GENDER_OPTIONS}
          label={t("personal_data.fields.gender")}
          required={t("personal_data.fields.gender_required")}
        />
        <NumberField
          name="birthYear"
          label={t("personal_data.fields.birth_year")}
          required={t("personal_data.fields.birth_year_required")}
          min={1990}
          max={thisYear}
          validate={validateYearWithinRange(
            1900,
            thisYear,
            invalidYearRangeMessage,
          )}
        />
        <CountryField
          name="countryOfBirth"
          label={t("personal_data.fields.birth_country")}
        />
        <InGermanySinceField
          name="inGermanySince"
          label={t("personal_data.fields.in_germany_since")}
          countryFieldName="countryOfBirth"
          birthYearFieldName="birthYear"
          invalidYearRangeMessage={invalidYearRangeMessage}
        />
      </PersonalDataGrid>
    </StepLayout>
  );
}

function InGermanySinceField({
  name,
  label,
  countryFieldName,
  birthYearFieldName,
  invalidYearRangeMessage,
}: {
  name: string;
  label: string;
  countryFieldName: string;
  birthYearFieldName: string;
  invalidYearRangeMessage: InvalidYearRangeMessage;
}) {
  const { getFieldMeta } = useFormikContext();
  const { value: birthCountry } = getFieldMeta(countryFieldName);
  const { value: birthYear } = getFieldMeta(birthYearFieldName);
  if (birthCountry === ApiCountryCode.De) {
    return null;
  }
  const thisYear = new Date().getFullYear();
  const minYear = isNumber(birthYear) ? birthYear : 1900;

  return (
    <NumberField
      name={name}
      label={label}
      min={minYear}
      max={thisYear}
      validate={validateYearWithinRange(
        minYear,
        thisYear,
        invalidYearRangeMessage,
      )}
    />
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

type InvalidYearRangeMessage = (minYear: number, maxYear: number) => string;
function validateYearWithinRange(
  minYear: number,
  maxYear: number,
  message: InvalidYearRangeMessage,
) {
  return (year: number | "") => {
    if (!year || isNaN(year)) {
      return;
    }
    if (validateRange(minYear, maxYear)(year)) {
      return message(minYear, maxYear);
    }
  };
}

function mapToAddPersonalDetails(
  data: PersonalData,
): ApiAddPersonalDetailsRequest {
  return {
    gender: data.gender,
    yearOfBirth: data.birthYear,
    countryOfBirth: data.countryOfBirth ?? undefined,
    inGermanySince: mapOptionalValue(data.inGermanySince),
  };
}
