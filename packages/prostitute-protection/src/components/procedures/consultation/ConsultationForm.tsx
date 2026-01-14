/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Sheet, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";

import { ConfirmLeaveDirtyFormEffect } from "@eshg/lib-employee-portal";
import {
  FormPlus,
  OptionalFieldValue,
  mapOptionalValue,
  parseOptionalValue,
  useHandledMutation,
} from "@eshg/lib-portal";
import {
  ApiConsultation,
  type ApiPersonLanguage,
  ApiProcedureDetails,
} from "@eshg/prostitute-protection-api";

import { useUpsertConsultationOptions } from "../../../api/mutations/consultation";

import { LanguageSection } from "./LanguageSection";
import { NotesSection } from "./NotesSection";
import { PPA7Section } from "./PPA7Section";
import { PPA10Section } from "./PPA10Section";
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
  remark: OptionalFieldValue<string>;
  interpreterFirstName?: string;
  interpreterLastName?: string;
  languageOfConsultation?: ApiPersonLanguage | "";
}

export function ConsultationForm({
  procedure,
  consultation,
}: Readonly<{
  procedure: ApiProcedureDetails;
  consultation: ApiConsultation;
}>) {
  const upsertConsultationOptions = useUpsertConsultationOptions();
  const upsertConsultation = useHandledMutation(upsertConsultationOptions);

  function onSubmit(values: ConsultationFormData) {
    const apiConsultation = mapFormToApi(values);
    return upsertConsultation.mutateAsync({
      procedureId: procedure.id,
      apiConsultation,
    });
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
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ConfirmLeaveDirtyFormEffect
            onSaveMutation={{
              mutationOptions: upsertConsultationOptions,
              variableSupplier: () => ({
                procedureId: procedure.id,
                apiConsultation: mapFormToApi(values),
              }),
            }}
          />
          <Stack sx={{ flexGrow: 1, mb: 3 }}>
            <Sheet component={Stack} sx={{ gap: 5 }}>
              <Typography level="h2" id="consultation-title">
                Beratung Prostituiertenschutzgesetz
              </Typography>

              <PPA7Section />
              <PPA10Section />
              <LanguageSection />
              <NotesSection />
            </Sheet>
          </Stack>
          <StickyBottomBar />
        </FormPlus>
      )}
    </Formik>
  );
}

function mapApiToForm(consultation: ApiConsultation): ConsultationFormData {
  return {
    ...consultation,
    remark: parseOptionalValue(consultation.remark),
    interpreterLastName: parseOptionalValue(consultation.interpreterLastName),
    interpreterFirstName: parseOptionalValue(consultation.interpreterFirstName),
    languageOfConsultation: parseOptionalValue(
      consultation.languageOfConsultation,
    ),
  };
}

function mapFormToApi(values: ConsultationFormData): ApiConsultation {
  return {
    ...values,
    remark: mapOptionalValue(values.remark),
    interpreterLastName: values.interpreterConsulted
      ? mapOptionalValue(values.interpreterLastName)
      : undefined,
    interpreterFirstName: values.interpreterConsulted
      ? mapOptionalValue(values.interpreterFirstName)
      : undefined,
    languageOfConsultation: mapOptionalValue(values.languageOfConsultation),
  };
}
