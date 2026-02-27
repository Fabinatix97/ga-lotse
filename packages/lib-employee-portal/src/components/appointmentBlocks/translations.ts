/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnumMap } from "@eshg/lib-portal";

import { ApiAppointmentType } from "./types";

export const APPOINTMENT_TYPES: EnumMap<ApiAppointmentType> = {
  [ApiAppointmentType.RegularExamination]: "Regeluntersuchung",
  [ApiAppointmentType.CanChild]: "Kann-Kinder",
  [ApiAppointmentType.EntryLevel]: "Eingangsstufe",
  [ApiAppointmentType.SpecialNeeds]: "Besonderer Förderbedarf",
  [ApiAppointmentType.Consultation]: "Beratung",
  [ApiAppointmentType.Vaccination]: "Impfung",
  [ApiAppointmentType.ProofSubmission]: "Nachweisvorlage",
  [ApiAppointmentType.HivStiConsultation]: "HIV-STI-Beratung",
  [ApiAppointmentType.SexWork]: "Sexarbeit",
  [ApiAppointmentType.ResultsReview]: "Ergebnisbesprechung",
  [ApiAppointmentType.OfficialMedicalServiceShort]: "Kleine Untersuchung",
  [ApiAppointmentType.OfficialMedicalServiceLong]: "Große Untersuchung",
  [ApiAppointmentType.MedsAbroadCertification]: "Beglaubigung",
  [ApiAppointmentType.ProstituteProtectionInitial]: "Erstberatung",
  [ApiAppointmentType.ProstituteProtectionFollowUp]: "Folgeberatung",
  [ApiAppointmentType.InfectionBriefingNew]: "Neuer Lebensmittelausweis",
  [ApiAppointmentType.InfectionBriefingReplacement]:
    "Lebensmittelausweis Duplikat",
};
