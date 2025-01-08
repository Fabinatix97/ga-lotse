/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiEmploymentStatus,
  ApiEmploymentType,
  ApiProfessionalTitle,
  ApiTypeOfChange,
} from "@eshg/employee-portal-api/medicalRegistry";

export const changeTypeNames = {
  [ApiTypeOfChange.NewRegistration]: "Neuanmeldung",
  [ApiTypeOfChange.SecondPractice]: "Zweitpraxis",
  [ApiTypeOfChange.ReRegistration]: "Wiederanmeldung",
  [ApiTypeOfChange.ChangeOfRegistration]: "Ummeldung",
  [ApiTypeOfChange.ChangeOfName]: "Namensänderung",
  [ApiTypeOfChange.Relocation]: "Wegzug",
  [ApiTypeOfChange.Deregistration]: "Abmeldung",
  [ApiTypeOfChange.Other]: "Sonstiges",
} satisfies Record<ApiTypeOfChange, string>;

export const professionalTitleNames = {
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

export const employmentTypeNames = {
  [ApiEmploymentType.FullTime]: "Hauptberuflich",
  [ApiEmploymentType.PartTime]: "Nebenberuflich",
} satisfies Record<ApiEmploymentType, string>;

export const employmentStatusNames = {
  [ApiEmploymentStatus.SelfEmployed]: "Selbstständig",
  [ApiEmploymentStatus.Freelance]: "Freiberuflich",
  [ApiEmploymentStatus.Employee]: "Angestellt",
} satisfies Record<ApiEmploymentStatus, string>;
