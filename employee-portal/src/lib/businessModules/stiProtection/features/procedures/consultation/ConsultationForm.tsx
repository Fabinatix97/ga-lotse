/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Sheet, Typography } from "@mui/joy";
import { Formik } from "formik";

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import {
  ApiConsultation,
  ApiStiProtectionProcedure,
  ApiTextTemplateContext,
} from "@eshg/sti-protection-api";

import {
  useUpsertConsultation,
  useUpsertConsultationOptions,
} from "@/lib/businessModules/stiProtection/api/mutations/consultation";
import { TextareaFieldWithTextTemplates } from "@/lib/businessModules/stiProtection/components/textTemplates/TextareaFieldWithTextTemplates";
import {
  SidecarFormLayout,
  SidecarSheet,
} from "@/lib/businessModules/stiProtection/features/procedures/SidecarFormLayout";
import { TabStickyBottomButtonBar } from "@/lib/businessModules/stiProtection/features/procedures/TabStickyBottomButtonBar";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";

import { GeneralSection } from "./GeneralSection";
import { PregnancySection } from "./PregnancySection";
import {
  ConsultationFormData,
  mapApiToForm,
  mapFormValuesToApi,
} from "./helpers";

export function ConsultationForm({
  procedure,
  consultation,
}: Readonly<{
  procedure: ApiStiProtectionProcedure;
  consultation: ApiConsultation;
}>) {
  const { id: procedureId } = procedure;
  const upsertConsultationOptions = useUpsertConsultationOptions({
    procedureId,
  });
  const upsertConsultation = useUpsertConsultation({ procedureId });

  function onSubmit(values: ConsultationFormData) {
    const consultation = mapFormValuesToApi(values);
    return upsertConsultation.mutateAsync({ consultation });
  }

  return (
    <Formik
      initialValues={mapApiToForm(consultation)}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values }) => (
        <FormPlus>
          <ConfirmLeaveDirtyFormEffect
            onSaveMutation={{
              mutationOptions: upsertConsultationOptions,
              variableSupplier: () => ({
                procedureId,
                consultation: mapFormValuesToApi(values),
              }),
            }}
          />

          <SidecarFormLayout>
            <Sheet>
              <Typography level="h2" mb={5}>
                Konsultation
              </Typography>

              <GeneralSection />

              <PregnancySection />
            </Sheet>
            <SidecarSheet>
              <Typography level="h3" mb={3}>
                Zusatzinfos
              </Typography>
              <TextareaFieldWithTextTemplates
                name="general.notes"
                label="Allgemeine Bemerkungen"
                context={ApiTextTemplateContext.ConsultationRemark}
                minRows={5}
              />
            </SidecarSheet>
          </SidecarFormLayout>
          <TabStickyBottomButtonBar />
        </FormPlus>
      )}
    </Formik>
  );
}
