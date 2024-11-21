/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCountryCode,
  CreateProcedureRequest,
} from "@eshg/employee-portal-api/medicalRegistry";
import {
  mapNullableValue,
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal/helpers/form";

import { MedicalRegistryCreateProcedureFormValues } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";

export function mapCreateProcedureRequest(
  values: MedicalRegistryCreateProcedureFormValues,
): CreateProcedureRequest {
  return {
    procedure: {
      consentToPrivacyPolicy: values.dataPrivacyForm.agreed,
      employeesEmployed: values.employeeInformationForm.employeesEmployed,
      practice: values.practiceInformationForm.proprietaryPractice
        ? {
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
            openingHours: mapOptionalValue(
              values.practiceInformationForm.openingHours,
            ),
            phoneNumber: values.practiceInformationForm.phoneNumber,
            website: mapOptionalValue(values.practiceInformationForm.website),
          }
        : undefined,
      professional: {
        address: {
          city: values.personalInformationForm.city,
          country: mapRequiredValue(values.personalInformationForm.country),
          houseNumber: values.personalInformationForm.houseNumber,
          postalCode: values.personalInformationForm.postalCode,
          street: values.personalInformationForm.street,
        },
        approbationGrantedOn: new Date(
          values.occupationalInformationForm.approbationGrantedOn,
        ),
        approbationIssuingAuthority:
          values.occupationalInformationForm.approbationIssuingAuthority,
        dateOfBirth: new Date(values.personalInformationForm.birthDate),
        emailAddress: values.personalInformationForm.email,
        employmentStatus:
          values.professionalismInformationForm.employmentStatus,
        employmentType: values.professionalismInformationForm.employmentType,
        fieldOfExpertise: mapOptionalValue(
          values.occupationalInformationForm.fieldOfExpertise,
        ),
        firstName: values.personalInformationForm.firstName,
        furtherTraining: mapOptionalValue(
          values.occupationalInformationForm.furtherTraining,
        ),
        gender: mapRequiredValue(values.personalInformationForm.gender),
        lastName: values.personalInformationForm.lastName,
        lifetimeDoctorNumber: mapOptionalValue(
          values.occupationalInformationForm.lifetimeDoctorNumber,
        ),
        nameAtBirth: values.personalInformationForm.birthName,
        nationality: mapRequiredValue(
          values.personalInformationForm.nationality,
        ),
        phoneNumber: values.personalInformationForm.phoneNumber,
        placeOfBirth: values.personalInformationForm.birthPlace,
        professionalTitle: mapRequiredValue(
          values.occupationalInformationForm.professionalTitle,
        ),
        qualifications: mapOptionalValue(
          values.occupationalInformationForm.qualifications,
        ),
        specialistTitle: mapOptionalValue(
          values.occupationalInformationForm.specialistTitle,
        ),
        title: mapOptionalValue(values.personalInformationForm.title),
      },
      requestForWrittenConfirmation:
        values.writtenConfirmationForm.requestForWrittenConfirmation,
      typeOfChange: mapRequiredValue(values.generalInformationForm.changeType),
    },
    employeeList: values.employeeInformationForm.employeesEmployed
      ? mapRequiredValue(values.employeeInformationForm.employeesFile)
      : undefined,
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
  };
}
