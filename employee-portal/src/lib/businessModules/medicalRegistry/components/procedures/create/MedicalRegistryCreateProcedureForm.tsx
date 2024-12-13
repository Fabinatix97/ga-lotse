/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiEmploymentStatus,
  ApiEmploymentType,
  ApiTypeOfChange,
} from "@eshg/employee-portal-api/medicalRegistry";
import { Divider } from "@mui/joy";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { mapCreateProcedureRequest } from "@/lib/businessModules/medicalRegistry/api/mapper";
import { useCreateProcedure } from "@/lib/businessModules/medicalRegistry/api/mutations/medicalRegistryEntries";
import { DataPrivacyFormValues } from "@/lib/businessModules/medicalRegistry/components/procedures/create/DataPrivacyForm";
import {
  EmployeeInformationForm,
  EmployeeInformationFormValues,
} from "@/lib/businessModules/medicalRegistry/components/procedures/create/EmployeeInformationForm";
import {
  RequiredDocumentsForm,
  RequiredDocumentsFormValues,
} from "@/lib/businessModules/medicalRegistry/components/procedures/create/RequiredDocumentsForm";
import {
  WrittenConfirmationForm,
  WrittenConfirmationFormValues,
} from "@/lib/businessModules/medicalRegistry/components/procedures/create/WrittenConfirmationForm";
import { routes } from "@/lib/businessModules/medicalRegistry/shared/routes";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { FormGroupGrid } from "@/lib/shared/components/form/FormGroupGrid";
import { FormSheet } from "@/lib/shared/components/form/FormSheet";

import {
  GeneralInformationForm,
  GeneralInformationFormValues,
} from "./GeneralInformationForm";
import {
  OccupationalInformationForm,
  OccupationalInformationFormValues,
} from "./OccupationalInformationForm";
import {
  PersonalInformationForm,
  PersonalInformationFormValues,
} from "./PersonalInformationForm";
import {
  PracticeInformationForm,
  PracticeInformationFormValues,
} from "./PracticeInformationForm";
import {
  ProfessionalismInformationForm,
  ProfessionalismInformationFormValues,
} from "./ProfessionalismInformationForm";

export interface MedicalRegistryCreateProcedureFormValues {
  generalInformationForm: GeneralInformationFormValues;
  personalInformationForm: PersonalInformationFormValues;
  occupationalInformationForm: OccupationalInformationFormValues;
  professionalismInformationForm: ProfessionalismInformationFormValues;
  practiceInformationForm: PracticeInformationFormValues;
  employeeInformationForm: EmployeeInformationFormValues;
  requiredDocumentsForm: RequiredDocumentsFormValues;
  dataPrivacyForm: DataPrivacyFormValues;
  writtenConfirmationForm: WrittenConfirmationFormValues;
}

const initialGeneralInformationFormValues: GeneralInformationFormValues = {
  changeType: "",
};

const initialPersonalInformationFormValues: PersonalInformationFormValues = {
  title: "",
  firstName: "",
  lastName: "",
  birthName: "",
  gender: "",
  street: "",
  houseNumber: "",
  postalCode: "",
  city: "",
  country: "",
  phoneNumber: "",
  email: "",
  birthDate: "",
  birthPlace: "",
  nationality: "",
};

const initialOccupationalInformationFormValues: OccupationalInformationFormValues =
  {
    professionalTitle: "",
    fieldOfExpertise: "",
    specialistTitle: "",
    furtherTraining: "",
    qualifications: "",
    approbationGrantedOn: "",
    approbationIssuingAuthority: "",
    lifetimeDoctorNumber: "",
  };

const initialProfessionalismInformationFormValues: ProfessionalismInformationFormValues =
  {
    employmentType: ApiEmploymentType.FullTime,
    employmentStatus: ApiEmploymentStatus.Employee,
  };

const initialPracticeInformationFormValues: PracticeInformationFormValues = {
  proprietaryPractice: false,
  practiceName: "",
  street: "",
  houseNumber: "",
  postalCode: "",
  city: "",
  phoneNumber: "",
  email: "",
  website: "",
  openingHours: "",
  institutionIdentifier: "",
  establishmentNumber: "",
  healthInsuranceAuthorization: true,
};

const initialEmployeeInformationFormValues: EmployeeInformationFormValues = {
  employeesEmployed: false,
  employeesFile: null,
};

const initialRequiredDocumentsFormValues: RequiredDocumentsFormValues = {
  license: null,
  identificationDocument: null,
  workPermit: null,
  otherRelevantDocuments: [],
};

const initialDataPrivacyFormValues: DataPrivacyFormValues = {
  agreed: true,
};

const initialWrittenConfirmationFormValues: WrittenConfirmationFormValues = {
  requestForWrittenConfirmation: false,
};

const initialValues: MedicalRegistryCreateProcedureFormValues = {
  generalInformationForm: initialGeneralInformationFormValues,
  personalInformationForm: initialPersonalInformationFormValues,
  occupationalInformationForm: initialOccupationalInformationFormValues,
  professionalismInformationForm: initialProfessionalismInformationFormValues,
  practiceInformationForm: initialPracticeInformationFormValues,
  employeeInformationForm: initialEmployeeInformationFormValues,
  requiredDocumentsForm: initialRequiredDocumentsFormValues,
  dataPrivacyForm: initialDataPrivacyFormValues,
  writtenConfirmationForm: initialWrittenConfirmationFormValues,
};

export const requiredFieldMessage = "Pflichtfeld!";

interface MedicalRegistryCreateProcedureFormProps {
  setShowSuccessPage: (showSuccessPage: boolean) => void;
}

type Section = "profession" | "practice" | "employees" | "optionalDocuments";
const sectionEnabled: Record<Section, ApiTypeOfChange[]> = {
  profession: [
    ApiTypeOfChange.NewRegistration,
    ApiTypeOfChange.ReRegistration,
    ApiTypeOfChange.Other,
  ],
  practice: [
    ApiTypeOfChange.NewRegistration,
    ApiTypeOfChange.ReRegistration,
    ApiTypeOfChange.Other,
    ApiTypeOfChange.SecondPractice,
    ApiTypeOfChange.ChangeOfRegistration,
  ],
  employees: [
    ApiTypeOfChange.NewRegistration,
    ApiTypeOfChange.ReRegistration,
    ApiTypeOfChange.Other,
    ApiTypeOfChange.SecondPractice,
  ],
  optionalDocuments: [
    ApiTypeOfChange.NewRegistration,
    ApiTypeOfChange.ReRegistration,
    ApiTypeOfChange.Other,
  ],
};

function shouldEnable(
  section: Section,
  values: MedicalRegistryCreateProcedureFormValues,
): boolean {
  const typeOfChange = values.generalInformationForm.changeType;
  if (typeOfChange === "") {
    return true;
  }
  return sectionEnabled[section].includes(typeOfChange);
}

function forceProprietaryPractice(
  values: MedicalRegistryCreateProcedureFormValues,
) {
  const typeOfChange = values.generalInformationForm.changeType;
  return (
    typeOfChange === ApiTypeOfChange.SecondPractice ||
    typeOfChange === ApiTypeOfChange.ChangeOfRegistration
  );
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

          {shouldEnable("profession", values) && (
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

          {shouldEnable("practice", values) && (
            <>
              <FormGroupGrid
                columns={{ xxs: 6, xxl: 12 }}
                data-testid="practice-information"
              >
                <PracticeInformationForm
                  name="practiceInformationForm"
                  forceProprietaryPractice={forceProprietaryPractice(values)}
                />
              </FormGroupGrid>
              <Divider />
            </>
          )}

          {shouldEnable("employees", values) && (
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
                values,
              )}
            />
          </FormGroupGrid>
          <Divider />

          <WrittenConfirmationForm name="writtenConfirmationForm" />

          <FormButtonBar
            submitLabel={"Speichern"}
            submitting={isSubmitting}
            onCancel={handleCancel}
          />
        </FormSheet>
      )}
    </Formik>
  );
}
