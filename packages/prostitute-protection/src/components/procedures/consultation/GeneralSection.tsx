/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import {
  SelectField,
  TextareaField,
  YesOrNoWithFollowUp,
} from "@eshg/lib-portal";

import {
  CONSULTATION_TOPIC_OPTIONS,
  HEALTH_INSURANCE_OPTIONS,
  MEDICAL_REFERRAL_OPTIONS,
  WORK_ENVIRONMENT_OPTIONS,
} from "../../../shared/constants";

import { SectionGrid } from "./SectionGrid";

export function GeneralSection() {
  return (
    <SectionGrid>
      <Typography level="h3">Allgemein</Typography>

      <TextareaField name="general.mainReason" label="Konsultationsgrund" />
      <TextareaField
        name="general.furtherGenderInfo"
        label="Weitere Geschlechtsangaben"
      />
      <SelectField
        name="general.consultationTopics"
        label="Beratungsthemen"
        options={CONSULTATION_TOPIC_OPTIONS}
      />
      <YesOrNoWithFollowUp
        name="general.beginnerInSexWork"
        label="Anfängerin in der Sexarbeit"
      />
      <SelectField
        name="general.workEnvironment"
        label="Arbeitsumfeld"
        options={WORK_ENVIRONMENT_OPTIONS}
      />
      <YesOrNoWithFollowUp
        name="general.emergencySituation"
        label="Notfallsituation"
      />
      <SelectField
        name="general.healthInsurance"
        label="Krankenversicherung"
        options={HEALTH_INSURANCE_OPTIONS}
      />
      <YesOrNoWithFollowUp
        name="general.referralToSocialServices"
        label="Weiterleitung an soziale Dienste"
      />
      <SelectField
        name="general.referralToMedicalInstitutions"
        label="Überweisung an medizinische Einrichtungen"
        options={MEDICAL_REFERRAL_OPTIONS}
      />
    </SectionGrid>
  );
}
