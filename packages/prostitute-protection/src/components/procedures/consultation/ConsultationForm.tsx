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
import { PPA7Section } from "./PPA7Section";
import { PPA10Section } from "./PPA10Section";
import { StickyBottomBar } from "./StickyBottomBar";

export interface ConsultationFormData {
  version: number;
  paragraph7: {
    legalAdvices: boolean;
    healthAndSocialInsurance: boolean;
    consultingServices: boolean;
    emergencyHelp: boolean;
    taxLiability: boolean;
    informationMaterial: boolean;
    predicament: boolean;
  };
  paragraph10: {
    diseasePrevention: boolean;
    birthControl: boolean;
    pregnancy: boolean;
    alcoholAndDrugUsage: boolean;
    referral: boolean;
    clearing: boolean;
  };
  interpreterConsulted: boolean;
  interpreterFirstName?: string;
  interpreterLastName?: string;
  languageOfConsultation?: OptionalFieldValue<ApiPersonLanguage>;
}

export function ConsultationForm({
  procedure,
  consultation,
}: Readonly<{
  procedure: ApiProcedureDetails;
  consultation: ApiConsultation;
}>) {
  const upsertConsultationOptions = useUpsertConsultationOptions(procedure.id);
  const upsertConsultation = useHandledMutation(upsertConsultationOptions);

  function onSubmit(values: ConsultationFormData) {
    return upsertConsultation.mutateAsync(mapFormToApi(values));
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
              variableSupplier() {
                return mapFormToApi(values);
              },
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
    version: consultation.version,
    paragraph7: {
      legalAdvices: consultation.paragraph7.legalAdvices,
      healthAndSocialInsurance:
        consultation.paragraph7.healthAndSocialInsurance,
      consultingServices: consultation.paragraph7.consultingServices,
      emergencyHelp: consultation.paragraph7.emergencyHelp,
      taxLiability: consultation.paragraph7.taxLiability,
      informationMaterial: consultation.paragraph7.informationMaterial,
      predicament: consultation.paragraph7.predicament,
    },
    paragraph10: {
      diseasePrevention: consultation.paragraph10.diseasePrevention,
      birthControl: consultation.paragraph10.birthControl,
      pregnancy: consultation.paragraph10.pregnancy,
      alcoholAndDrugUsage: consultation.paragraph10.alcoholAndDrugUsage,
      referral: consultation.paragraph10.referral,
      clearing: consultation.paragraph10.clearing,
    },
    interpreterConsulted: consultation.interpreterConsulted,
    interpreterLastName: parseOptionalValue(consultation.interpreterLastName),
    interpreterFirstName: parseOptionalValue(consultation.interpreterFirstName),
    languageOfConsultation: parseOptionalValue(
      consultation.languageOfConsultation,
    ),
  };
}

function mapFormToApi(values: ConsultationFormData): ApiConsultation {
  return {
    version: values.version,
    paragraph7: {
      legalAdvices: values.paragraph7.legalAdvices,
      healthAndSocialInsurance: values.paragraph7.healthAndSocialInsurance,
      consultingServices: values.paragraph7.consultingServices,
      emergencyHelp: values.paragraph7.emergencyHelp,
      taxLiability: values.paragraph7.taxLiability,
      informationMaterial: values.paragraph7.informationMaterial,
      predicament: values.paragraph7.predicament,
    },
    paragraph10: {
      diseasePrevention: values.paragraph10.diseasePrevention,
      birthControl: values.paragraph10.birthControl,
      pregnancy: values.paragraph10.pregnancy,
      alcoholAndDrugUsage: values.paragraph10.alcoholAndDrugUsage,
      referral: values.paragraph10.referral,
      clearing: values.paragraph10.clearing,
    },
    interpreterConsulted: values.interpreterConsulted,
    interpreterLastName: values.interpreterConsulted
      ? mapOptionalValue(values.interpreterLastName)
      : undefined,
    interpreterFirstName: values.interpreterConsulted
      ? mapOptionalValue(values.interpreterFirstName)
      : undefined,
    languageOfConsultation: mapOptionalValue(values.languageOfConsultation),
  };
}
