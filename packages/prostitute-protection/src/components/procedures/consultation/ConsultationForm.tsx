/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Sheet, Typography } from "@mui/joy";
import { Formik } from "formik";

import { FormPlus, TextareaField } from "@eshg/lib-portal";

import { ApiProstituteProtectionProcedure } from "../../../mock";

import { GeneralSection } from "./GeneralSection";
import { SidePanelLayout, SidePanelSheet } from "./SidePanelLayout";
import { StickyBottomBar } from "./StickyBottomBar";

export interface GeneralSectionData {
  mainReason: string;
  furtherGenderInfo: string;
  consultationTopics: string;
  beginnerInSexWork: boolean;
  workEnvironment: string;
  emergencySituation: boolean;
  healthInsurance: string;
  referralToSocialServices: boolean;
  referralToMedicalInstitutions: string;
  notes: string;
}

export interface ConsultationFormData {
  general: GeneralSectionData;
}
export function ConsultationForm({
  procedure,
}: Readonly<{
  procedure: ApiProstituteProtectionProcedure;
  consultation?: string;
}>) {
  const consultationFormData: ConsultationFormData = {
    general: {
      mainReason: "",
      furtherGenderInfo: "",
      consultationTopics: procedure.consultationTopics as unknown as string,
      beginnerInSexWork: false,
      workEnvironment: "",
      emergencySituation: false,
      healthInsurance: "",
      referralToSocialServices: false,
      referralToMedicalInstitutions: "",
      notes: "",
    },
  };

  function onSubmit() {
    // console.log("submit", JSON.stringify(values, null, 2));
  }

  return (
    <Formik
      initialValues={consultationFormData}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {() => (
        <FormPlus aria-labelledby="consultation-title">
          <SidePanelLayout sx={{ margin: 0, padding: 0 }}>
            <Sheet>
              <Typography level="h2" mb={5} id="consultation-title">
                Beratung
              </Typography>
              <GeneralSection />
            </Sheet>
            <SidePanelSheet>
              <Typography level="h3" mb={3}>
                Zusatzinfos
              </Typography>

              <TextareaField
                name="general.notes"
                label="Allgemeine Bemerkungen"
                minRows={5}
              />
            </SidePanelSheet>
          </SidePanelLayout>
          <StickyBottomBar />
        </FormPlus>
      )}
    </Formik>
  );
}
