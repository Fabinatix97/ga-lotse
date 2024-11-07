/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiTravelType,
} from "@eshg/citizen-portal-api/travelMedicine";
import { useFormikContext } from "formik";
import { useRouter } from "next/navigation";

import { InitialAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/appointment/types";
import { MultiStepFormButtonBar } from "@/lib/businessModules/travelMedicine/components/shared/components/multiStepForm/MultiStepFormButtonsBar";
import { useStepContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/StepContext";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";

import { StepKey } from "./AppointmentStepper";

export function AppointmentFormButtonBar() {
  const { isLastStep, currentNode, goForward, goBack } = useStepContext();
  const { values, setTouched, validateForm, setFieldTouched, setErrors } =
    useFormikContext<InitialAppointmentFormValues>();

  const { t } = useTranslation(["travelMedicine/forms"]);
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();

  function isAppointmentPickerInValid() {
    let isInvalid = false;
    if (currentNode?.key === StepKey.AppointmentSlotStep) {
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
      await setTouched({});
      switch (currentNode?.key) {
        case StepKey.AppointmentSlotStep: {
          if (
            values.initialStepAppointmentType === ApiAppointmentType.Vaccination
          ) {
            goForward(3);
          } else goForward();
          break;
        }
        case StepKey.TravelTypeStep: {
          if (values.travelInformation.travelType === ApiTravelType.NoTravel) {
            goForward(2);
          } else goForward();
          break;
        }
        default: {
          goForward();
          break;
        }
      }
    }
  }

  function handlePrevStep() {
    if (currentNode?.key === StepKey.PersonalDataStep) {
      if (
        values.travelInformation.travelType === ApiTravelType.NoTravel &&
        values.initialStepAppointmentType === ApiAppointmentType.Consultation
      ) {
        goBack(2);
      } else if (
        values.initialStepAppointmentType === ApiAppointmentType.Vaccination
      ) {
        goBack(3);
      } else goBack();
    } else goBack();
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
