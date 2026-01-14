/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography, useTheme } from "@mui/joy";

import {
  CheckboxField,
  TextareaField,
  YesOrNoFieldData,
  YesOrNoWithFollowUp,
} from "@eshg/lib-portal";
import { ApiTextTemplateContext } from "@eshg/sti-protection-api";

import { SectionGrid } from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/SectionGrid";
import { TextareaFieldWithTextTemplates } from "@/lib/businessModules/stiProtection/components/textTemplates/TextareaFieldWithTextTemplates";

export interface GeneralSectionData {
  mainReason: string;

  furtherGenderInfo: string;

  hasHealthInsurance: YesOrNoFieldData;
  hasGermanHealthInsurance: boolean;

  hasInsecureResidence: YesOrNoFieldData;

  hasSymptoms: YesOrNoFieldData;
  symptoms: string;

  drugUse: string;

  referral: string;
  notes: string;
}

export function GeneralSection() {
  const theme = useTheme();
  return (
    <SectionGrid defaultColumn={1}>
      <Typography level="h3">Allgemein</Typography>

      <TextareaFieldWithTextTemplates
        context={ApiTextTemplateContext.ConsultationReason}
        name="general.mainReason"
        label="Konsultationsgrund"
      />
      <TextareaField
        name="general.furtherGenderInfo"
        label="Weitere Geschlechtsangaben"
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
      <YesOrNoWithFollowUp
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
