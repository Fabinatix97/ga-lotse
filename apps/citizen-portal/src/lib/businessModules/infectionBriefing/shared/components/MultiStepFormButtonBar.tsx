/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { isEmpty } from "remeda";

import { useMultiStepForm } from "@eshg/lib-portal";

import { AppointmentFormData } from "@/lib/businessModules/infectionBriefing/components/appointment/AppointmentStepper";

interface MultiStepFormButtonBarProps<Values> {
  submitLabel?: string;
  submitDisabled?: boolean;
  cancelLabel: string;
  forwardLabel: string;
  backLabel: string;
  backendValidation?: (values: Values) => Promise<boolean>;
}

export function MultiStepFormButtonBar<Values>({
  cancelLabel,
  forwardLabel,
  backLabel,
  backendValidation = () => Promise.resolve(true),
}: Readonly<MultiStepFormButtonBarProps<Values>>) {
  const { currentStep, totalSteps, goForward, goBack } = useMultiStepForm();
  const { setFieldValue } = useFormikContext<AppointmentFormData>();

  const { validateForm, setTouched, touched, values, setSubmitting } =
    useFormikContext<Values>();

  async function handleValidation(handleFunction: () => void) {
    setSubmitting(true);
    const errors = await validateForm();
    await setTouched({ ...touched, ...errors });
    try {
      const backendValidationSuccess = await backendValidation(values);

      if (isEmpty(errors) && backendValidationSuccess) {
        handleFunction();
      }
    } catch (error) {
      setSubmitting(false);
      throw new Error(String(error));
    }
    setSubmitting(false);
  }

  return (
    <Stack gap={2}>
      {currentStep < totalSteps && (
        <Button onClick={() => handleValidation(goForward)}>
          {forwardLabel}
        </Button>
      )}
      {currentStep > 1 && (
        <Button variant="outlined" onClick={goBack}>
          {backLabel}
        </Button>
      )}
      <Button
        color="neutral"
        variant="soft"
        onClick={() => void setFieldValue("isCancelModalOpen", true)}
      >
        {cancelLabel}
      </Button>
    </Stack>
  );
}
