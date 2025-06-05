/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack } from "@mui/joy";
import { MouseEvent } from "react";

import { InternalLinkButton } from "@eshg/lib-portal";
import { ApiConcern } from "@eshg/sti-protection-api";

import { useStepContext } from "@/lib/businessModules/stiProtection/components/shared/StepContext";
import { useCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";

import { useFormData } from "./AppointmentDataContext";
import type { AppointmentFormData } from "./AppointmentStepper";

export interface StepButtonsProps {
  submit?: string;
}
export function StepButtons({ submit }: StepButtonsProps) {
  const { t } = useTranslation();
  const { goBack, isLastStep, isFirstStep } = useStepContext();
  const [{ concern }] = useFormData<AppointmentFormData>();
  const routes = useCitizenRoutes();
  const landingPageRoute =
    routes[concern === ApiConcern.SexWork ? "sexWork" : "stiConsultation"]
      .index;

  function handleBack(_e: MouseEvent) {
    goBack();
  }

  return (
    <Stack gap={2} marginTop={2}>
      <Button type="submit">{submit ?? t("common.continue")}</Button>
      {!isLastStep ? (
        <>
          {!isFirstStep ? (
            <Button variant="outlined" onClick={handleBack}>
              {t("common.back")}
            </Button>
          ) : null}
          <InternalLinkButton variant="soft" href={landingPageRoute}>
            {t("common.cancel")}
          </InternalLinkButton>
        </>
      ) : null}
    </Stack>
  );
}
