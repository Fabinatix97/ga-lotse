/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, DialogTitle, Stack, Typography } from "@mui/joy";
import { Formik, FormikProps, FormikValues } from "formik";
import {
  ComponentType,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { isDefined, isNonNullish } from "remeda";

import {
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import {
  ConfirmationDialogOptions,
  SubmitButton,
  createFieldNameMapper,
  useAlert,
} from "@eshg/lib-portal";

import { SidebarStep, SidebarStepContentProps } from "./sidebarStep";

interface SidebarStepperProps<
  TStepperFormModel extends FormikValues[],
> extends SidebarWithFormRefProps {
  steps: {
    [K in keyof TStepperFormModel]: SidebarStep<
      TStepperFormModel[K],
      TStepperFormModel
    >;
  };
  onSubmit: (formModel: TStepperFormModel) => Promise<void>;
  saveLabel?: string;
  confirmationDialog?: Omit<ConfirmationDialogOptions, "onConfirm">;
}

export function createStepContent<
  TStepFormModel extends FormikValues,
  TComponentProps extends SidebarStepContentProps<TStepFormModel>,
>({
  component,
  componentProps,
}: {
  component: ComponentType<TComponentProps>;
  componentProps?: Omit<TComponentProps, "values" | "fieldName">;
}): (values: TStepFormModel) => ReactElement {
  function stepContent(values: TStepFormModel) {
    const Component = component;
    const fieldName = createFieldNameMapper<TStepFormModel>();
    const props = {
      ...componentProps,
      values,
      fieldName,
    } as TComponentProps;
    return <Component {...props} />;
  }
  return stepContent;
}

export function SidebarStepper<TStepperFormModel extends FormikValues[]>({
  onClose,
  saveLabel = "Speichern",
  steps,
  onSubmit,
  confirmationDialog,
  formRef,
}: SidebarStepperProps<TStepperFormModel>) {
  interface StepperState {
    values: (FormikValues | undefined)[];
    stepIndex: number;
  }

  const { openConfirmationDialog } = useConfirmationDialog();
  const totalNumberOfSteps = Object.keys(steps).length;
  const [stepperState, setStepperState] = useState<StepperState>({
    values: Array.from({ length: totalNumberOfSteps }),
    stepIndex: 0,
  });
  const alert = useAlert();
  const formikRef = useRef<FormikProps<FormikValues>>(null);

  const currentStep = steps[stepperState.stepIndex]!;
  const currentStepProps = currentStep(
    stepperState.values as TStepperFormModel,
  );

  function changeCurrentStepInStepperValues(values: FormikValues | undefined) {
    return stepperState.values.map((prevStepperValues, index) => {
      return stepperState.stepIndex === index ? values : prevStepperValues;
    });
  }

  const isDisabledPreviousStep = stepperState.stepIndex <= 0;

  function onPreviousStep() {
    if (isDisabledPreviousStep) {
      return;
    }
    setStepperState((prevState) => ({
      values: changeCurrentStepInStepperValues(undefined),
      stepIndex: prevState.stepIndex - 1,
    }));
    //Close the alert after unsuccessful API call.
    if (isNonNullish(formRef) && "current" in formRef) {
      formRef.current?.resetErrors();
    }
  }

  //This is to make sure the form is considered dirty if stepIndex > 0, so we get a cancellation modal on close
  useEffect(() => {
    if (isNonNullish(formikRef.current) && stepperState.stepIndex > 0) {
      void formikRef.current.setFieldValue(
        "isNotFirstSidebar",
        Math.random(),
        false,
      );
    }
  }, [formikRef, stepperState.stepIndex]);

  const isLastStep = stepperState.stepIndex + 1 === totalNumberOfSteps;

  return (
    <Formik
      key={stepperState.stepIndex}
      initialValues={
        stepperState.values[stepperState.stepIndex] ??
        currentStepProps.initialValues
      }
      innerRef={formikRef}
      validate={(model) => {
        const errors = currentStepProps.validator?.(model);
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
      onSubmit={async (values) => {
        const nextStepperValues = changeCurrentStepInStepperValues(values);

        if (isLastStep) {
          await onSubmit(nextStepperValues as TStepperFormModel);
        }

        setStepperState((prevState) => ({
          values: nextStepperValues,
          stepIndex: prevState.stepIndex + 1,
        }));
      }}
    >
      {({ isSubmitting, values, handleSubmit, isValid }) => {
        return (
          <SidebarForm ref={formRef}>
            <SidebarContent
              header={
                <Stack gap={0.5}>
                  <DialogTitle
                    sx={{ color: "text.primary" }}
                    level="h2"
                    component="h1"
                  >
                    {currentStepProps.title}
                  </DialogTitle>
                  {totalNumberOfSteps > 1 && (
                    <Typography level="title-md" textColor="text.secondary">
                      Schritt {stepperState.stepIndex + 1} von{" "}
                      {totalNumberOfSteps}
                    </Typography>
                  )}
                </Stack>
              }
            >
              {currentStepProps.content(values)}
            </SidebarContent>
            <SidebarActions>
              <Stack direction="row" justifyContent="space-between">
                <Stack direction="row">
                  <Button variant="plain" onClick={() => onClose()}>
                    Abbrechen
                  </Button>
                </Stack>
                <Stack direction="row">
                  {totalNumberOfSteps > 1 && (
                    <Button
                      variant="soft"
                      color="neutral"
                      sx={{ marginRight: 2 }}
                      disabled={isDisabledPreviousStep || isSubmitting}
                      onClick={onPreviousStep}
                    >
                      Zurück
                    </Button>
                  )}
                  {isLastStep && isDefined(confirmationDialog) ? (
                    <Button
                      loading={isSubmitting}
                      onClick={() => {
                        if (isValid) {
                          openConfirmationDialog({
                            ...confirmationDialog,
                            onConfirm: handleSubmit,
                          });
                        }
                      }}
                    >
                      {saveLabel}
                    </Button>
                  ) : (
                    <SubmitButton submitting={isSubmitting}>
                      {isLastStep ? saveLabel : "Weiter"}
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
