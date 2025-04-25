/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";

import { useStepContext } from "@/lib/businessModules/stiProtection/components/shared/TravelMedicineStepContext";
import { useCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

import { FormDataWithoutConcern } from "./AnamnesisStepper.config";

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
  const landingPageRoute = routes.personalArea.index(accessCode);

  function onCancel(_e: MouseEvent) {
    openCancelDialog({
      onConfirm: () => {
        router.push(landingPageRoute);
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
        <Button type="button" onClick={() => goForward()}>
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
