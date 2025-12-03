/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Sheet, Typography } from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";

import { ConfirmLeaveDirtyFormEffect } from "@eshg/lib-employee-portal";
import {
  FormPlus,
  OptionalFieldValue,
  mapOptionalValue,
  parseOptionalValue,
} from "@eshg/lib-portal";
import {
  ApiConsultation,
  ApiPersonLanguage,
  ApiProcedureDetails,
} from "@eshg/prostitute-protection-api";

import { useUpsertConsultationOptions } from "../../../api/mutations/consultation";

import { GeneralSection } from "./GeneralSection";
import { LanguageSection } from "./LanguageSection";
import { NotesSection } from "./NotesSection";
import { SidePanelLayout, SidePanelStack } from "./SidePanelLayout";
import { StickyBottomBar } from "./StickyBottomBar";

export interface ConsultationFormData {
  alcoholAndDrugUsage: boolean;
  birthControl: boolean;
  clearing: boolean;
  consultingServices: boolean;
  diseasePrevention: boolean;
  emergencyHelp: boolean;
  healthAndSocialInsurance: boolean;
  informationMaterial: boolean;
  interpreterConsulted: boolean;
  legalAdvices: boolean;
  predicament: boolean;
  pregnancy: boolean;
  referral: boolean;
  supervisedConsultation: boolean;
  taxLiability: boolean;
  version: number;
  interpreterFirstName: OptionalFieldValue<string>;
  interpreterLastName: OptionalFieldValue<string>;
  languageOfConsultation: OptionalFieldValue<ApiPersonLanguage>;
  remark: OptionalFieldValue<string>;
}

export function ConsultationForm({
  procedure,
  consultation,
}: Readonly<{
  procedure: ApiProcedureDetails;
  consultation: ApiConsultation;
}>) {
  const upsertConsultationOptions = useUpsertConsultationOptions({
    procedureId: procedure.id,
  });
  const upsertConsultation = useMutation(upsertConsultationOptions);

  function onSubmit(values: ConsultationFormData) {
    const apiConsultation = mapFormToApi(values);
    return upsertConsultation.mutateAsync(apiConsultation);
  }

  const initialValues = mapApiToForm(consultation);

  return (
    <Formik
      initialValues={initialValues}
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
            </SidePanelStack>
          </SidePanelLayout>
          <StickyBottomBar />
        </FormPlus>
      )}
    </Formik>
  );
}

function mapApiToForm(consultation: ApiConsultation): ConsultationFormData {
  return {
    ...consultation,
    interpreterFirstName: parseOptionalValue(consultation.interpreterFirstName),
    interpreterLastName: parseOptionalValue(consultation.interpreterLastName),
    languageOfConsultation: parseOptionalValue(
      consultation.languageOfConsultation,
    ),
    remark: parseOptionalValue(consultation.remark),
  };
}

function mapFormToApi(values: ConsultationFormData): ApiConsultation {
  return {
    ...values,
    interpreterFirstName: mapOptionalValue(values.interpreterFirstName),
    interpreterLastName: mapOptionalValue(values.interpreterLastName),
    languageOfConsultation: mapOptionalValue(values.languageOfConsultation),
    remark: mapOptionalValue(values.remark),
  };
}
