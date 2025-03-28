/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { Button, Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

import { useCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { useStepContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/StepContext";
import { useTranslation } from "@/lib/i18n/client";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

import { FormDataWithoutConcern } from "./AnamnesisStepper.config";
import { setAnamnesisForm } from "./anamnesis.storage";

interface StepButtonsProps {
  submitButton?: {
    label?: string;
    disabled?: boolean;
  };
}

export function StepButtons({ submitButton }: StepButtonsProps) {
  const { t } = useTranslation();
  const accessCode = useAccessCodeParam();
  const { isSubmitting } = useFormikContext<FormDataWithoutConcern>();
  const { goBack, goForward, isFirstStep, isLastStep } = useStepContext();
  const { openCancelDialog } = useConfirmationDialog();
  const router = useRouter();
  const routes = useCitizenRoutes();
  const disabled = useIsFormDisabled();

  const { label: submitLabel = "", disabled: submitDisabled = false } =
    submitButton ?? {
      label: t("stiProtection/forms:anamnesis.submit"),
      disabled: false,
    };
  const landingPageRoute = routes.appointments.index(accessCode);

  function onCancel(_e: MouseEvent) {
    openCancelDialog({
      onConfirm: () => {
        router.push(landingPageRoute);
        setAnamnesisForm();
      },
      title: t("stiProtection/anamnesis:cancel_dialog.title"),
      children: t("stiProtection/anamnesis:cancel_dialog.message"),
      cancelLabel: t("stiProtection/anamnesis:cancel_dialog.cancel"),
      confirmLabel: t("stiProtection/anamnesis:cancel_dialog.confirm"),
    });
  }

  return (
    <Stack gap={2} marginTop={2}>
      {!isLastStep ? (
        <Button
          type={isLastStep ? "submit" : "button"}
          onClick={() => goForward()}
          disabled={submitDisabled || disabled}
        >
          {t("common.continue")}
        </Button>
      ) : (
        <SubmitButton
          submitting={isSubmitting}
          disabled={submitDisabled || disabled}
        >
          {submitLabel}
        </SubmitButton>
      )}
      {!isFirstStep && (
        <Button variant="outlined" onClick={() => goBack()}>
          {t("common.back")}
        </Button>
      )}
      <Button variant="soft" onClick={onCancel}>
        {t("common.cancel")}
      </Button>
    </Stack>
  );
}
