/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { Typography, useTheme } from "@mui/joy";

import { SectionGrid } from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/SectionGrid";
import {
  YesOrNoFieldData,
  YesOrNoWithFollowUp,
} from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/YesOrNoWithFollowUp";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

export interface GeneralSectionData {
  mainReason: string;

  furtherGenderInfo: string;

  hasSufficientGermanLanguageSkills: boolean | null;
  isIlliterate: boolean;
  otherKnownLanguages: string;

  hasHealthInsurance: YesOrNoFieldData;
  hasGermanHealthInsurance: boolean;

  hasInsecureResidence: YesOrNoFieldData;

  hasSymptoms: YesOrNoFieldData;
  symptoms: string;

  drugUse: string;

  referral: string;
}

export function GeneralSection() {
  const theme = useTheme();
  return (
    <SectionGrid defaultColumn={1}>
      <Typography level="h3">Allgemein</Typography>

      <TextareaField name="general.mainReason" label="Konsultationsgrund" />
      <TextareaField
        name="general.furtherGenderInfo"
        label="Weitere Geschlechtsangaben"
      />

      <YesOrNoWithFollowUp
        name="general.hasSufficientGermanLanguageSkills"
        label="Deutsche Sprachkenntnis?"
        positiveLabel="ausreichend"
        negativeLabel="nicht ausreichend"
        followUpOnNo
        inlineFollowUp
      >
        <CheckboxField name="general.isIlliterate" label="Analphabet:in" />
      </YesOrNoWithFollowUp>

      <TextareaField
        name="general.otherKnownLanguages"
        label="Andere Sprachkenntnisse?"
      />

      <YesOrNoWithFollowUp
        name="general.hasHealthInsurance"
        label="Krankenversichert?"
        inlineFollowUp
      >
        <CheckboxField
          name="general.hasGermanHealthInsurance"
          label="Versichert in Deutschland"
        />
      </YesOrNoWithFollowUp>
      <InputField
        name="general.hasInsecureResidence"
        label="Unsicherer Aufenthalt?"
      />
      <YesOrNoWithFollowUp
        sx={{ gap: theme.spacing(5) }}
        name="general.hasSymptoms"
        label="Aktuelle Beschwerden"
        orientation="vertical"
      >
        <TextareaField name="general.symptoms" label="Falls ja, welche?" />
      </YesOrNoWithFollowUp>
      <TextareaField name="general.drugUse" label="Drogenkonsum" />
      <TextareaField name="general.referral" label="Weiterleitung an" />
    </SectionGrid>
  );
}
