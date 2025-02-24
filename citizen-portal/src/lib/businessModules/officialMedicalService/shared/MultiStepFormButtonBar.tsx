/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMultiStepForm } from "@eshg/lib-portal/components/form/MultiStepForm";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { Button, Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { isEmpty } from "remeda";

interface MultiStepFormButtonBarProps {
  href: string;
  submitLabel?: string;
  cancelLabel: string;
  forwardLabel: string;
  backLabel: string;
}

export function MultiStepFormButtonBar({
  href,
  submitLabel,
  cancelLabel,
  forwardLabel,
  backLabel,
}: Readonly<MultiStepFormButtonBarProps>) {
  const { currentStep, totalSteps, goForward, goBack } = useMultiStepForm();

  const { handleSubmit, validateForm, setTouched, touched } =
    useFormikContext();

  async function handleValidation(handleFunction: () => void) {
    const errors = await validateForm();
    await setTouched({ ...touched, ...errors });

    if (isEmpty(errors)) {
      handleFunction();
    }
  }

  return (
    <Stack gap={2}>
      {currentStep < totalSteps && (
        <Button onClick={() => handleValidation(goForward)}>
          {forwardLabel}
        </Button>
      )}
      {submitLabel && currentStep === totalSteps && (
        <Button onClick={() => handleValidation(handleSubmit)}>
          {submitLabel}
        </Button>
      )}
      {currentStep > 1 && (
        <Button variant="outlined" onClick={goBack}>
          {backLabel}
        </Button>
      )}
      <InternalLinkButton variant="soft" color="neutral" href={href}>
        {cancelLabel}
      </InternalLinkButton>
    </Stack>
  );
}
