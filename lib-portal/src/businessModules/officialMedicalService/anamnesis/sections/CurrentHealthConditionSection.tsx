/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Typography, useTheme } from "@mui/joy";
import { useTranslation } from "react-i18next";

import { useIsFormDisabled } from "../../../../components/form/DisabledFormContext";
import { RadioButtonsField } from "../../../../components/formFields/RadioButtonsField";
import { TextareaField } from "../../../../components/formFields/TextareaField";
import { createFieldNameMapper } from "../../../../helpers/form";
import { BooleanRadioButtonsWithFollowUp } from "../fields/BooleanRadioButtonsWithFollowUp";
import { BooleanRadioField } from "../fields/BooleanRadioField";
import { MultiSelectWithCheckboxesField } from "../fields/MultiSelectWithCheckboxesField";
import {
  useCurrentMedicalConditionOptions,
  useOpticalAidOptions,
} from "../options";

import { SectionSheet } from "./SectionSheet";

export function CurrentHealthConditionSection({
  citizen,
}: Readonly<{ citizen?: boolean }>) {
  const { t } = useTranslation("officialMedicalService/anamnesis", {
    keyPrefix: "content.currentHealthCondition",
  });
  const currentHealthConditionInfo = createFieldNameMapper(
    "currentHealthConditionInfo",
  );
  const theme = useTheme();

  const disabled = useIsFormDisabled();

  const currentMedicalConditionOptions = useCurrentMedicalConditionOptions();
  const opticalAidOptions = useOpticalAidOptions();

  return (
    <SectionSheet title={t("title")} citizen={citizen}>
      <BooleanRadioButtonsWithFollowUp
        name={currentHealthConditionInfo("currentMedicalConditionsInfo.answer")}
        label={t("currentMedicalConditionsInfo.answer.label")}
        required={t("currentMedicalConditionsInfo.answer.required")}
        followUpOn
      >
        <Typography
          level="title-md"
          component="h4"
          sx={{
            pt: 2,
            color: disabled
              ? theme.palette.text.secondary
              : theme.palette.text.primary,
          }}
        >
          Beschwerden
        </Typography>
        <MultiSelectWithCheckboxesField
          options={currentMedicalConditionOptions}
          name={currentHealthConditionInfo(
            "currentMedicalConditionsInfo.descriptionOfCondition",
          )}
          label={t("currentMedicalConditionsInfo.descriptionOfCondition.label")}
          placeholder={t(
            "currentMedicalConditionsInfo.descriptionOfCondition.placeholder",
          )}
          required={t(
            "currentMedicalConditionsInfo.descriptionOfCondition.required",
          )}
        />
        <TextareaField
          name={currentHealthConditionInfo(
            "currentMedicalConditionsInfo.particulars",
          )}
          label={t("currentMedicalConditionsInfo.particulars.label")}
          required={t("currentMedicalConditionsInfo.particulars.required")}
        />
      </BooleanRadioButtonsWithFollowUp>
      <BooleanRadioButtonsWithFollowUp
        name={currentHealthConditionInfo("medicalImagingFindingsInfo.answer")}
        label={t("medicalImagingFindingsInfo.answer.label")}
        required={t("medicalImagingFindingsInfo.answer.required")}
        followUpOn
      >
        <TextareaField
          name={currentHealthConditionInfo("medicalImagingFindingsInfo.result")}
          label={t("medicalImagingFindingsInfo.result.label")}
          required={t("medicalImagingFindingsInfo.result.required")}
        />
      </BooleanRadioButtonsWithFollowUp>
      <BooleanRadioButtonsWithFollowUp
        name={currentHealthConditionInfo(
          "medicationDietarySupplementsOrDrugsInfo.answer",
        )}
        label={t("medicationDietarySupplementsOrDrugsInfo.answer.label")}
        required={t("medicationDietarySupplementsOrDrugsInfo.answer.required")}
        followUpOn
      >
        <TextareaField
          name={currentHealthConditionInfo(
            "medicationDietarySupplementsOrDrugsInfo.substances",
          )}
          label={t("medicationDietarySupplementsOrDrugsInfo.substances.label")}
          required={t(
            "medicationDietarySupplementsOrDrugsInfo.substances.required",
          )}
        />
      </BooleanRadioButtonsWithFollowUp>
      <BooleanRadioField
        name={currentHealthConditionInfo("healthyAndCapableInfo.answer")}
        label={t("healthyAndCapableInfo.answer.label")}
        required={t("healthyAndCapableInfo.answer.required")}
      />
      <BooleanRadioButtonsWithFollowUp
        name={currentHealthConditionInfo("sportsInfo.answer")}
        label={t("sportsInfo.answer.label")}
        required={t("sportsInfo.answer.required")}
        followUpOn
      >
        <TextareaField
          name={currentHealthConditionInfo("sportsInfo.formOfSport")}
          label={t("sportsInfo.formOfSport.label")}
          required={t("sportsInfo.formOfSport.required")}
        />
      </BooleanRadioButtonsWithFollowUp>
      <RadioButtonsField
        options={opticalAidOptions}
        name={currentHealthConditionInfo("opticalAidInfo.answer")}
        label={t("opticalAidInfo.answer.label")}
        orientation="horizontal"
        required={t("opticalAidInfo.answer.required")}
      />
      <TextareaField
        name={currentHealthConditionInfo(
          "primaryCareDoctorOrAttendingPhysician",
        )}
        label={t("primaryCareDoctorOrAttendingPhysician.label")}
        required={t("primaryCareDoctorOrAttendingPhysician.required")}
      />
    </SectionSheet>
  );
}
