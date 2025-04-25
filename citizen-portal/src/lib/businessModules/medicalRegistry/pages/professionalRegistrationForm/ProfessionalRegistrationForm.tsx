/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Formik } from "formik";

import { mapCreateProcedureRequest } from "@eshg/lib-portal/businessModules/medicalRegistry/api/mapper";
import {
  MedicalRegistryCreateProcedureFormValues,
  initialValues,
} from "@eshg/lib-portal/businessModules/medicalRegistry/medicalRegistryCreateProcedureFormValues";

import { useCreateProcedure } from "@/lib/businessModules/medicalRegistry/api/mutations/medicalRegistryEntries";
import { ProfessionalRegistrationStepper } from "@/lib/businessModules/medicalRegistry/pages/professionalRegistrationForm/ProfessionalRegistrationStepper";

export const requiredFieldMessageKey = "validations.requiredField";

interface ProfessionalRegistrationFormProps {
  setShowSuccessPage: (showSuccessPage: boolean) => void;
}

export function ProfessionalRegistrationForm(
  props: ProfessionalRegistrationFormProps,
) {
  const createProcedure = useCreateProcedure();

  async function handleSubmit(
    values: MedicalRegistryCreateProcedureFormValues,
  ) {
    await createProcedure.mutateAsync(mapCreateProcedureRequest(values), {
      onSuccess: () => props.setShowSuccessPage(true),
    });
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {(formikProps) => (
        <ProfessionalRegistrationStepper formikProps={formikProps} />
      )}
    </Formik>
  );
}
