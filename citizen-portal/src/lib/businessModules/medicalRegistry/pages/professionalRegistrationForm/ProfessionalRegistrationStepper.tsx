/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import { FormikProps, useFormikContext } from "formik";

import {
  FormPlus,
  MultiStepForm,
  OptionalFieldValue,
  StepFactory,
} from "@eshg/lib-portal";
import { MedicalRegistryCreateProcedureFormValues } from "@eshg/lib-portal/businessModules/medicalRegistry/medicalRegistryCreateProcedureFormValues";
import { shouldEnable } from "@eshg/lib-portal/businessModules/medicalRegistry/sections";
import { ApiTypeOfChange } from "@eshg/medical-registry-api";

import { ConfirmLeaveDirtyFormEffect } from "@/lib/baseModule/components/ConfirmLeaveDirtyFormEffect";
import { theme } from "@/lib/baseModule/theme/theme";
import { ProfessionalRegistrationSidePanel } from "@/lib/businessModules/medicalRegistry/pages/professionalRegistrationForm/ProfessionalRegistrationSidePanel";
import { ProfessionalRegistrationFormStepFour } from "@/lib/businessModules/medicalRegistry/pages/professionalRegistrationForm/steps/ProfessionalRegistrationFormStepFour";
import { ProfessionalRegistrationFormStepThree } from "@/lib/businessModules/medicalRegistry/pages/professionalRegistrationForm/steps/ProfessionalRegistrationFormStepThree";
import { useTranslation } from "@/lib/i18n/client";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageTitle } from "@/lib/shared/components/layout/page";

import { ProfessionalRegistrationFormStepOne } from "./steps/ProfessionalRegistrationFormStepOne";
import { ProfessionalRegistrationFormStepTwo } from "./steps/ProfessionalRegistrationFormStepTwo";

interface ProfessionalRegistrationStepperProps {
  formikProps: FormikProps<MedicalRegistryCreateProcedureFormValues>;
}

export function ProfessionalRegistrationStepper(
  props: ProfessionalRegistrationStepperProps,
) {
  const values = useFormikContext()
    .values as MedicalRegistryCreateProcedureFormValues;
  const changeType = values.generalInformationForm.changeType;

  const { t } = useTranslation([
    "medicalRegistry/professionalRegistrationForm",
  ]);

  return (
    <MultiStepForm<MedicalRegistryCreateProcedureFormValues>
      steps={steps(changeType)}
    >
      {({ Outlet, currentStep, totalSteps, titleRef }) => (
        <>
          <ConfirmLeaveDirtyFormEffect
            description={t("leave_form.message")}
            cancelLabel={t("leave_form.cancel")}
            confirmLabel={t("leave_form.confirm")}
          />
          <PageTitle
            titleRef={titleRef}
            toolbar={
              <StepIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
              />
            }
          >
            {t("navigation.pageTitle")}
          </PageTitle>
          <FormPlus>
            <TwoColumnGrid
              content={<Outlet {...props.formikProps} />}
              sidePanel={<ProfessionalRegistrationSidePanel />}
            />
          </FormPlus>
        </>
      )}
    </MultiStepForm>
  );
}

function steps(changeType: OptionalFieldValue<ApiTypeOfChange>) {
  const steps: StepFactory<MedicalRegistryCreateProcedureFormValues>[] = [
    ProfessionalRegistrationFormStepOne,
  ];

  if (shouldEnable("profession", changeType)) {
    steps.push(ProfessionalRegistrationFormStepTwo);
  }

  if (
    shouldEnable("practice", changeType) ||
    shouldEnable("employees", changeType)
  ) {
    steps.push(ProfessionalRegistrationFormStepThree);
  }

  steps.push(ProfessionalRegistrationFormStepFour);

  return steps;
}

function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const { t } = useTranslation([
    "medicalRegistry/professionalRegistrationForm",
  ]);
  return (
    <Typography
      component="span"
      data-testid="multiStepFormIndicator"
      level="h4"
      sx={{
        color: theme.palette.text.tertiary,
      }}
    >
      {t("navigation.step")}{" "}
      <span data-testid="currentFormStep">{currentStep}</span>{" "}
      {t("navigation.stepsRemaining")} {totalSteps}
    </Typography>
  );
}
