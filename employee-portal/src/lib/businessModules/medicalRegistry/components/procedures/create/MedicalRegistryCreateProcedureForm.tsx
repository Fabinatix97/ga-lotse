/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider } from "@mui/joy";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

import { FormButtonBar, FormSheet } from "@eshg/lib-employee-portal";
import { mapCreateProcedureRequest } from "@eshg/lib-portal/businessModules/medicalRegistry/api/mapper";
import { initialValues } from "@eshg/lib-portal/businessModules/medicalRegistry/medicalRegistryCreateProcedureFormValues";
import { shouldEnable } from "@eshg/lib-portal/businessModules/medicalRegistry/sections";

import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useCreateProcedure } from "@/lib/businessModules/medicalRegistry/api/mutations/medicalRegistryEntries";
import { EmployeeInformationForm } from "@/lib/businessModules/medicalRegistry/components/procedures/create/EmployeeInformationForm";
import { RequiredDocumentsForm } from "@/lib/businessModules/medicalRegistry/components/procedures/create/RequiredDocumentsForm";
import { WrittenConfirmationForm } from "@/lib/businessModules/medicalRegistry/components/procedures/create/WrittenConfirmationForm";
import { routes } from "@/lib/businessModules/medicalRegistry/shared/routes";
import { FormGroupGrid } from "@/lib/shared/components/form/FormGroupGrid";

import { GeneralInformationForm } from "./GeneralInformationForm";
import { OccupationalInformationForm } from "./OccupationalInformationForm";
import { PersonalInformationForm } from "./PersonalInformationForm";
import { PracticeInformationForm } from "./PracticeInformationForm";
import { ProfessionalismInformationForm } from "./ProfessionalismInformationForm";

export const requiredFieldMessage = "Pflichtfeld!";

interface MedicalRegistryCreateProcedureFormProps {
  setShowSuccessPage: (showSuccessPage: boolean) => void;
}

export function MedicalRegistryCreateProcedureForm(
  props: MedicalRegistryCreateProcedureFormProps,
) {
  const router = useRouter();

  function handleCancel() {
    router.push(routes.procedures.index);
  }

  const createProcedure = useCreateProcedure();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        await createProcedure
          .mutateAsync(mapCreateProcedureRequest(values), {
            onSuccess: () => props.setShowSuccessPage(true),
          })
          .catch((error) => {
            logger.softError(
              "Error creating medical registry procedure: ",
              error,
            );
          });
      }}
    >
      {({ values, isSubmitting, handleSubmit }) => (
        <FormSheet onSubmit={handleSubmit}>
          <FormGroupGrid columns={{ xxs: 6, xxl: 12 }}>
            <GeneralInformationForm name="generalInformationForm" />
          </FormGroupGrid>
          <Divider />

          <FormGroupGrid columns={{ xxs: 6, xxl: 12 }}>
            <PersonalInformationForm name="personalInformationForm" />
          </FormGroupGrid>
          <Divider />

          {shouldEnable(
            "profession",
            values.generalInformationForm.changeType,
          ) && (
            <>
              <FormGroupGrid
                columns={{ xxs: 6, xxl: 12 }}
                data-testid="occupational-information"
              >
                <OccupationalInformationForm name="occupationalInformationForm" />
              </FormGroupGrid>
              <Divider />

              <FormGroupGrid
                columns={{ xxs: 6, xxl: 12 }}
                data-testid="professionalism-information"
              >
                <ProfessionalismInformationForm name="professionalismInformationForm" />
              </FormGroupGrid>
              <Divider />
            </>
          )}

          {shouldEnable(
            "practice",
            values.generalInformationForm.changeType,
          ) && (
            <>
              <FormGroupGrid
                columns={{ xxs: 6, xxl: 12 }}
                data-testid="practice-information"
              >
                <PracticeInformationForm
                  name="practiceInformationForm"
                  forceProprietaryPractice={
                    !shouldEnable(
                      "practiceChoice",
                      values.generalInformationForm.changeType,
                    )
                  }
                />
              </FormGroupGrid>
              <Divider />
            </>
          )}

          {shouldEnable(
            "employees",
            values.generalInformationForm.changeType,
          ) && (
            <>
              <FormGroupGrid
                columns={{ xxs: 6, xxl: 12 }}
                data-testid="employees-information"
              >
                <EmployeeInformationForm name="employeeInformationForm" />
              </FormGroupGrid>
              <Divider />
            </>
          )}

          <FormGroupGrid columns={{ xxs: 6, xxl: 12 }}>
            <RequiredDocumentsForm
              name="requiredDocumentsForm"
              enableOptionalDocuments={shouldEnable(
                "optionalDocuments",
                values.generalInformationForm.changeType,
              )}
            />
          </FormGroupGrid>
          <Divider />

          <WrittenConfirmationForm name="writtenConfirmationForm" />

          <FormButtonBar
            submitLabel="Speichern"
            submitting={isSubmitting}
            onCancel={handleCancel}
          />
        </FormSheet>
      )}
    </Formik>
  );
}
