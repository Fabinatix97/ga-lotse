/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiConcern } from "@eshg/sti-protection-api";
import { Button, Stack } from "@mui/joy";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

import { useStepContext } from "@/lib/businessModules/stiProtection/components/shared/StepContext";
import { useCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

import { useFormData } from "./AppointmentDataContext";
import { AppointmentFormData } from "./AppointmentStepper";

export function StepButtons({ submit }: { submit: string | undefined }) {
  const { t } = useTranslation();
  const { goBack, isLastStep } = useStepContext();
  const [{ concern, procedureId }] = useFormData<AppointmentFormData>();
  const { openCancelDialog } = useConfirmationDialog();
  const router = useRouter();
  const routes = useCitizenRoutes();
  const landingPageRoute =
    routes[concern == ApiConcern.SexWork ? "sexWork" : "stiConsultation"].index;

  function onCancel(_e: MouseEvent) {
    if (!procedureId) {
      router.push(landingPageRoute);
      return;
    }
    openCancelDialog({
      onConfirm: () => {
        router.push(landingPageRoute);
      },
      title: t("stiProtection/forms:cancel_booking.title"),
      children: t("stiProtection/forms:cancel_booking.message"),
      cancelLabel: t("stiProtection/forms:cancel_booking.cancel"),
      confirmLabel: t("stiProtection/forms:cancel_booking.confirm"),
    });
  }

  return (
    <Stack gap={2} marginTop={2}>
      <Button type="submit">{submit ?? t("common.continue")}</Button>
      {!isLastStep ? (
        <>
          <Button variant="outlined" onClick={() => goBack()}>
            {t("common.back")}
          </Button>
          <Button variant="soft" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
        </>
      ) : null}
    </Stack>
  );
}
