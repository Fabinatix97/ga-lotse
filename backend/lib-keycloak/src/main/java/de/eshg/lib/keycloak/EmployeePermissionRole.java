/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import java.util.List;

/**
 * Representation of permissions to be created in keycloak as roles. These roles are provided by us
 * and remain stable (not edited by admins) opposed to the "DefaultRoles" in the base module.
 */
public enum EmployeePermissionRole implements PermissionRole {
  STANDARD_EMPLOYEE(
      "Standardberechtigung Mitarbeiter",
      "Standardberechtigung, die ALLE Mitarbeiter:innen automatisch erhalten",
      Module.BASE),
  INSPECTION_LEADER(
      LEADER_KEYCLOAK_NAME, LEADER_DESCRIPTION.formatted("Begehung"), Module.INSPECTION),
  INSPECTION_LANDESAMT_LEADER(
      LEADER_KEYCLOAK_NAME, LEADER_DESCRIPTION.formatted("Begehung"), Module.INSPECTION_LANDESAMT),
  SCHOOL_ENTRY_LEADER(
      LEADER_KEYCLOAK_NAME, LEADER_DESCRIPTION.formatted("ESU"), Module.SCHOOL_ENTRY),
  TRAVEL_MEDICINE_LEADER(
      LEADER_KEYCLOAK_NAME, LEADER_DESCRIPTION.formatted("Impfberatung"), Module.TRAVEL_MEDICINE),
  MEASLES_PROTECTION_LEADER(
      LEADER_KEYCLOAK_NAME,
      LEADER_DESCRIPTION.formatted("Masernschutz"),
      Module.MEASLES_PROTECTION),
  STATISTICS_LEADER(
      LEADER_KEYCLOAK_NAME, LEADER_DESCRIPTION.formatted("Statistik"), Module.STATISTICS),
  STI_PROTECTION_LEADER(
      LEADER_KEYCLOAK_NAME, LEADER_DESCRIPTION.formatted("HIV-STI"), Module.STI_PROTECTION),
  MEDICAL_REGISTRY_LEADER(
      LEADER_KEYCLOAK_NAME,
      LEADER_DESCRIPTION.formatted("Medizinalaufsicht"),
      Module.MEDICAL_REGISTRY),
  DENTAL_LEADER(LEADER_KEYCLOAK_NAME, LEADER_DESCRIPTION.formatted("ZAD"), Module.DENTAL),
  OPEN_DATA_LEADER(
      LEADER_KEYCLOAK_NAME, LEADER_DESCRIPTION.formatted("Open Data"), Module.OPEN_DATA),
  OFFICIAL_MEDICAL_SERVICE_LEADER(
      LEADER_KEYCLOAK_NAME,
      LEADER_DESCRIPTION.formatted("Amtsärztlicher Dienst"),
      Module.OFFICIAL_MEDICAL_SERVICE),

  BASE_PERSONS_READ(
      READ_PERMISSION_TEMPLATE.formatted("Personen (Stammdaten-Konverter)"),
      "Kann Personen(daten) aus dem Stammdaten-Konverter abrufen",
      Module.BASE),
  BASE_PERSONS_WRITE(
      WRITE_PERMISSION_TEMPLATE.formatted("Personen (Stammdaten-Konverter)"),
      "Kann Personen in dem Stammdaten-Konverter anlegen, aktualisieren und  zur Löschung markieren (z. B. zum Entfernen von Draft-Vorgängen und Spamdaten). Enthält zusätzlich Leseberechtigungen.",
      Module.BASE,
      BASE_PERSONS_READ),
  BASE_PERSONS_DELETE(
      DELETE_PERMISSION_TEMPLATE.formatted("Personen (Stammdaten-Konverter)"),
      "Kann Personen im Rahmen eines Archivierungsvorgangs in dem Stammdaten-Konverter zur Löschung markieren",
      Module.BASE),

  BASE_FACILITIES_READ(
      READ_PERMISSION_TEMPLATE.formatted("Einrichtungen (Stammdaten-Konverter)"),
      "Kann Einrichtungen aus dem Stammdaten-Konverter abrufen",
      Module.BASE),
  BASE_FACILITIES_WRITE(
      WRITE_PERMISSION_TEMPLATE.formatted("Einrichtungen (Stammdaten-Konverter)"),
      "Kann Einrichtungen in dem Stammdaten-Konverter anlegen, aktualisieren und zur Löschung markieren (z. B. zum Entfernen von Draft-Vorgängen und Spamdaten). Enthält zusätzlich Leseberechtigungen.",
      Module.BASE,
      BASE_FACILITIES_READ),
  BASE_FACILITIES_DELETE(
      DELETE_PERMISSION_TEMPLATE.formatted("Einrichtungen (Stammdaten-Konverter)"),
      "Kann Einrichtungen im Rahmen eines Archivierungsvorgangs in dem Stammdaten-Konverter zur Löschung markieren",
      Module.BASE),

  BASE_LABELS_READ(
      READ_PERMISSION_TEMPLATE.formatted("Labels"),
      "Kann Labels (dienen weiterer Kategorisierung von Ressourcen und Inventarartikeln) einsehen",
      Module.BASE),
  BASE_LABELS_WRITE(
      WRITE_PERMISSION_TEMPLATE.formatted("Labels"),
      "Kann neue Labels (dienen weiterer Kategorisierung von Ressourcen und Inventarartikeln) erstellen. Enthält zusätzlich die entsprechende Leseberechtigung.",
      Module.BASE,
      BASE_LABELS_READ),

  BASE_RESOURCES_READ(
      READ_PERMISSION_TEMPLATE.formatted("Ressourcen"),
      "Kann Ressourcen abrufen. Enthalt zusätzlich Leseberechtigung Labels.",
      Module.BASE,
      BASE_LABELS_READ),
  BASE_RESOURCES_WRITE(
      WRITE_PERMISSION_TEMPLATE.formatted("Ressourcen"),
      "Kann neue Ressourcen anlegen, bearbeiten, diesen Labels zuordnen und Services im Kalender eintragen. Enthält zusätzlich die entsprechende Leseberechtigung.",
      Module.BASE,
      BASE_RESOURCES_READ),

  BASE_INVENTORY_READ(
      READ_PERMISSION_TEMPLATE.formatted("Inventar"),
      "Kann Inventarartikel abrufen. Enthalt zusätzlich Leseberechtigung Labels.",
      Module.BASE,
      BASE_LABELS_READ),
  BASE_INVENTORY_USE(
      WRITE_PERMISSION_TEMPLATE.formatted("Inventarbuchungen"),
      "Kann Inventarartikel buchen, die Buchungen bearbeiten und die Historie der Buchungen einsehen. Enthält zusätzlich die entsprechende Leseberechtigung.",
      Module.BASE,
      BASE_INVENTORY_READ),
  BASE_INVENTORY_ADMINISTRATE(
      WRITE_PERMISSION_TEMPLATE.formatted("Inventar"),
      "Kann Inventarartikel hinzufügen, bearbeiten, deren Bestand korrigieren und diesen Labels zuordnen. Enthält zusätzlich die entsprechende Leseberechtigung.",
      Module.BASE,
      BASE_INVENTORY_USE),

  BASE_CONTACTS_READ(
      READ_PERMISSION_TEMPLATE.formatted("Kontaktmanagement"),
      "Kann Kontakte sowie deren Historie einsehen",
      Module.BASE),
  BASE_CONTACTS_WRITE(
      WRITE_PERMISSION_TEMPLATE.formatted("Kontaktmanagement"),
      "Kann Kontakte hinzufügen, bearbeiten, aus einer vCard (vcf-Datei) importieren und verschiedene Kontakte zusammenführen. Enthält zusätzlich die entsprechende Leseberechtigung.",
      Module.BASE,
      BASE_CONTACTS_READ),

  BASE_MUK_FACILITY_LINK_WRITE(
      WRITE_PERMISSION_TEMPLATE.formatted("Muk Facility Links"),
      "Kann Verknüpfungen zwischen MUK Usern und Facilities (Stammdaten-Konverter) anlegen",
      Module.BASE),
  BASE_BUND_ID_PERSON_LINK_WRITE(
      WRITE_PERMISSION_TEMPLATE.formatted("BundId Person Links"),
      "Kann Verknüpfungen zwischen BundId Usern und Personen (Stammdaten-Konverter) anlegen",
      Module.BASE),

  BASE_GDPR_PROCEDURE_REVIEW(
      "Limitierte Lese- und Schreibberechtigung %s für Module".formatted("DSGVO-Prozesse"),
      "Kann SachstandsIds zu DSGVO-Prozessen abfragen und DownloadIds anlegen",
      Module.BASE),
  BASE_GDPR_PROCEDURE_READ(
      READ_PERMISSION_TEMPLATE.formatted("DSGVO-Prozesse"),
      "Kann DSGVO-Prozesse (Löschanfrage, Widerspruch und Datenauskunft) abrufen",
      Module.BASE),
  BASE_GDPR_PROCEDURE_WRITE(
      WRITE_PERMISSION_TEMPLATE.formatted("DSGVO-Prozesse"),
      "Kann DSGVO-Prozesse (Löschanfrage, Widerspruch und Datenauskunft) initiieren und bearbeiten. Enthält zusätzlich die entsprechende Leseberechtigung.",
      Module.BASE,
      BASE_GDPR_PROCEDURE_READ,
      BASE_PERSONS_READ,
      BASE_FACILITIES_READ,
      BASE_BUND_ID_PERSON_LINK_WRITE,
      BASE_MUK_FACILITY_LINK_WRITE),
  BASE_GDPR_VALIDATION_TASK_CLEANUP(
      DELETE_PERMISSION_TEMPLATE.formatted("DSGVO-Prüfaufträge"),
      "Kann DSGVO-Prüfaufträge und Downloadpakete in Fachmodulen löschen",
      Module.BASE),

  BASE_PROCEDURES_READ(
      READ_PERMISSION_TEMPLATE.formatted("Vorgänge"),
      "Kann Vorgänge (Dashboard) abrufen",
      Module.BASE),
  BASE_PROCEDURE_METRICS_READ(
      READ_PERMISSION_TEMPLATE.formatted("Vorgangsmetriken eines Gesundheitsamtes"),
      "Kann Kennzahlen zu Vorgängen eines Gesundheitsamtes abrufen",
      Module.BASE),

  BASE_MAIL_SEND("Mails senden", Module.BASE),
  BASE_GLOBAL_CALENDARS_WRITE(
      WRITE_PERMISSION_TEMPLATE.formatted("Globaler Kalender"),
      "Kann einen globalen Kalender erstellen",
      Module.BASE),
  BASE_CALENDAR_BUSINESS_EVENTS_WRITE(
      READ_AND_WRITE_PERMISSION_TEMPLATE.formatted("Kalendertermine von Fachmodulen"),
      "Kann Kalendertermine für ein Fachmodul erstellen, abrufen, updaten und löschen",
      Module.BASE),
  BASE_TASKS_READ(
      READ_PERMISSION_TEMPLATE.formatted("Aufgaben"),
      "Kann die Aggregation der Aufgaben für das Dashboard abrufen",
      Module.BASE),
  BASE_ACCESS_CODE_USER_ADMIN(
      "Niederschwellige Zugriffe verwalten",
      "Kann Zugänge mit niederschwelligem Zugriff (Zugangscode für z.B. Terminverschiebung in einem einzelnen Vorgang) in Keycloak erstellen und löschen",
      Module.BASE),
  BASE_ACCESS_CODE_USER_VERIFY(
      "Niederschwellige Zugriffe verifizieren",
      "Kann Geheminisse zu Zugängen mit niederschwelligem Zugriff (Zugangscode für z.B. Terminverschiebung in einem einzelnen Vorgang) mit Keycloak verifizieren",
      Module.BASE),

  STATISTICS_STATISTICS_READ(
      READ_PERMISSION_TEMPLATE.formatted("Statistiken"),
      "Kann verfügbare Datenressourcen einsehen und Vorlagen abrufen, die Prozesskennzahlen aus verschiedenen Quellen zu statistischen Zwecken zusammentragen. Kann eine Liste über durchgeführte statistische Auswertungen einsehen.",
      Module.STATISTICS),
  STATISTICS_STATISTICS_WRITE(
      WRITE_PERMISSION_TEMPLATE.formatted("Statistiken"),
      "Kann Vorlagen erstellen und löschen, die Prozesskennzahlen aus verschiedenen Quellen zu statistischen Zwecken zusammentragen. Kann mithilfe einer solchen Vorlage einen Datensatz erstellen und statistisch auswerten lassen sowie die Resultate abrufen",
      Module.STATISTICS),
  STATISTICS_STATISTICS_TECHNICAL_USER(
      "Technischer User Statistiken",
      "Technischer User des Statistik-Moduls, um die konkreten Statistikdaten von den Fachmodulen zusammenzutragen, nicht für echte User bestimmt",
      Module.STATISTICS),

  INBOX_PROCEDURE_WRITE(
      WRITE_PERMISSION_TEMPLATE.formatted("Posteingangsvorgänge"),
      "Kann Posteingangsvorgänge (inkl. Fileupload) erstellen",
      Module.MAILROOM),
  PROCEDURE_ARCHIVE(
      READ_AND_WRITE_PERMISSION_TEMPLATE.formatted("Archivierung Vorgänge"),
      "Kann archivierbare Vorgänge abrufen, und diese für den Archiv Admin als relevant markieren",
      Module.ARCHIVE),
  PROCEDURE_ARCHIVE_ADMIN(
      READ_AND_DELETE_PERMISSION_TEMPLATE.formatted("Archivierung Vorgänge"),
      "Kann die vom Archivar markierten Vorgänge abrufen, diese exportieren und löschen",
      Module.ARCHIVE),

  AUDITLOG_FILE_SEND(
      "Berechtigung zum Senden von Audit-Log-Dateien an den Audit-Log-Service",
      Module.AUDIT_LOG_SERVICE),
  AUDITLOG_DECRYPT_AND_ACCESS(
      "Berechtigung für die Entschlüsselung und den Abruf von Audit-Log-Dateien vom Audit-Log-Service",
      Module.AUDIT_LOG_SERVICE),
  AUDITLOG_AUTHORIZE_ACCESS(
      "Berechtigung für die Freigabe des Abrufs von Audit-Log-Dateien vom Audit-Log-Service",
      Module.AUDIT_LOG_SERVICE),
  AUDITLOG_PUBLIC_KEYS_READ(
      "Berechtigung zum Abruf der öffentlichen Schlüssel von Usern, welche Audit-Log-Dateien entschlüsseln dürfen",
      Module.BASE),

  MEDICAL_REGISTRY_IMPORT(
      "Berechtigung zum Importieren von Berufskartei-Daten", Module.MEDICAL_REGISTRY),

  // TODO ISSUE-3317: Add keycloak descriptions for the inspection module
  INSPECTION_NOTIFICATIONS_READ("Benachrichtigungen erhalten", Module.INSPECTION),
  INSPECTION_PROCEDURE_EDIT("Begehungsvorgänge bearbeiten", Module.INSPECTION),
  INSPECTION_PROCEDURE_ASSIGN("Begehungen anderen Mitarbeitenden zuweisen", Module.INSPECTION),
  INSPECTION_OBJECTTYPES_READ("Objekttypen lesen", Module.INSPECTION),
  INSPECTION_OBJECTTYPES_WRITE(
      "Objekttypen bearbeiten", Module.INSPECTION, INSPECTION_OBJECTTYPES_READ),
  INSPECTION_CHECKLISTDEFINITIONS_READ(
      READ_PERMISSION_TEMPLATE.formatted("Checklisten-Definitionen"),
      "Kann Checklisten-Definitionen einsehen.",
      Module.INSPECTION,
      INSPECTION_OBJECTTYPES_READ),
  INSPECTION_CHECKLISTDEFINITIONS_WRITE(
      READ_AND_WRITE_PERMISSION_TEMPLATE.formatted("Checklisten-Definitionen"),
      "Kann Checklisten-Definitionen einsehen und bearbeiten.",
      Module.INSPECTION,
      INSPECTION_CHECKLISTDEFINITIONS_READ),
  INSPECTION_CORECHECKLISTDEFINITIONS_EDIT(
      "Kern-Checklisten-Definitionen bearbeiten",
      Module.INSPECTION,
      INSPECTION_CHECKLISTDEFINITIONS_WRITE),
  INSPECTION_CENTRALREPOSITORY_READ(
      "Checklisten-Definitionen aus Zentralen Diensten laden", Module.INSPECTION),
  INSPECTION_CENTRALREPOSITORY_WRITE(
      "Checklisten-Definitionen in Zentralen Diensten bereitstellen",
      Module.INSPECTION,
      INSPECTION_CENTRALREPOSITORY_READ),
  INSPECTION_CENTRALREPOSITORY_DELETE(
      "Checklisten-Definitionen in Zentralen Diensten löschen",
      Module.INSPECTION,
      INSPECTION_CENTRALREPOSITORY_WRITE),
  INSPECTION_CENTRALREPOSITORY_WRITE_CORECHECKLISTS(
      "Kern-Checklisten-Definition in Zentralen Diensten bereitstellen", Module.INSPECTION),
  INSPECTION_IMPORT("Vorgänge importieren", Module.INSPECTION),

  SCHOOL_ENTRY_ADMIN(
      ADMIN_KEYCLOAK_NAME.formatted("Einschulungsuntersuchung"),
      Module.SCHOOL_ENTRY,
      BASE_PERSONS_READ,
      BASE_PERSONS_WRITE,
      BASE_ACCESS_CODE_USER_ADMIN,
      BASE_RESOURCES_READ,
      BASE_CALENDAR_BUSINESS_EVENTS_WRITE,
      BASE_CONTACTS_READ,
      BASE_CONTACTS_WRITE,
      BASE_GDPR_PROCEDURE_REVIEW),

  STATISTICS_STATISTICS_ADMIN(
      ADMIN_KEYCLOAK_NAME.formatted("Statistik"),
      Module.STATISTICS,
      STATISTICS_STATISTICS_READ,
      STATISTICS_STATISTICS_WRITE),

  TRAVEL_MEDICINE_ADMIN(
      ADMIN_KEYCLOAK_NAME.formatted("Impfberatung"),
      Module.TRAVEL_MEDICINE,
      BASE_PERSONS_READ,
      BASE_PERSONS_WRITE,
      BASE_ACCESS_CODE_USER_ADMIN,
      BASE_CALENDAR_BUSINESS_EVENTS_WRITE,
      BASE_INVENTORY_ADMINISTRATE),

  MEASLES_PROTECTION_ADMIN(
      ADMIN_KEYCLOAK_NAME.formatted("Masernschutzimpfung"),
      Module.MEASLES_PROTECTION,
      BASE_PERSONS_READ,
      BASE_PERSONS_WRITE,
      BASE_FACILITIES_READ,
      BASE_FACILITIES_WRITE,
      BASE_ACCESS_CODE_USER_ADMIN,
      BASE_RESOURCES_READ,
      BASE_CALENDAR_BUSINESS_EVENTS_WRITE,
      BASE_GDPR_PROCEDURE_REVIEW),

  STI_PROTECTION_USER(
      "HIV-STI Benutzer",
      Module.STI_PROTECTION,
      BASE_PERSONS_READ, // required to access progress entries
      BASE_CALENDAR_BUSINESS_EVENTS_WRITE,
      BASE_ACCESS_CODE_USER_ADMIN,
      BASE_ACCESS_CODE_USER_VERIFY),
  STI_PROTECTION_MFA("HIV-STI MFA", Module.STI_PROTECTION, STI_PROTECTION_USER),
  STI_PROTECTION_CONSULTANT("HIV-STI Berater", Module.STI_PROTECTION, STI_PROTECTION_USER),
  STI_PROTECTION_PHYSICIAN("HIV-STI Arzt", Module.STI_PROTECTION, STI_PROTECTION_USER),
  STI_PROTECTION_ADMIN(
      ADMIN_KEYCLOAK_NAME.formatted("HIV-STI"),
      Module.STI_PROTECTION,
      STI_PROTECTION_MFA,
      STI_PROTECTION_CONSULTANT,
      STI_PROTECTION_PHYSICIAN),

  MEDICAL_REGISTRY_ADMIN(
      ADMIN_KEYCLOAK_NAME.formatted("Medizinalaufsicht"),
      Module.MEDICAL_REGISTRY,
      BASE_PERSONS_READ,
      BASE_PERSONS_WRITE,
      BASE_FACILITIES_READ,
      BASE_FACILITIES_WRITE),

  DENTAL_ADMIN(
      ADMIN_KEYCLOAK_NAME.formatted("Zahnärztlicher Dienst"),
      Module.DENTAL,
      BASE_PERSONS_READ,
      BASE_PERSONS_WRITE,
      BASE_CONTACTS_READ,
      BASE_CONTACTS_WRITE,
      BASE_GDPR_PROCEDURE_REVIEW),

  OPEN_DATA_ADMIN(ADMIN_KEYCLOAK_NAME.formatted("Open Data"), Module.OPEN_DATA),

  CHAT_MANAGEMENT_WRITE(
      READ_AND_WRITE_PERMISSION_TEMPLATE.formatted("Chat - Management"), Module.CHAT_MANAGEMENT),

  OFFICIAL_MEDICAL_SERVICE_ADMIN(
      "Amtsärztlicher Dienst Admin",
      Module.OFFICIAL_MEDICAL_SERVICE,
      BASE_PERSONS_READ,
      BASE_PERSONS_WRITE,
      BASE_FACILITIES_READ,
      BASE_FACILITIES_WRITE,
      BASE_ACCESS_CODE_USER_ADMIN,
      BASE_CALENDAR_BUSINESS_EVENTS_WRITE);

  private final String keycloakNameWithoutPrefix;
  private final String description;
  private final Module module;
  private final List<KeycloakRole> associatedRoles;

  EmployeePermissionRole(
      String keycloakNameWithoutPrefix, Module module, EmployeePermissionRole... associatedRoles) {
    this(keycloakNameWithoutPrefix, null, module, associatedRoles);
  }

  EmployeePermissionRole(
      String keycloakNameWithoutPrefix,
      String description,
      Module module,
      EmployeePermissionRole... associatedRoles) {
    this.keycloakNameWithoutPrefix = keycloakNameWithoutPrefix;
    this.description = description;
    this.module = module;
    this.associatedRoles = List.of(associatedRoles);
  }

  @Override
  public String getKeycloakNameWithoutPrefix() {
    return this.module.getDisplayName() + " - " + this.keycloakNameWithoutPrefix;
  }

  @Override
  public String getDescription() {
    return description;
  }

  @Override
  public List<KeycloakRole> getAssociatedRoles() {
    return this.associatedRoles;
  }

  private enum Module {
    BASE("Grundmodul"),
    SCHOOL_ENTRY("Einschulungsuntersuchungsmodul"),
    INSPECTION("Begehungsmodul"),
    INSPECTION_LANDESAMT("Begehungsmodul Landesamt"),
    TRAVEL_MEDICINE("Impfberatung"),
    MEASLES_PROTECTION("Masernschutzimpfung"),
    CHAT_MANAGEMENT("Chat-Management"),
    STATISTICS("Statistik"),
    MAILROOM("Poststelle"),
    ARCHIVE("Archiv"),
    AUDIT_LOG_SERVICE("Audit-Log-Service"),
    STI_PROTECTION("HIV-STI-Service"),
    MEDICAL_REGISTRY("Medizinalaufsicht"),
    DENTAL("Zahnärztlicher Dienst"),
    OPEN_DATA("Open Data"),
    OFFICIAL_MEDICAL_SERVICE("Amtsärztlicher Dienst");

    private final String displayName;

    Module(String displayName) {
      this.displayName = displayName;
    }

    String getDisplayName() {
      return displayName;
    }
  }
}
