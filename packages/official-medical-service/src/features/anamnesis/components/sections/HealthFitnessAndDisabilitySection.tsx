/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useTranslation } from "react-i18next";

import {
  InputField,
  TextareaField,
  YearField,
  createFieldNameMapper,
} from "@eshg/lib-portal";

import { BooleanRadioButtonsWithFollowUp } from "../fields/BooleanRadioButtonsWithFollowUp";

import { SectionSheet } from "./SectionSheet";

export function HealthFitnessAndDisabilitySection({
  citizen,
}: Readonly<{ citizen?: boolean }>) {
  const { t } = useTranslation("officialMedicalService/anamnesis", {
    keyPrefix: "content.healthFitnessAndDisability",
  });
  const healthFitnessAndDisabilityInfo = createFieldNameMapper(
    "healthFitnessAndDisabilityInfo",
  );

  return (
    <SectionSheet title={t("title")} citizen={citizen}>
      <BooleanRadioButtonsWithFollowUp
        name={healthFitnessAndDisabilityInfo(
          "priorExaminationInfo.hasPriorExaminations",
        )}
        label={t("priorExaminationInfo.hasPriorExaminations.label")}
        required={t("priorExaminationInfo.hasPriorExaminations.required")}
        followUpOn
      >
        <Stack direction="row" gap={3}>
          <YearField
            name={healthFitnessAndDisabilityInfo("priorExaminationInfo.year")}
            min={1900}
            max={new Date().getFullYear()}
            label={t("priorExaminationInfo.year.label")}
            required={t("priorExaminationInfo.year.required")}
          />
          <InputField
            name={healthFitnessAndDisabilityInfo("priorExaminationInfo.place")}
            label={t("priorExaminationInfo.place.label")}
            required={t("priorExaminationInfo.place.required")}
          />
        </Stack>
        <TextareaField
          name={healthFitnessAndDisabilityInfo("priorExaminationInfo.reason")}
          label={t("priorExaminationInfo.reason.label")}
          required={t("priorExaminationInfo.reason.required")}
        />
        <TextareaField
          name={healthFitnessAndDisabilityInfo("priorExaminationInfo.result")}
          label={t("priorExaminationInfo.result.label")}
          required={t("priorExaminationInfo.result.required")}
        />
      </BooleanRadioButtonsWithFollowUp>
      <BooleanRadioButtonsWithFollowUp
        name={healthFitnessAndDisabilityInfo("disabilityInfo.hasDisability")}
        label={t("disabilityInfo.hasDisability.label")}
        required={t("disabilityInfo.hasDisability.required")}
        followUpOn
      >
        <TextareaField
          name={healthFitnessAndDisabilityInfo("disabilityInfo.reason")}
          label={t("disabilityInfo.reason.label")}
          required={t("disabilityInfo.reason.required")}
        />
        <TextareaField
          name={healthFitnessAndDisabilityInfo("disabilityInfo.degree")}
          label={t("disabilityInfo.degree.label")}
          required={t("disabilityInfo.degree.required")}
        />
      </BooleanRadioButtonsWithFollowUp>
    </SectionSheet>
  );
}
