/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.testhelper.api;

public enum ConcernTestDataConfig {
  DRUG_SCREENING("Alkohol/Drogenscreening"),
  REINTEGRATION("Arbeitsversuch / Wiedereingliederung"),
  ATTESTATION("Attest (AU ab 1. Krankheitstag)"),
  ASSISTANCE("Beihilfe (nach Aktenlage)"),
  CERTIFICATE_FOR_CALL_OF_DUTY_FREE("Dienstfähigkeit (gebührenfrei)"),
  CERTIFICATE_FOR_CALL_OF_DUTY_PAID("Dienstfähigkeit (gebührenpflichtig)"),
  CERTIFICATE_FOR_CALL_OF_DUTY_ADDITION("Dienstfähigkeit / Ergänzung"),
  CERTIFICATE_FOR_CALL_OF_DUTY_CONTRADICTION("Dienstfähigkeit / Widerspruch"),
  OPERATIONAL_CAPABILITY("Einsatzfähigkeit"),
  RECRUITMENT_FREE("Einstellung (gebührenfrei)"),
  RECRUITMENT_PAID("Einstellung (gebührenpflichtig)"),
  CIVIL_SERVANTS_ON_PROBATION("Einstellung BaP / Verbeamtung auf Probe"),
  CIVIL_SERVANTS("Einstellung BaL / Verbeamtung auf Lebenszeit"),
  PROBATIONARY_CIVIL_SERVANTS("Einstellung BaW / Verbeamtung auf Widerruf"),
  TEMPORARY_CIVIL_SERVANTS("Einstellung BaZ / Verbeamtung auf Zeit"),
  RECRUITMENT_CONTRADICTION("Einstellung / Widerspruch"),
  RECRUITMENT_FIRE_DEPARTMENT("Einstellung / Werkfeuerwehr"),
  HOURLY_DISCOUNT("Stundenermäßigung (Lehrkräfte)"),
  ACCIDENT_REPORT_FREE("Unfallbegutachtung (gebührenfrei)"),
  ACCIDENT_REPORT_PAID("Unfallbegutachtung (gebührenpflichtig)"),
  RESCUE_SERVICES_LAW("§ 27 Hess. Rettungsdienstgesetz"),
  PEDIGREE_REPORT("Abstammungsgutachten"),
  ADOPTION("Adoption"),
  WORK_EARNING_CAPACITY("Arbeits-/ Erwerbsfähigkeit"),
  INVESTIGATION_ASSIGNMENT("Gerichtl. Untersuchungsauftrag"),
  FOSTER_CHILD("Aufnahme Pflegekind"),
  SOCIAL_MEDICINE("Sozialmedizin"),
  S_HANDICAPPED("S-Behinderte / § 54 SGB XII"),
  PRESELECTION_FIRE_DEPARTMENT("Vorauswahl für Feuerwehr"),
  PRESELECTION_FIRE_DEPARTMENT_EYESIGHT("Vorauswahl für Feuerwehr Sehvermögen"),
  CONTRADICTION("Widerspruch"),
  TAX_OFFICE("Zur Vorlage beim Finanzamt (Privatpersonen)"),
  EXAMINATION_ELIGIBILITY("Zur Vorlage beim Prüfungsamt"),
  MISCELLANEOUS("Sonstiges"),
  ;

  String nameDe;

  ConcernTestDataConfig(String nameDe) {
    this.nameDe = nameDe;
  }

  public String getNameDe() {
    return nameDe;
  }
}
