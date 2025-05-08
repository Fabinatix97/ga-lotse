/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Sheet, Stack, Typography } from "@mui/joy";

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { ApiConcern } from "@eshg/sti-protection-api";

import { useFormData } from "@/lib/businessModules/stiProtection/components/appointment/AppointmentDataContext";
import { useStepContext } from "@/lib/businessModules/stiProtection/components/shared/TravelMedicineStepContext";
import { useTranslation } from "@/lib/i18n/client";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageTitle } from "@/lib/shared/components/layout/page";

import { StepButtons } from "./AnamnesisStepButtons";
import { AnamnesisFormData } from "./AnamnesisStepper.config";

export function AnamnesisStepLayout({ children }: RequiresChildren) {
  const { t } = useTranslation(["stiProtection/forms"]);
  const { isLastStep } = useStepContext();

  return (
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
  );
}

export function AnamnesisTitle() {
  const { t } = useTranslation(["stiProtection/anamnesis"]);
  const [{ concern }] = useFormData<AnamnesisFormData>();
  const { currentStepIndex: currentStep, totalSteps } = useStepContext();

  return (
    <PageTitle
      toolbar={
        <Typography
          level="h4"
          sx={{ alignContent: "center", whiteSpace: "nowrap" }}
          textColor="text.tertiary"
        >
          {t("stiProtection/forms:common.current_step", {
            currentStep,
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
