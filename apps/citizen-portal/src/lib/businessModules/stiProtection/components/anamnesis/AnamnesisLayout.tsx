/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Sheet, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { PropsWithChildren } from "react";

import { FormPlus } from "@eshg/lib-portal";
import { ApiConcern } from "@eshg/sti-protection-api";

import { useUpsertMedicalHistory } from "@/lib/businessModules/stiProtection/api/mutations/citizenApi";
import { useGetProcedure } from "@/lib/businessModules/stiProtection/api/queries/citizenApi";
import { useFormData } from "@/lib/businessModules/stiProtection/components/appointment/AppointmentDataContext";
import { useStepContext } from "@/lib/businessModules/stiProtection/components/shared/StepContext";
import { useCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageTitle } from "@/lib/shared/components/layout/page";
import { useScopedRouter } from "@/lib/shared/components/scopedLinks";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

import { StepButtons } from "./AnamnesisStepButtons";
import {
  AnamnesisFormData,
  FormDataWithoutConcern,
  defaultAnamnesisFormValues,
} from "./AnamnesisStepper.config";
import { mapFormValuesToApi } from "./helpers";

export function AnamnesisTitle() {
  const { t } = useTranslation(["stiProtection/anamnesis"]);
  const [{ concern }] = useFormData<AnamnesisFormData>();
  const { currentStepIndex, totalSteps } = useStepContext();

  return (
    <PageTitle
      toolbar={
        <Typography
          level="h4"
          sx={{ alignContent: "center", whiteSpace: "nowrap" }}
          textColor="text.tertiary"
        >
          {t("stiProtection/forms:common.current_step", {
            currentStep: currentStepIndex + 1,
            totalSteps,
          })}
        </Typography>
      }
    >
      {t(
        `title.${concern === ApiConcern.SexWork ? "sex_work" : "hiv_sti_consultation"}`,
      )}
    </PageTitle>
  );
}

function AnamnesisOverview({
  submitDisabled = false,
  submitLabel,
}: {
  submitDisabled?: boolean;
  submitLabel?: string | undefined;
}) {
  return (
    <Sheet
      sx={(theme) => ({
        [theme.breakpoints.down("md")]: { display: "none" },
      })}
    >
      <Stack gap={3}>
        <StepButtons
          submitButton={{
            label: submitLabel,
            disabled: submitDisabled,
          }}
        />
      </Stack>
    </Sheet>
  );
}

const INITIAL_VALUES: FormDataWithoutConcern = defaultAnamnesisFormValues();

export function AnamnesisStepLayout({ children }: PropsWithChildren) {
  const {
    data: { concern },
  } = useGetProcedure();
  const router = useScopedRouter();
  const citizenRoutes = useCitizenRoutes();
  const accessCode = useAccessCodeParam();

  const [formData, updateFormData] = useFormData<AnamnesisFormData>();
  const { t } = useTranslation(["stiProtection/forms"]);
  const upsertMedicalHistory = useUpsertMedicalHistory();
  const { isLastStep, goForward } = useStepContext();

  async function handleSubmit(values: FormDataWithoutConcern) {
    if (!isLastStep) {
      updateFormData(values);
      goForward();
      return;
    }
    await upsertMedicalHistory.mutateAsync(
      mapFormValuesToApi({ concern, formValues: values }),
      {
        onSuccess: () => {
          router.push(citizenRoutes.personalArea.index(accessCode));
        },
      },
    );
  }
  return (
    <>
      <AnamnesisTitle />
      <Formik
        initialValues={{ ...INITIAL_VALUES, ...formData }}
        onSubmit={handleSubmit}
      >
        <FormPlus>
          <TwoColumnGrid
            content={
              <Sheet>
                <Stack gap={3}>
                  {children}
                  <Box
                    sx={(theme) => ({
                      [theme.breakpoints.up("md")]: {
                        display: "none",
                      },
                    })}
                  >
                    <StepButtons />
                  </Box>
                </Stack>
              </Sheet>
            }
            sidePanel={
              <AnamnesisOverview
                submitLabel={
                  !isLastStep ? t("common.continue") : t("anamnesis.submit")
                }
              />
            }
          />
        </FormPlus>
      </Formik>
    </>
  );
}
