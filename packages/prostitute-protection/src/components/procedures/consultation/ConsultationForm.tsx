/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Sheet, Typography } from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";

import {
  FormPlus,
  OptionalFieldValue,
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal";
import {
  ApiPersonLanguage,
  ApiProcedureDetails,
} from "@eshg/prostitute-protection-api";

import { useUpsertConsultationOptions } from "../../../api/mutations/consultation";
import { CertificateType } from "../../../shared/constants";
import { ConfirmLeaveDirtyFormEffect } from "../../form/ConfirmLeaveDirtyFormEffect";

import { CertificateTypeSection } from "./CertificateTypeSection";
import { GeneralSection } from "./GeneralSection";
import { LanguageSection } from "./LanguageSection";
import { NotesSection } from "./NotesSection";
import { SidePanelLayout, SidePanelStack } from "./SidePanelLayout";
import { StickyBottomBar } from "./StickyBottomBar";

export interface GeneralSectionData {
  legalAdvice: boolean;
  healthAndSocialInsurance: boolean;
  counselingServices: boolean;
  helpInEmergencies: boolean;
  taxObligation: boolean;
  counselingNeedClearing: boolean;
  informationMaterial: boolean;
  emergencyCoercionSituation: boolean;
  diseasePrevention: boolean;
  contraception: boolean;
  pregnancy: boolean;
  alcoholDrugUse: boolean;
  referralParagraph19: boolean;
}

export interface NotesSectionData {
  supervisedConsultation: boolean;
  remarks: string;
}

export interface LanguageSectionData {
  languageOfConsultation: ApiPersonLanguage | null;
  interpreterCalledIn: boolean;
  interpreterName: OptionalFieldValue<string>;
  interpreterLastName: OptionalFieldValue<string>;
}

export interface ConsultationFormData {
  general: GeneralSectionData;
  notes: NotesSectionData;
  language: LanguageSectionData;
  certificateType: CertificateType | null;
}
export function ConsultationForm({
  procedure,
}: Readonly<{
  procedure: ApiProcedureDetails;
  consultation?: string;
}>) {
  const consultationFormData: ConsultationFormData = {
    general: {
      legalAdvice: false,
      healthAndSocialInsurance: false,
      counselingServices: false,
      helpInEmergencies: false,
      taxObligation: false,
      counselingNeedClearing: false,
      informationMaterial: false,
      emergencyCoercionSituation: false,
      diseasePrevention: false,
      contraception: false,
      pregnancy: false,
      alcoholDrugUse: false,
      referralParagraph19: false,
    },
    notes: {
      supervisedConsultation: false,
      remarks: "",
    },
    language: {
      languageOfConsultation: procedure.languages[0] ?? null,
      interpreterCalledIn: false,
      interpreterName: "",
      interpreterLastName: "",
    },
    certificateType: CertificateType.fullName,
  };

  const upsertConsultationOptions = useUpsertConsultationOptions({
    procedureId: procedure.id,
  });
  const upsertConsultation = useMutation(upsertConsultationOptions);

  function onSubmit(values: ConsultationFormData) {
    const consultation = mapFormToApi(values);
    return upsertConsultation.mutateAsync({ consultation });
  }

  return (
    <Formik
      initialValues={consultationFormData}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ values }) => (
        <FormPlus
          aria-labelledby="consultation-title"
          sx={{ minHeight: "100%" }}
        >
          <ConfirmLeaveDirtyFormEffect
            onSaveMutation={{
              mutationOptions: upsertConsultationOptions,
              variableSupplier: () => ({
                procedureId: procedure.id,
                consultation: mapFormToApi(values),
              }),
            }}
          />
          <SidePanelLayout sx={{ margin: 0, padding: 0, pb: 3 }}>
            <Sheet>
              <Typography level="h2" mb={5} id="consultation-title">
                Beratung
              </Typography>
              <GeneralSection />
              <NotesSection />
            </Sheet>
            <SidePanelStack sx={{ pb: 3 }}>
              <LanguageSection />
              <CertificateTypeSection />
            </SidePanelStack>
          </SidePanelLayout>
          <StickyBottomBar />
        </FormPlus>
      )}
    </Formik>
  );
}

function mapFormToApi(values: ConsultationFormData) {
  return {
    general: values.general,
    notes: {
      supervisedConsultation: values.notes.supervisedConsultation,
      remarks: mapOptionalValue(values.notes.remarks),
    },
    language: {
      languageOfConsultation: values.language.languageOfConsultation,
      interpreterCalledIn: values.language.interpreterCalledIn,
      interpreterName: mapOptionalValue(values.language.interpreterName),
      interpreterLastName: mapOptionalValue(
        values.language.interpreterLastName,
      ),
    },
    certificateType: mapRequiredValue(values.certificateType),
  };
}

export type ConsultationRequestData = ReturnType<typeof mapFormToApi>;
