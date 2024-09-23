/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTravelType } from "@eshg/citizen-portal-api/travelMedicine";
import { useFormikContext } from "formik";
import { useRouter } from "next/navigation";

import { StepKey } from "@/lib/businessModules/travelMedicine/components/appointment/AppointmentStepper";
import { InitialAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/appointment/types";
import { MultiStepFormButtonBar } from "@/lib/businessModules/travelMedicine/components/shared/components/multiStepForm/MultiStepFormButtonsBar";
import { useStepContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/StepContext";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";

export function AppointmentFormButtonBar() {
  const { steps, currentStepIndex, totalSteps, isLastStep, onStepChange } =
    useStepContext();
  const { values, validateForm, setTouched, setFieldTouched, setErrors } =
    useFormikContext<InitialAppointmentFormValues>();

  const { t } = useTranslation(["travelMedicine/forms"]);
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();

  function isAppointmentPickerInValid() {
    let isInvalid = false;
    if (steps[currentStepIndex]!.key === StepKey.AppointmentSlotStep) {
      isInvalid = !values.appointmentBlockDate;
    }
    return isInvalid;
  }

  function handleCancel() {
    router.push(citizenRoutes.overview);
  }

  async function handleValidation() {
    Object.entries(values).forEach(([key, value]: [string, unknown]) => {
      if (typeof value === "object" && !!value) {
        Object.keys(value).forEach(
          (it) => void setFieldTouched(`${key}.${it}`, true),
        );
      } else {
        void setFieldTouched(key, true);
      }
    });

    const fieldErrors = await validateForm();

    // AppointmentDatePicker needs to be validated manually because it is no formik field
    if (isAppointmentPickerInValid()) {
      fieldErrors.appointmentBlockDate = t(
        "appointmentSlotFormContent.fields.appointmentStart_required",
      );
      setErrors(fieldErrors);
    }

    return fieldErrors && Object.keys(fieldErrors).length > 0
      ? fieldErrors
      : null;
  }

  async function handleNextStep() {
    const errors = await handleValidation();
    if (!errors) {
      if (
        steps[currentStepIndex]!.key === StepKey.TravelTypeStep &&
        values.travelInformation.travelType === ApiTravelType.NoTravel
      ) {
        if (currentStepIndex < totalSteps) {
          onStepChange(currentStepIndex + 2);
          await setTouched({});
        }
      } else if (currentStepIndex < totalSteps) {
        onStepChange(currentStepIndex + 1);
        await setTouched({});
      }
    }
  }

  function handlePrevStep() {
    if (
      steps[currentStepIndex]!.key === StepKey.PersonalDataStep &&
      values.travelInformation.travelType === ApiTravelType.NoTravel
    ) {
      if (currentStepIndex > 0) onStepChange(currentStepIndex - 2);
    } else if (currentStepIndex > 0) onStepChange(currentStepIndex - 1);
  }

  return (
    <MultiStepFormButtonBar
      onNextStep={{
        title: isLastStep
          ? t("confirmationSection.submit")
          : t("appointmentOverviewSection.onNextStep"),
        action: handleNextStep,
      }}
      onPrevStep={{
        title: t("appointmentOverviewSection.onPrevStep"),
        action: handlePrevStep,
      }}
      onCancel={{
        title: t("appointmentOverviewSection.onCancel"),
        action: handleCancel,
      }}
    />
  );
}
