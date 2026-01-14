/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.statistics.support;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.medicalregistry.domain.model.ProfessionalTitle;
import java.util.function.Function;

public final class ProfessionalTitles {

  private ProfessionalTitles() {}

  public static String toDescription(ProfessionalTitle status) {
    return switch (status) {
      case ProfessionalTitle.DOCTOR -> "Arzt";
      case ProfessionalTitle.DENTIST -> "Zahnarzt";
      case ProfessionalTitle.PSYCHOLOGICAL_PSYCHOTHERAPIST -> "Psychologischer Psychotherapeut";
      case ProfessionalTitle.NURSING_ASSISTANT -> "Altenpflegehelfer";
      case ProfessionalTitle.GERIATRIC_NURSE -> "Altenpfleger";
      case ProfessionalTitle.DIETICIAN -> "Diätassistent";
      case ProfessionalTitle.DISINFECTOR -> "Desinfektor";
      case ProfessionalTitle.OCCUPATIONAL_THERAPIST -> "Ergotherapeut";
      case ProfessionalTitle.HEALTH_SUPERVISOR -> "Gesundheitsaufseher";
      case ProfessionalTitle.HEALTHCARE_AND_PEDIATRIC_NURSE ->
          "Gesundheits- und Kinderkrankenpfleger (ehem. Kinderkrankenschwester / Kinderkrankenpfleger)";
      case ProfessionalTitle.HEALTHCARE_AND_NURSING_ASSISTANT ->
          "Gesundheits- und Krankenpflegehelfer (ehem. Krankenpflegehelfer)";
      case ProfessionalTitle.HEALTHCARE_AND_NURSING_ASSISTANTS_HELPER ->
          "Gesundheits- und Krankenpfleger (ehem. Krankenschwester / Krankenpfleger)";
      case ProfessionalTitle.MIDWIVE_MATERNITY_NURSE -> "Hebamme / Entbindungspfleger";
      case ProfessionalTitle.ALTERNATIVE_PRACTITIONER -> "Heilpraktiker (HP)";
      case ProfessionalTitle.NON_MEDICAL_PRACTITIONER_FOR_CHIROPRACTIC ->
          "Heilpraktiker für Chiropraktik";
      case ProfessionalTitle.ALTERNATIVE_PRACTITIONER_FOR_SPEECH_THERAPY ->
          "Heilpraktiker für Logopädie";
      case ProfessionalTitle.NON_MEDICAL_PRACTITIONER_FOR_PHYSIOTHERAPY ->
          "Heilpraktiker für Physiotherapie";
      case ProfessionalTitle.NON_MEDICAL_PRACTITIONER_FOR_PSYCHOTHERAPY ->
          "Heilpraktiker für Psychotherapie";
      case ProfessionalTitle.CHILD_AND_YOUTH_PSYCHOTHERAPIST -> "Kinder- und Jugendpsychotherapeut";
      case ProfessionalTitle.SPEECH_THERAPIST -> "Logopäde";
      case ProfessionalTitle.MASSEUR_AND_MEDICAL_BATH_ATTENDANT ->
          "Masseur und medizinischer Bademeister";
      case ProfessionalTitle.MEDICAL_DOCUMENTALIST -> "Medizinischer Dokumentar";
      case ProfessionalTitle.MEDICAL_TECHNICAL_LABORATORY_ASSISTANT ->
          "Medizinisch-Technischer Laboratoriums-Assistent";
      case ProfessionalTitle.MEDICAL_TECHNICAL_RADIOLOGY_ASSISTANT ->
          "Medizinisch-Technischer Radiologie-Assistent";
      case ProfessionalTitle.MEDICAL_TECHNICAL_ASSISTANT_FOR_FUNCTIONAL_DIAGNOSTICS ->
          "Medizinisch-Technischer Assistent für Funktionsdiagnostik";
      case ProfessionalTitle.EMERGENCY_PARAMEDIC -> "Notfallsanitäter (ehem. Rettungsassistent)";
      case ProfessionalTitle.ORTHOPTIST -> "Orthoptist";
      case ProfessionalTitle.CARE_ASSISTANT -> "Pflegehelfer";
      case ProfessionalTitle.NURSING_SERVICE -> "Pflegedienst";
      case ProfessionalTitle.NURSING_SERVICE_MANAGER -> "Pflegedienstleiter";
      case ProfessionalTitle.PHARMACEUTICAL_TECHNICAL_ASSISTANT ->
          "Pharmazeutisch-Technischer Assistent";
      case ProfessionalTitle.PHYSIOTHERAPIST -> "Physiotherapeut";
      case ProfessionalTitle.PODIATRIST -> "Podologe";
      case ProfessionalTitle.RADIOLOGY_ASSISTANT -> "Radiologieassistent";
      case ProfessionalTitle.SPORTS_THERAPIST -> "Sporttherapeut";
      case ProfessionalTitle.PHARMACIST -> "Apotheker";
      case ProfessionalTitle.VETERINARIAN -> "Tierarzt";
    };
  }

  public static Function<ProfessionalTitle, ValueOptionInternal> toValueOption() {
    return title -> new ValueOptionInternal(title.name(), toDescription(title), false);
  }
}
