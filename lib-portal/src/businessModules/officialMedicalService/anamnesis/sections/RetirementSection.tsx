/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useTranslation } from "react-i18next";

import { TextareaField } from "../../../../components/formFields/TextareaField";
import { createFieldNameMapper } from "../../../../helpers/form";
import { BooleanRadioButtonsWithFollowUp } from "../fields/BooleanRadioButtonsWithFollowUp";

import { SectionSheet } from "./SectionSheet";

export function RetirementSection({
  citizen,
}: Readonly<{ citizen?: boolean }>) {
  const { t } = useTranslation("officialMedicalService/anamnesis", {
    keyPrefix: "content.retirement",
  });
  const retirementInfo = createFieldNameMapper("retirementInfo");

  return (
    <SectionSheet title={t("title")} citizen={citizen}>
      <BooleanRadioButtonsWithFollowUp
        name={retirementInfo("appliedForRetirement")}
        label={t("appliedForRetirement.label")}
        required={t("appliedForRetirement.required")}
        followUpOn
      >
        <TextareaField
          name={retirementInfo("reason")}
          label={t("reason.label")}
          required={t("reason.required")}
        />
        <TextareaField
          name={retirementInfo("reductionOfEarningCapacity")}
          label={t("reductionOfEarningCapacity.label")}
          required={t("reductionOfEarningCapacity.required")}
        />
      </BooleanRadioButtonsWithFollowUp>
    </SectionSheet>
  );
}
