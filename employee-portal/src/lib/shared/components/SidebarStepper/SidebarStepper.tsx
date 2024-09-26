/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { useAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import { Button, DialogTitle, Stack, Typography, ZIndex } from "@mui/joy";
import { Formik, FormikErrors, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import { isBoolean } from "remeda";

import { SidebarStep } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

export interface SidebarStepperProps<T> {
  onClose: () => void;
  open: boolean;
  onSubmit: (result: T) => Promise<void>;
  initialValues: T;
  zIndex?: keyof ZIndex;
  steps: SidebarStep<T>[];
  saveLabel?: string;
}

export function SidebarStepper<T extends FormikValues>({
  open,
  onClose,
  onSubmit,
  initialValues,
  zIndex,
  steps,
  saveLabel = "Speichern",
}: SidebarStepperProps<T>) {
  const [stepIndex, setStepIndex] = useState(0);
  const { sidebarFormRef, handleClose } = useSidebarForm({
    onClose: onClose,
  });
  const alertContext = useAlertContext();
  const formikRef = useRef<FormikProps<T>>(null);

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
            (it) => void setFieldTouched(`${key}.${it}`, true),
          );
        } else {
          void setFieldTouched(key, true);
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
      alertContext?.setAlert(null);
    });
  }

  function onPreviousStep() {
    if (isDisabledPreviousStep) {
      return;
    }
    setStepIndex(stepIndex - 1);
    alertContext?.setAlert(null);
  }

  useEffect(() => {
    if (open) {
      formikRef.current?.resetForm();
    }
  }, [open]);

  return (
    <Sidebar open={open} onClose={handleClose} zIndex={zIndex}>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={(model) => {
          const errors = stepProps(model).validator?.(model);
          if (errors === undefined) {
            alertContext?.setAlert(null);
          } else {
            const possibleErrors = Object.values(errors).filter(
              (it) => typeof it === "string",
            );
            if (possibleErrors.length > 0) {
              alertContext?.setAlert({
                title: "",
                message: possibleErrors[0],
                color: "danger",
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
            <SidebarForm ref={sidebarFormRef}>
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
                    <Button variant="plain" onClick={handleClose}>
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
                      <SubmitButton
                        submitting={false}
                        onClick={() => {
                          onNextStep(validateForm, values, setFieldTouched);
                        }}
                        disabled={isDisabledNextStep}
                      >
                        Weiter
                      </SubmitButton>
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
    </Sidebar>
  );
}
