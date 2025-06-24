/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { isEmpty } from "remeda";

import { InternalLinkButton, useMultiStepForm } from "@eshg/lib-portal";

interface MultiStepFormButtonBarProps<Values> {
  href: string;
  submitLabel?: string;
  cancelLabel: string;
  forwardLabel: string;
  backLabel: string;
  backendValidation?: (values: Values) => Promise<boolean>;
}

export function MultiStepFormButtonBar<Values>({
  href,
  submitLabel,
  cancelLabel,
  forwardLabel,
  backLabel,
  backendValidation = () => Promise.resolve(true),
}: Readonly<MultiStepFormButtonBarProps<Values>>) {
  const { currentStep, totalSteps, goForward, goBack } = useMultiStepForm();

  const { handleSubmit, validateForm, setTouched, touched, values } =
    useFormikContext<Values>();

  async function handleValidation(handleFunction: () => void) {
    const errors = await validateForm();
    await setTouched({ ...touched, ...errors });

    // run backend validation even if local validation failed
    //  to make it a bit easier for the user
    const backendValidationSuccess = await backendValidation(values);

    if (isEmpty(errors) && backendValidationSuccess) {
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
