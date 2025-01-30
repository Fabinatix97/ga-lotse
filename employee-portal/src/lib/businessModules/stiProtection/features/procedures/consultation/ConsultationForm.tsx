/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiConsultation,
  ApiStiProtectionProcedure,
} from "@eshg/employee-portal-api/stiProtection";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Divider, Sheet, Typography } from "@mui/joy";
import { Formik } from "formik";

import { useUpsertConsultation } from "@/lib/businessModules/stiProtection/api/mutations/consultation";
import { TextTemplatesSidebarProvider } from "@/lib/businessModules/stiProtection/components/textTemplates/TextTemplatesSidebarProvider";
import { TextareaFieldWithTextTemplates } from "@/lib/businessModules/stiProtection/components/textTemplates/TextareaFieldWithTextTemplates";
import { ApiTextTemplateContext } from "@/lib/businessModules/stiProtection/components/textTemplates/constants";
import {
  SidecarFormLayout,
  SidecarSheet,
} from "@/lib/businessModules/stiProtection/features/procedures/SidecarFormLayout";
import { TabStickyBottomButtonBar } from "@/lib/businessModules/stiProtection/features/procedures/TabStickyBottomButtonBar";

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
  const snackbar = useSnackbar();
  const upsertConsultation = useUpsertConsultation(procedure.id, {
    onSuccess: () => {
      snackbar.confirmation("Die Konsultation wurde erfolgreich gespeichert.");
    },
    onError: () => {
      snackbar.error("Die Konsultation konnte nicht gespeichert werden.");
    },
  });

  function onSubmit(values: ConsultationFormData) {
    const consultation = mapFormValuesToApi(values);
    return upsertConsultation.mutateAsync(consultation);
  }

  return (
    <Formik initialValues={mapApiToForm(consultation)} onSubmit={onSubmit}>
      <FormPlus>
        <SidecarFormLayout>
          <Sheet>
            <Typography level="h2" mb={5}>
              Konsultation
            </Typography>

            <GeneralSection />

            <Divider sx={(theme) => ({ my: theme.spacing(5) })} />

            <PregnancySection />
          </Sheet>
          <SidecarSheet>
            <Typography level="h3" mb={3}>
              Zusatzinfos
            </Typography>
            <TextTemplatesSidebarProvider>
              <TextareaFieldWithTextTemplates
                name="general.notes"
                label="Allgemeine Bemerkungen"
                context={ApiTextTemplateContext.Consultation}
              />
            </TextTemplatesSidebarProvider>
          </SidecarSheet>
        </SidecarFormLayout>
        <TabStickyBottomButtonBar procedure={procedure} />
      </FormPlus>
    </Formik>
  );
}
