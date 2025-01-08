/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiStiProtectionProcedure } from "@eshg/employee-portal-api/stiProtection";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { HorizontalField } from "@eshg/lib-portal/components/formFields/HorizontalField";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Divider, Sheet, Typography, styled } from "@mui/joy";
import { Formik } from "formik";

import { useUpsertConsultation } from "@/lib/businessModules/stiProtection/api/mutations/consultation";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { StickyBottomButtonBar } from "@/lib/shared/components/buttons/StickyBottomButtonBar";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

import { GeneralSection } from "./GeneralSection";
import { PregnancySection } from "./PregnancySection";
import {
  ApiGetConsultation200Response,
  ConsultationFormData,
  mapApiToForm,
  mapFormValuesToApi,
} from "./helpers";

export const AutoWidthHorizontalField = styled(HorizontalField)({
  ".MuiStack-root": {
    justifyContent: "space-between",
  },
});

export function ConsultationForm({
  procedure: stiProcedure,
}: Readonly<{
  procedure: ApiStiProtectionProcedure;
  consultation?: ApiGetConsultation200Response | null;
}>) {
  const consultation = undefined;
  const snackbar = useSnackbar();
  const upsertConsultation = useUpsertConsultation({
    onSuccess: () => {
      snackbar.confirmation("Die Anamnese wurde erfolgreich erstellt.");
    },
    onError: () => {
      snackbar.error("Die Anamnese konnte nicht erstellt werden.");
    },
  });

  function onSubmit(values: ConsultationFormData) {
    return upsertConsultation.mutateAsync({
      id: stiProcedure.id,
      consultation: mapFormValuesToApi(values),
    });
  }
  return (
    <Formik initialValues={mapApiToForm(consultation)} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <FormPlus>
          <FormWithSidecarLayout>
            <Sheet>
              <Typography level="h2" mb={5}>
                Konsultation
              </Typography>

              <GeneralSection />

              <Divider sx={(theme) => ({ my: theme.spacing(5) })} />

              <PregnancySection />
            </Sheet>
            <Sheet
              sx={{
                position: "sticky",
                alignSelf: "start",
                top: "12rem",
                width: "100%",
              }}
            >
              <Typography level="h3" mb={5}>
                Zusatzinfos
              </Typography>
              <TextareaField
                name="general.notes"
                label="Allgemeine Bemerkungen"
              />
            </Sheet>
          </FormWithSidecarLayout>
          <ConsultationStickyBottomButtonBar
            stiProcedure={stiProcedure}
            isSubmitting={isSubmitting}
          />
        </FormPlus>
      )}
    </Formik>
  );
}

const FormWithSidecarLayout = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "9fr 3fr",
  gap: theme.spacing(3),
  margin: theme.spacing(3),
  [theme.breakpoints.down("lg")]: {
    display: "flex",
    flexDirection: "column",
  },
}));

interface ConsultationStickyBottomButtonBarProps {
  stiProcedure: ApiStiProtectionProcedure;
  isSubmitting: boolean;
}

function ConsultationStickyBottomButtonBar(
  props: ConsultationStickyBottomButtonBarProps,
) {
  const { stiProcedure, isSubmitting } = props;

  return (
    <StickyBottomButtonBar
      sx={{ padding: "0.75rem 1.5rem" }}
      right={
        <>
          <InternalLinkButton
            href={routes.procedures.byId(stiProcedure.id).details}
            variant="plain"
          >
            Abbrechen
          </InternalLinkButton>
          <SubmitButton submitting={isSubmitting}>Speichern</SubmitButton>
        </>
      }
    ></StickyBottomButtonBar>
  );
}
