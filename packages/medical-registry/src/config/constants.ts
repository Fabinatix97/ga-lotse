/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiEmployeeChangeType,
  ApiEmploymentStatus,
  ApiEmploymentType,
  ApiProfessionalTitle,
  ApiTypeOfChange,
} from "@eshg/medical-registry-api";

export const CHANGE_TYPE_NAMES = {
  [ApiTypeOfChange.NewRegistration]: "Neuanmeldung",
  [ApiTypeOfChange.SecondPractice]: "Zweitpraxis",
  [ApiTypeOfChange.ReRegistration]: "Wiederanmeldung",
  [ApiTypeOfChange.ChangeOfRegistration]: "Ummeldung",
  [ApiTypeOfChange.ChangeOfName]: "Namensänderung",
  [ApiTypeOfChange.Relocation]: "Wegzug",
  [ApiTypeOfChange.Deregistration]: "Abmeldung",
  [ApiTypeOfChange.ChangeOfEmployees]: "Mitarbeiter:innen",
  [ApiTypeOfChange.Other]: "Sonstiges",
} satisfies Record<ApiTypeOfChange, string>;

export const PROFESSIONAL_TITLE_NAMES = {
  [ApiProfessionalTitle.Doctor]: "Arzt",
  [ApiProfessionalTitle.Dentist]: "Zahnarzt",
  [ApiProfessionalTitle.PsychologicalPsychotherapist]:
    "Psychologischer Psychotherapeut",
  [ApiProfessionalTitle.NursingAssistant]: "Altenpflegehelfer",
  [ApiProfessionalTitle.GeriatricNurse]: "Altenpfleger",
  [ApiProfessionalTitle.Dietician]: "Diätassistent",
  [ApiProfessionalTitle.Disinfector]: "Desinfektor",
  [ApiProfessionalTitle.OccupationalTherapist]: "Ergotherapeut",
  [ApiProfessionalTitle.HealthSupervisor]: "Gesundheitsaufseher",
  [ApiProfessionalTitle.HealthcareAndPediatricNurse]:
    "Gesundheits- und Kinderkrankenpfleger (ehem. Kinderkrankenschwester / Kinderkrankenpfleger)",
  [ApiProfessionalTitle.HealthcareAndNursingAssistant]:
    "Gesundheits- und Krankenpflegehelfer (ehem. Krankenpflegehelfer)",
  [ApiProfessionalTitle.HealthcareAndNursingAssistantsHelper]:
    "Gesundheits- und Krankenpfleger (ehem. Krankenschwester / Krankenpfleger)",
  [ApiProfessionalTitle.MidwiveMaternityNurse]: "Hebamme / Entbindungspfleger",
  [ApiProfessionalTitle.AlternativePractitioner]: "Heilpraktiker (HP)",
  [ApiProfessionalTitle.NonMedicalPractitionerForChiropractic]:
    "Heilpraktiker für Chiropraktik",
  [ApiProfessionalTitle.AlternativePractitionerForSpeechTherapy]:
    "Heilpraktiker für Logopädie",
  [ApiProfessionalTitle.NonMedicalPractitionerForPhysiotherapy]:
    "Heilpraktiker für Physiotherapie",
  [ApiProfessionalTitle.NonMedicalPractitionerForPsychotherapy]:
    "Heilpraktiker für Psychotherapie",
  [ApiProfessionalTitle.ChildAndYouthPsychotherapist]:
    "Kinder- und Jugendpsychotherapeut",
  [ApiProfessionalTitle.SpeechTherapist]: "Logopäde",
  [ApiProfessionalTitle.MasseurAndMedicalBathAttendant]:
    "Masseur und medizinischer Bademeister",
  [ApiProfessionalTitle.MedicalDocumentalist]: "Medizinischer Dokumentar",
  [ApiProfessionalTitle.MedicalTechnicalLaboratoryAssistant]:
    "Medizinisch-Technischer Laboratoriums-Assistent",
  [ApiProfessionalTitle.MedicalTechnicalRadiologyAssistant]:
    "Medizinisch-Technischer Radiologie-Assistent",
  [ApiProfessionalTitle.MedicalTechnicalAssistantForFunctionalDiagnostics]:
    "Medizinisch-Technischer Assistent für Funktionsdiagnostik",
  [ApiProfessionalTitle.EmergencyParamedic]:
    "Notfallsanitäter (ehem. Rettungsassistent)",
  [ApiProfessionalTitle.Orthoptist]: "Orthoptist",
  [ApiProfessionalTitle.CareAssistant]: "Pflegehelfer",
  [ApiProfessionalTitle.NursingService]: "Pflegedienst",
  [ApiProfessionalTitle.NursingServiceManager]: "Pflegedienstleiter",
  [ApiProfessionalTitle.PharmaceuticalTechnicalAssistant]:
    "Pharmazeutisch-Technischer Assistent",
  [ApiProfessionalTitle.Physiotherapist]: "Physiotherapeut",
  [ApiProfessionalTitle.Podiatrist]: "Podologe",
  [ApiProfessionalTitle.RadiologyAssistant]: "Radiologieassistent",
  [ApiProfessionalTitle.SportsTherapist]: "Sporttherapeut",
  [ApiProfessionalTitle.Pharmacist]: "Apotheker",
  [ApiProfessionalTitle.Veterinarian]: "Tierarzt",
} satisfies Record<ApiProfessionalTitle, string>;

export const EMPLOYMENT_TYPE_NAMES = {
  [ApiEmploymentType.FullTime]: "Hauptberuflich",
  [ApiEmploymentType.PartTime]: "Nebenberuflich",
} satisfies Record<ApiEmploymentType, string>;

export const EMPLOYMENT_STATUS_NAMES = {
  [ApiEmploymentStatus.SelfEmployed]: "Selbstständig",
  [ApiEmploymentStatus.Freelance]: "Freiberuflich",
  [ApiEmploymentStatus.Employee]: "Angestellt",
} satisfies Record<ApiEmploymentStatus, string>;

export const EMPLOYEE_CHANGE_TYPE_NAMES = {
  [ApiEmployeeChangeType.Add]: "Neueinstellung",
  [ApiEmployeeChangeType.Remove]: "Austritt",
} satisfies Record<ApiEmployeeChangeType, string>;
