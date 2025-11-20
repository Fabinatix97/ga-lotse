/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGender, ApiProcedureStatus } from "@eshg/base-api";
import {
  ApiConsultationType,
  ApiPersonLanguage,
} from "@eshg/prostitute-protection-api";

import {
  ConsultationTopic,
  HealthInsurance,
  MedicalReferral,
  WorkEnvironment,
} from "../shared/constants";

export interface Person {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
}

export interface Alias {
  alias?: string | null;
  associatedConsultations: ApiProstituteProtectionProcedure[];
}

export interface ApiProstituteProtectionProcedure {
  id: string;
  consultationDate: Date;
  consultationType: ApiConsultationType;
  consultationTopics: ConsultationTopic[];
  interpreter: boolean;
  consultationLanguage: ApiPersonLanguage[];
  gender: ApiGender;
  beginnerInSexWork: boolean;
  workEnvironment: WorkEnvironment[];
  emergencySituation: boolean;
  healthInsurance: HealthInsurance[];
  referralToSocialServices: boolean;
  referralToMedicalInstitutions: MedicalReferral[];
  consultant: string;
  person: Person;
  alias: Alias;
  procedureStatus: ApiProcedureStatus;
}

export const mockProcedures: ApiProstituteProtectionProcedure[] = [
  {
    id: "3d7eb7f0-4a6a-4ecb-9f43-3b63bd40c922",
    consultationDate: new Date("2025-11-30T11:00:00"),
    consultationType: ApiConsultationType.Initial,
    consultationTopics: [
      ConsultationTopic.diseasePrevention,
      ConsultationTopic.contraception,
    ],
    interpreter: false,
    consultationLanguage: [ApiPersonLanguage.German, ApiPersonLanguage.English],
    gender: ApiGender.Female,
    beginnerInSexWork: true,
    workEnvironment: [WorkEnvironment.brothel],
    emergencySituation: false,
    healthInsurance: [HealthInsurance.uninsured],
    referralToSocialServices: true,
    referralToMedicalInstitutions: [MedicalReferral.homanitarianClinic],
    consultant: "Anna Müller",
    person: {
      firstName: "Julia",
      lastName: "Schneider",
      dateOfBirth: new Date("1995-06-12"),
    },
    alias: {
      alias: "Luna",
      associatedConsultations: [],
    },
    procedureStatus: ApiProcedureStatus.Open,
  },

  {
    id: "a8f9d61e-7ce1-4d26-9ea4-a2e21771b53e",
    consultationDate: new Date("2025-11-29T13:00:00"),
    consultationType: ApiConsultationType.FollowUp,
    consultationTopics: [ConsultationTopic.pregnancy],
    interpreter: true,
    consultationLanguage: [ApiPersonLanguage.English, ApiPersonLanguage.German],
    gender: ApiGender.Female,
    beginnerInSexWork: false,
    workEnvironment: [WorkEnvironment.escort, WorkEnvironment.apartment],
    emergencySituation: false,
    healthInsurance: [HealthInsurance.insuredInGermany],
    referralToSocialServices: false,
    referralToMedicalInstitutions: [MedicalReferral.studentPolyclinic],
    consultant: "Mark Stewart",
    person: {
      firstName: "Lisa",
      lastName: "Fischer",
      dateOfBirth: new Date("1990-03-11"),
    },
    alias: {
      alias: null,
      associatedConsultations: [],
    },
    procedureStatus: ApiProcedureStatus.InProgress,
  },

  {
    id: "c6b20b8d-9cec-44f6-b9ec-0a74c4b1f31d",
    consultationDate: new Date("2025-11-28T12:00:00"),
    consultationType: ApiConsultationType.Initial,
    consultationTopics: [
      ConsultationTopic.drugRisks,
      ConsultationTopic.diseasePrevention,
    ],
    interpreter: false,
    consultationLanguage: [ApiPersonLanguage.Polish, ApiPersonLanguage.German],
    gender: ApiGender.Female,
    beginnerInSexWork: true,
    workEnvironment: [WorkEnvironment.streetProstitution],
    emergencySituation: true,
    healthInsurance: [HealthInsurance.foreignInsuranceOnly],
    referralToSocialServices: true,
    referralToMedicalInstitutions: [],
    consultant: "Hans Becker",
    person: {
      firstName: "Anna",
      lastName: "Müller",
      dateOfBirth: new Date("1988-09-30"),
    },
    alias: {
      alias: "Annie",
      associatedConsultations: [],
    },
    procedureStatus: ApiProcedureStatus.Closed,
  },

  {
    id: "0fe4a542-d1b1-4e57-b59f-4191017d6c8e",
    consultationDate: new Date("2025-11-27T09:00:00"),
    consultationType: ApiConsultationType.Initial,
    consultationTopics: [ConsultationTopic.contraception],
    interpreter: false,
    consultationLanguage: [ApiPersonLanguage.Russian, ApiPersonLanguage.German],
    gender: ApiGender.Female,
    beginnerInSexWork: false,
    workEnvironment: [WorkEnvironment.club],
    emergencySituation: false,
    healthInsurance: [HealthInsurance.insuredOnlyInHomeCountry],
    referralToSocialServices: false,
    referralToMedicalInstitutions: [MedicalReferral.ifsg19Measures],
    consultant: "Julia Braun",
    person: {
      firstName: "Katharina",
      lastName: "Hoffmann",
      dateOfBirth: new Date("1997-12-01"),
    },
    alias: {
      alias: "Ruby",
      associatedConsultations: [],
    },
    procedureStatus: ApiProcedureStatus.Open,
  },

  {
    id: "f25a7c6b-567d-4ce6-bf1e-7bb043d43477",
    consultationDate: new Date("2025-11-26T10:00:00"),
    consultationType: ApiConsultationType.Initial,
    consultationTopics: [
      ConsultationTopic.diseasePrevention,
      ConsultationTopic.drugRisks,
    ],
    interpreter: true,
    consultationLanguage: [ApiPersonLanguage.Spanish, ApiPersonLanguage.German],
    gender: ApiGender.Female,
    beginnerInSexWork: false,
    workEnvironment: [WorkEnvironment.massageSalon, WorkEnvironment.escort],
    emergencySituation: false,
    healthInsurance: [HealthInsurance.uninsured],
    referralToSocialServices: true,
    referralToMedicalInstitutions: [MedicalReferral.studentPolyclinic],
    consultant: "Elena Rossi",
    person: {
      firstName: "Robin",
      lastName: "Neumann",
      dateOfBirth: new Date("1992-11-23"),
    },
    alias: {
      alias: "Silver",
      associatedConsultations: [],
    },
    procedureStatus: ApiProcedureStatus.InProgress,
  },
];
