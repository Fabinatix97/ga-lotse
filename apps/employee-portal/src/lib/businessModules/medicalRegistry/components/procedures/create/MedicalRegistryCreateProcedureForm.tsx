/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider } from "@mui/joy";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

import { FormButtonBar, FormSheet } from "@eshg/lib-employee-portal";
import {
  INITIAL_PROCEDURE_FORM_VALUES,
  mapCreateProcedureRequest,
  shouldEnableSection,
} from "@eshg/medical-registry";

import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useCreateProcedure } from "@/lib/businessModules/medicalRegistry/api/mutations/medicalRegistryEntries";
import { EmployeeInformationForm } from "@/lib/businessModules/medicalRegistry/components/procedures/create/EmployeeInformationForm";
import { EmployeesForm } from "@/lib/businessModules/medicalRegistry/components/procedures/create/EmployeesForm";
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

export function MedicalRegistryCreateProcedureForm() {
  const router = useRouter();

  function handleCancel() {
    router.push(routes.procedures.index);
  }

  const createProcedure = useCreateProcedure();

  return (
    <Formik
      initialValues={INITIAL_PROCEDURE_FORM_VALUES}
      onSubmit={async (values) => {
        await createProcedure
          .mutateAsync(mapCreateProcedureRequest(values), {
            onSuccess: (procedureId) =>
              router.push(routes.procedures.byId(procedureId).details),
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

          {shouldEnableSection(
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

          {shouldEnableSection(
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
                    !shouldEnableSection(
                      "practiceChoice",
                      values.generalInformationForm.changeType,
                    )
                  }
                />
              </FormGroupGrid>
              <Divider />
            </>
          )}

          {shouldEnableSection(
            "employeeInfo",
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

          {shouldEnableSection(
            "employees",
            values.generalInformationForm.changeType,
          ) && (
            <>
              <FormGroupGrid
                columns={{ xxs: 6, xxl: 12 }}
                data-testid="employees-list"
              >
                <EmployeesForm name="employeesForm" />
              </FormGroupGrid>
              <Divider />
            </>
          )}

          <FormGroupGrid columns={{ xxs: 6, xxl: 12 }}>
            <RequiredDocumentsForm
              name="requiredDocumentsForm"
              enableOptionalDocuments={shouldEnableSection(
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
