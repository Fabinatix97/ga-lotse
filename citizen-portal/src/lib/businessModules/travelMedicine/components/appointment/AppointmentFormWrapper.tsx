/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";
import { useRouter } from "next/navigation";

import { usePostCitizenVaccinationConsultation } from "@/lib/businessModules/travelMedicine/api/mutations/citizenPublicApi";
import { AppointmentFormContent } from "@/lib/businessModules/travelMedicine/components/appointment/AppointmentFormContent";
import { initialValues } from "@/lib/businessModules/travelMedicine/components/appointment/appointmentFormValuesFactory";
import { InitialAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/appointment/types";
import { MultiStepFormWrapper } from "@/lib/businessModules/travelMedicine/components/shared/components/multiStepForm/MultiStepFormWrapper";
import { useStepContext } from "@/lib/businessModules/travelMedicine/components/shared/contexts/StepContext";
import { mapToApiPostCitizenVaccinationConsultationRequest } from "@/lib/businessModules/travelMedicine/helpers/appointmentFormHelper";
import { useCitizenRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useTranslation } from "@/lib/i18n/client";

export function AppointmentFormWrapper() {
  const postCitizenVaccinationConsultation =
    usePostCitizenVaccinationConsultation();

  const { t } = useTranslation(["travelMedicine/forms"]);

  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();

  const { currentStepIndex, totalSteps } = useStepContext();

  async function handleSubmit(values: FormikValues, resetForm: () => void) {
    const request = mapToApiPostCitizenVaccinationConsultationRequest(
      values as InitialAppointmentFormValues,
    );
    await postCitizenVaccinationConsultation.mutateAsync(request, {
      onSuccess: () => {
        resetForm();
        // change when successPage is present
        router.push(citizenRoutes.overview);
      },
    });
  }

  return (
    <MultiStepFormWrapper
      stepperTitle={t("common.stepperTitle", {
        currentStepIndex: currentStepIndex + 1,
        totalSteps: totalSteps,
      })}
      title={t("common.title")}
      initialValues={initialValues}
      onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
    >
      <AppointmentFormContent />
    </MultiStepFormWrapper>
  );
}
