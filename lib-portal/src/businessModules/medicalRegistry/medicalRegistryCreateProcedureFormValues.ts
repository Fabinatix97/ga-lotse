/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiCountryCode, ApiGender } from "@eshg/base-api";
import {
  ApiEmploymentStatus,
  ApiEmploymentType,
  ApiProfessionalTitle,
  ApiTypeOfChange,
} from "@eshg/medical-registry-api";

import { NullableFieldValue, OptionalFieldValue } from "../../types/form";

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

export interface GeneralInformationFormValues {
  changeType: OptionalFieldValue<ApiTypeOfChange>;
}

export interface PersonalInformationFormValues {
  title: OptionalFieldValue<string>;
  firstName: string;
  lastName: string;
  birthName: OptionalFieldValue<string>;
  gender: OptionalFieldValue<ApiGender>;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: OptionalFieldValue<ApiCountryCode>;
  phoneNumber: string;
  email: OptionalFieldValue<string>;
  birthDate: OptionalFieldValue<Date>;
  birthPlace: string;
  nationality: OptionalFieldValue<ApiCountryCode>;
}

export interface OccupationalInformationFormValues {
  professionalTitle: OptionalFieldValue<ApiProfessionalTitle>;
  fieldOfExpertise: OptionalFieldValue<string>;
  specialistTitle: OptionalFieldValue<string>;
  furtherTraining: OptionalFieldValue<string>;
  qualifications: OptionalFieldValue<string>;
  approbationGrantedOn: OptionalFieldValue<Date>;
  approbationIssuingAuthority: string;
  lifetimeDoctorNumber: OptionalFieldValue<string>;
}

export interface ProfessionalismInformationFormValues {
  employmentType: ApiEmploymentType;
  employmentStatus: ApiEmploymentStatus;
}

export interface PracticeInformationFormValues {
  proprietaryPractice: boolean;
  practiceName: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
  email: string;
  website: OptionalFieldValue<string>;
  openingHours: OptionalFieldValue<string>;
  institutionIdentifier: OptionalFieldValue<string>;
  establishmentNumber: OptionalFieldValue<string>;
  healthInsuranceAuthorization: boolean;
}

export interface EmployeeInformationFormValues {
  employeesEmployed: boolean;
  employeesFile: NullableFieldValue<File>;
}

export interface RequiredDocumentsFormValues {
  license: NullableFieldValue<File>;
  identificationDocument: NullableFieldValue<File>;
  workPermit: NullableFieldValue<File>;
  otherRelevantDocuments: File[];
}

export interface DataPrivacyFormValues {
  agreedDataPrivacyNotice: boolean;
  agreedDataPrivacyPolicy: boolean;
}

export interface WrittenConfirmationFormValues {
  requestForWrittenConfirmation: boolean;
  confirmationFee: boolean;
  confirmationByPost: boolean;
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
  agreedDataPrivacyNotice: false,
  agreedDataPrivacyPolicy: false,
};

const initialWrittenConfirmationFormValues: WrittenConfirmationFormValues = {
  requestForWrittenConfirmation: false,
  confirmationFee: false,
  confirmationByPost: false,
};

export const initialValues: MedicalRegistryCreateProcedureFormValues = {
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
