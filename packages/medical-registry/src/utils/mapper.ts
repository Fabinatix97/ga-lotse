/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isEmpty } from "remeda";

import {
  mapNullableValue,
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal";
import {
  ApiCountryCode,
  ApiCreateApplicant,
  ApiCreateEmployeeChange,
  ApiCreatePractice,
  ApiCreateProcedureRequestProcedure,
  ApiCreateProfessionInformation,
  ApiTypeOfApplicantChange,
  ApiTypeOfFullChange,
  ApiTypeOfPracticeChange,
  CreateProcedureRequest,
} from "@eshg/medical-registry-api";

import { MedicalRegistryCreateProcedureFormValues } from "../components/createProcedureForm/createProcedureFormValues";

export function mapCreateProcedureRequest(
  values: MedicalRegistryCreateProcedureFormValues,
): CreateProcedureRequest {
  return {
    procedure: mapProcedure(values),
    ...mapDocuments(values),
  };
}

function mapProcedure(
  values: MedicalRegistryCreateProcedureFormValues,
): ApiCreateProcedureRequestProcedure {
  const typeOfChange = mapRequiredValue(
    values.generalInformationForm.changeType,
  );
  switch (typeOfChange) {
    case "DEREGISTRATION":
    case "RELOCATION":
    case "CHANGE_OF_NAME":
      return mapCreateApplicantChangeRequest(typeOfChange, values);
    case "SECOND_PRACTICE":
    case "CHANGE_OF_REGISTRATION":
      return mapCreatePracticeChangeRequest(typeOfChange, values);
    case "CHANGE_OF_EMPLOYEES":
      return mapCreateEmployeeChangeRequest(values);
    case "NEW_REGISTRATION":
    case "RE_REGISTRATION":
    case "OTHER":
      return mapCreateFullChangeRequest(typeOfChange, values);
  }
}

export function mapDocuments(values: MedicalRegistryCreateProcedureFormValues) {
  const typeOfChange = mapRequiredValue(
    values.generalInformationForm.changeType,
  );
  switch (typeOfChange) {
    case "DEREGISTRATION":
    case "RELOCATION":
    case "CHANGE_OF_NAME":
    case "CHANGE_OF_REGISTRATION":
    case "SECOND_PRACTICE":
    case "CHANGE_OF_EMPLOYEES":
      return mapMandatoryDocuments(values);
    case "NEW_REGISTRATION":
    case "RE_REGISTRATION":
    case "OTHER":
      return mapFullDocuments(values);
    default:
      throw new Error("Unexpected type of change");
  }
}

function mapCreateEmployeeChangeRequest(
  values: MedicalRegistryCreateProcedureFormValues,
): ApiCreateProcedureRequestProcedure {
  return {
    type: "CreateEmployeeChangeRequest",
    consentToPrivacyPolicy: true,
    applicant: mapApplicant(values),
    requestForWrittenConfirmation:
      values.writtenConfirmationForm.requestForWrittenConfirmation,
    employeeChanges: mapEmployees(values),
  };
}

function mapCreateApplicantChangeRequest(
  typeOfApplicantChange: ApiTypeOfApplicantChange,
  values: MedicalRegistryCreateProcedureFormValues,
): ApiCreateProcedureRequestProcedure {
  return {
    type: "CreateApplicantChangeRequest",
    consentToPrivacyPolicy: true,
    applicant: mapApplicant(values),
    requestForWrittenConfirmation:
      values.writtenConfirmationForm.requestForWrittenConfirmation,
    typeOfApplicantChange: typeOfApplicantChange,
  };
}

function mapCreatePracticeChangeRequest(
  typeOfChange: ApiTypeOfPracticeChange,
  values: MedicalRegistryCreateProcedureFormValues,
): ApiCreateProcedureRequestProcedure {
  return {
    type: "CreatePracticeChangeRequest",
    consentToPrivacyPolicy: true,
    applicant: mapApplicant(values),
    requestForWrittenConfirmation:
      values.writtenConfirmationForm.requestForWrittenConfirmation,
    practice: mapPractice(values),
    typeOfPracticeChange: typeOfChange,
  };
}

function mapCreateFullChangeRequest(
  typeOfFullChange: ApiTypeOfFullChange,
  values: MedicalRegistryCreateProcedureFormValues,
): ApiCreateProcedureRequestProcedure {
  return {
    type: "CreateFullChangeRequest",
    consentToPrivacyPolicy: true,
    practice: values.practiceInformationForm.proprietaryPractice
      ? mapPractice(values)
      : undefined,
    applicant: mapApplicant(values),
    professionInformation: mapProfessionInformation(values),
    requestForWrittenConfirmation:
      values.writtenConfirmationForm.requestForWrittenConfirmation,
    typeOfFullChange: typeOfFullChange,
  };
}

function mapApplicant(
  values: MedicalRegistryCreateProcedureFormValues,
): ApiCreateApplicant {
  return {
    address: {
      city: values.personalInformationForm.city,
      country: mapRequiredValue(values.personalInformationForm.country),
      houseNumber: values.personalInformationForm.houseNumber,
      postalCode: values.personalInformationForm.postalCode,
      street: values.personalInformationForm.street,
    },
    dateOfBirth: new Date(values.personalInformationForm.birthDate),
    emailAddress: mapOptionalValue(values.personalInformationForm.email),
    firstName: values.personalInformationForm.firstName,
    gender: mapRequiredValue(values.personalInformationForm.gender),
    lastName: values.personalInformationForm.lastName,
    nameAtBirth: mapOptionalValue(values.personalInformationForm.birthName),
    phoneNumber: values.personalInformationForm.phoneNumber,
    placeOfBirth: values.personalInformationForm.birthPlace,
    title: mapOptionalValue(values.personalInformationForm.title),
    nationality: mapRequiredValue(values.personalInformationForm.nationality),
  };
}

function mapPractice(
  values: MedicalRegistryCreateProcedureFormValues,
): ApiCreatePractice {
  return {
    address: {
      city: values.practiceInformationForm.city,
      houseNumber: values.practiceInformationForm.houseNumber,
      postalCode: values.practiceInformationForm.postalCode,
      street: values.practiceInformationForm.street,
    },
    emailAddress: values.practiceInformationForm.email,
    establishmentNumber: mapOptionalValue(
      values.practiceInformationForm.establishmentNumber,
    ),
    healthInsuranceAuthorization:
      values.practiceInformationForm.healthInsuranceAuthorization,
    institutionIdentifier: mapOptionalValue(
      values.practiceInformationForm.institutionIdentifier,
    ),
    name: values.practiceInformationForm.practiceName,
    openingHours: mapOptionalValue(values.practiceInformationForm.openingHours),
    phoneNumber: values.practiceInformationForm.phoneNumber,
    website: mapOptionalValue(values.practiceInformationForm.website),
  };
}

function mapProfessionInformation(
  values: MedicalRegistryCreateProcedureFormValues,
): ApiCreateProfessionInformation {
  return {
    approbationGrantedOn: new Date(
      values.occupationalInformationForm.approbationGrantedOn,
    ),
    approbationIssuingAuthority:
      values.occupationalInformationForm.approbationIssuingAuthority,
    employmentStatus: values.professionalismInformationForm.employmentStatus,
    employmentType: values.professionalismInformationForm.employmentType,
    fieldOfExpertise: mapOptionalValue(
      values.occupationalInformationForm.fieldOfExpertise,
    ),
    furtherTraining: mapOptionalValue(
      values.occupationalInformationForm.furtherTraining,
    ),
    lifetimeDoctorNumber: mapOptionalValue(
      values.occupationalInformationForm.lifetimeDoctorNumber,
    ),
    professionalTitle: mapRequiredValue(
      values.occupationalInformationForm.professionalTitle,
    ),
    qualifications: mapOptionalValue(
      values.occupationalInformationForm.qualifications,
    ),
    specialistTitle: mapOptionalValue(
      values.occupationalInformationForm.specialistTitle,
    ),
  };
}

function mapMandatoryDocuments(
  values: MedicalRegistryCreateProcedureFormValues,
) {
  return {
    identificationDocument: mapRequiredValue(
      values.requiredDocumentsForm.identificationDocument,
    ),
    otherRelevantDocuments: !isEmpty(
      values.requiredDocumentsForm.otherRelevantDocuments,
    )
      ? values.requiredDocumentsForm.otherRelevantDocuments
      : undefined,
  };
}

function mapFullDocuments(values: MedicalRegistryCreateProcedureFormValues) {
  return {
    professionalLicenseCertificate: mapNullableValue(
      values.requiredDocumentsForm.license,
    ),
    identificationDocument: mapRequiredValue(
      values.requiredDocumentsForm.identificationDocument,
    ),
    workPermit:
      values.personalInformationForm.nationality !== ApiCountryCode.De
        ? mapNullableValue(values.requiredDocumentsForm.workPermit)
        : undefined,
    otherRelevantDocuments: !isEmpty(
      values.requiredDocumentsForm.otherRelevantDocuments,
    )
      ? values.requiredDocumentsForm.otherRelevantDocuments
      : undefined,
  };
}

function mapEmployees(
  values: MedicalRegistryCreateProcedureFormValues,
): ApiCreateEmployeeChange[] {
  return values.employeesForm.employees.map((employeeChange) => ({
    changeType: mapRequiredValue(employeeChange.changeType),
    firstName: employeeChange.firstName,
    lastName: employeeChange.lastName,
    dateOfBirth: new Date(employeeChange.dateOfBirth),
  }));
}
