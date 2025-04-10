/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMultiStepForm } from "@eshg/lib-portal/components/form/MultiStepForm";
import { ApiAppointmentType, ApiTravelType } from "@eshg/travel-medicine-api";
import { FormikErrors, FormikTouched, useFormikContext } from "formik";
import { useRouter } from "next/navigation";
import { isEmpty } from "remeda";

import { AppointmentFormStep } from "@/lib/businessModules/travelMedicine/components/appointment/AppointmentStepper";
import { InitialAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/appointment/types";
import { MultiStepFormButtonBar } from "@/lib/businessModules/travelMedicine/components/shared/components/multiStepForm/MultiStepFormButtonsBar";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";

export function AppointmentFormButtonBar() {
  const { currentStep, totalSteps, goForward, goBack, setStep } =
    useMultiStepForm();
  const { values, setTouched, validateForm, touched } =
    useFormikContext<InitialAppointmentFormValues>();

  const { t } = useTranslation(["travelMedicine/forms"]);
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();

  function handleCancel() {
    router.push(citizenRoutes.overview);
  }

  async function handleValidation(doNext: () => void | Promise<void>) {
    // We want to show errors before moving to the next step
    //  By default, Formik only does this on submit;
    //  Formik also won't show errors if the field is not touched,
    //  some fields don't ever set themselves as touched.
    //  To show all errors we need to trigger validation manually
    //  then set all fields with errors as touched

    const errors = await validateForm();

    await setTouched({
      ...touched,
      ...toTouchedDeep(errors),
    });

    if (isEmpty(errors)) {
      await doNext();
    }
  }

  async function handleNextStep() {
    await setTouched({});
    switch (currentStep) {
      case AppointmentFormStep.AppointmentSlotStep: {
        if (
          values.initialStepAppointmentType === ApiAppointmentType.Vaccination
        ) {
          setStep(AppointmentFormStep.PersonalDataStep);
        } else goForward();
        break;
      }
      case AppointmentFormStep.TravelTypeStep: {
        if (values.travelInformation.travelType === ApiTravelType.NoTravel) {
          setStep(AppointmentFormStep.PersonalDataStep);
        } else goForward();
        break;
      }
      default: {
        goForward();
        break;
      }
    }
  }

  function handlePrevStep() {
    if (currentStep === AppointmentFormStep.PersonalDataStep) {
      if (
        values.travelInformation.travelType === ApiTravelType.NoTravel &&
        values.initialStepAppointmentType === ApiAppointmentType.Consultation
      ) {
        setStep(AppointmentFormStep.TravelTypeStep);
      } else if (
        values.initialStepAppointmentType === ApiAppointmentType.Vaccination
      ) {
        setStep(AppointmentFormStep.AppointmentSlotStep);
      } else goBack();
    } else goBack();
  }

  return (
    <MultiStepFormButtonBar
      onNextStep={{
        title:
          currentStep === totalSteps
            ? t("confirmationSection.submit")
            : t("appointmentOverviewSection.onNextStep"),
        action: () => handleValidation(handleNextStep),
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

// Turn FormikErrors into FormikTouched
function toTouchedDeep<T extends object>(
  errors: FormikErrors<T>,
): FormikTouched<T> {
  return Object.entries(errors).reduce(
    (acc, [key, value]) => {
      if (!!value && typeof value === "object") {
        acc[key as keyof T] = toTouchedDeep(value);
      } else {
        acc[key as keyof T] = true;
      }
      return acc;
    },
    {} as { [key in keyof T]: boolean | object },
  ) as FormikTouched<T>;
}
