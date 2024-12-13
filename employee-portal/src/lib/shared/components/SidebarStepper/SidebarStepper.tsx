/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { useAlert } from "@eshg/lib-portal/errorHandling/AlertContext";
import { Button, DialogTitle, Stack, Typography } from "@mui/joy";
import { Formik, FormikErrors, FormikValues } from "formik";
import { useState } from "react";
import { isBoolean } from "remeda";

import { SidebarWithFormRefProps } from "@/lib/shared//hooks/useSidebarWithFormRef";
import { SidebarStep } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export interface SidebarStepperProps<T> extends SidebarWithFormRefProps {
  onSubmit: (result: T) => Promise<void>;
  initialValues: T;
  steps: SidebarStep<T>[];
  saveLabel?: string;
}

export function SidebarStepper<T extends FormikValues>({
  onClose,
  onSubmit,
  initialValues,
  steps,
  saveLabel = "Speichern",
  formRef,
}: SidebarStepperProps<T>) {
  const [stepIndex, setStepIndex] = useState(0);
  const alert = useAlert();

  const currentStep = steps[stepIndex]!;

  function stepProps(values: T) {
    switch (currentStep.type) {
      case "StandardStep":
        return currentStep.step;
      case "BranchingStep":
        return currentStep.branch(values);
    }
  }

  const isDisabledPreviousStep = stepIndex <= 0;

  function onNextStep(
    validateForm: () => Promise<FormikErrors<T>>,
    values: T,
    setFieldTouched: (
      field: string,
      isTouched?: boolean,
      shouldValidate?: boolean,
    ) => Promise<void | FormikErrors<T>>,
  ) {
    // Touch fields such that the validation is shown
    Object.entries(values)
      .filter(([, value]) => value !== null)
      .forEach(([key, value]) => {
        if (typeof value === "object") {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          Object.keys(value).forEach(
            (it) => void setFieldTouched(`${key}.${it}`, true, false),
          );
        } else {
          void setFieldTouched(key, true, false);
        }
      });

    void validateForm().then((errors) => {
      const stepErrors = stepProps(values).validator?.(values);
      if (
        Object.values(errors).length > 0 ||
        (stepErrors && Object.values(stepErrors).length > 0)
      ) {
        return;
      }

      setStepIndex(stepIndex + 1);
      alert.close();
    });
  }

  function onPreviousStep() {
    if (isDisabledPreviousStep) {
      return;
    }
    setStepIndex(stepIndex - 1);
    alert.close();
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={(model) => {
        const errors = stepProps(model).validator?.(model);
        if (errors === undefined) {
          alert.close();
        } else {
          const possibleErrors = Object.values(errors).filter(
            (it) => typeof it === "string",
          );
          if (possibleErrors.length > 0) {
            alert.error({
              message: possibleErrors[0],
            });
          }
        }
        return errors;
      }}
    >
      {({
        validateForm,
        isSubmitting,
        handleSubmit,
        values,
        setFieldTouched,
      }) => {
        const currentStepProps = stepProps(values);
        const continueOrSubmitIsDisabled =
          currentStepProps.disableContinue !== undefined &&
          (isBoolean(currentStepProps.disableContinue)
            ? currentStepProps.disableContinue
            : currentStepProps.disableContinue(values));

        const isDisabledNextStep =
          stepIndex >= steps.length - 1 || continueOrSubmitIsDisabled;
        return (
          <SidebarForm ref={formRef}>
            <SidebarContent
              header={
                <Stack gap={0.5}>
                  <DialogTitle
                    sx={{ color: "text.primary" }}
                    level="h3"
                    component="h1"
                  >
                    {currentStepProps.title}
                  </DialogTitle>
                  {steps.length > 1 && (
                    <Typography level="title-md" textColor="text.secondary">
                      Schritt {stepIndex + 1} von {steps.length}
                    </Typography>
                  )}
                </Stack>
              }
            >
              {currentStepProps.content}
            </SidebarContent>
            <SidebarActions>
              <Stack direction="row" justifyContent="space-between">
                <Stack direction="row">
                  <Button variant="plain" onClick={() => onClose()}>
                    Abbrechen
                  </Button>
                </Stack>
                <Stack direction="row">
                  {steps.length > 1 && (
                    <Button
                      variant="soft"
                      color="neutral"
                      sx={{ marginRight: 2 }}
                      onClick={onPreviousStep}
                      disabled={isDisabledPreviousStep}
                    >
                      Zurück
                    </Button>
                  )}
                  {stepIndex + 1 < steps.length && (
                    <Button
                      onClick={() => {
                        onNextStep(validateForm, values, setFieldTouched);
                      }}
                      disabled={isDisabledNextStep}
                    >
                      Weiter
                    </Button>
                  )}
                  {stepIndex + 1 === steps.length && (
                    <SubmitButton
                      submitting={isSubmitting}
                      onClick={() => handleSubmit()}
                      disabled={continueOrSubmitIsDisabled}
                    >
                      {saveLabel}
                    </SubmitButton>
                  )}
                </Stack>
              </Stack>
            </SidebarActions>
          </SidebarForm>
        );
      }}
    </Formik>
  );
}
