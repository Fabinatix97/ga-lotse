/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InfoOutlined } from "@mui/icons-material";
import { Sheet, Typography, styled } from "@mui/joy";
import { useFormikContext } from "formik";
import { useMemo } from "react";

import { InputField, RadioButtonsField, SelectField } from "@eshg/lib-portal";
import {
  ApiPersonLanguage,
  ApiProstituteProtectionProcedureType,
} from "@eshg/prostitute-protection-api";

import { SelectionOption } from "@/lib/businessModules/travelMedicine/components/shared/CountryFieldMulti";
import { useTranslation } from "@/lib/i18n/client";
import { InfoSection } from "@/lib/shared/components/infoSection";

import { AppointmentFormData } from "./AppointmentStepper";
import { StepSubTitle } from "./StepSubTitle";

export function PersonalDataStep() {
  const { t } = useTranslation("prostituteProtection/forms");
  const { values } = useFormikContext<AppointmentFormData>();
  const translatedProcedureTypeOptions: SelectionOption[] = useMemo(
    () =>
      Object.values(ApiProstituteProtectionProcedureType).map((value) => {
        return {
          value,
          label: t(`options.procedure_type.${value}`),
        };
      }),
    [t],
  );

  return (
    <Sheet sx={{ backgroundColor: (theme) => theme.palette.background.body }}>
      <StepSubTitle title={t("personal_data.title")} />
      <PersonalDataGrid>
        <SelectField
          options={translatedProcedureTypeOptions}
          name="procedureType"
          label={t("personal_data.fields.application_type")}
          required={t("personal_data.fields.application_type_required")}
        />
        <InputField
          label={t("personal_data.fields.alias")}
          name="alias"
          required={t("personal_data.fields.alias_required")}
        />
        <Language />
      </PersonalDataGrid>
      {values.hasSufficientGermanLanguageSkills === "no" && (
        <InfoSection
          sx={{ margin: 3, marginLeft: 0 }}
          icon={<InfoOutlined color="primary" />}
        >
          <Typography>{t("personal_data.translator_required_text")}</Typography>
          <Typography>{t("personal_data.no_translator_text")}</Typography>
        </InfoSection>
      )}
    </Sheet>
  );
}

function Language() {
  const { t } = useTranslation("prostituteProtection/forms");
  const { values, setFieldValue } = useFormikContext<AppointmentFormData>();
  const translatedLanguageOptions: SelectionOption[] = useMemo(
    () =>
      Object.values(ApiPersonLanguage).map((value) => {
        return {
          value,
          label: t(`options.language.${value}`),
        };
      }),
    [t],
  );

  async function handleLanguageChange(data: ApiPersonLanguage[]) {
    const german = ApiPersonLanguage.German;
    const languagesSet = new Set(data);
    const hasGerman = languagesSet.has(german);

    if (hasGerman) {
      await setFieldValue("hasSufficientGermanLanguageSkills", "yes");
      await setFieldValue("otherKnownLanguages", []);
      return;
    }

    await setFieldValue("otherKnownLanguages", [...languagesSet]);
  }

  async function handleSelectChange(value: string[]) {
    await handleLanguageChange(value as ApiPersonLanguage[]);
  }

  return (
    <>
      <RadioButtonsField
        label={t("personal_data.fields.sufficient_german_skills")}
        name="hasSufficientGermanLanguageSkills"
        options={[
          { label: t("common.yes"), value: "yes" },
          { label: t("common.no"), value: "no" },
        ]}
        required={t("personal_data.fields.sufficient_german_skills_required")}
      />
      {values.hasSufficientGermanLanguageSkills === "no" && (
        <SelectField
          name="otherKnownLanguages"
          label={t("personal_data.fields.other_known_languages")}
          options={translatedLanguageOptions}
          required={
            values.hasSufficientGermanLanguageSkills === "no"
              ? t("personal_data.fields.other_known_languages_required")
              : undefined
          }
          multiple
          onChange={handleSelectChange}
        />
      )}
    </>
  );
}

const PersonalDataGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 0.5fr)",
  rowGap: theme.spacing(3),
  columnGap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "minmax(0, 1fr)",
  },
}));
