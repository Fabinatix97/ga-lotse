/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.export;

import static de.eshg.prostituteprotection.ProstituteProtectionService.formatProcedureType;

import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.lib.xlsximport.util.XlsxUtil;
import de.eshg.prostituteprotection.ProstituteProtectionService;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedurePersonSearchParameters;
import de.eshg.prostituteprotection.crypto.DecryptedPersonalDataDto;
import de.eshg.prostituteprotection.domain.data.ProcedureGdprExportData;
import de.eshg.prostituteprotection.domain.model.Consultation;
import de.eshg.prostituteprotection.domain.model.Language;
import de.eshg.prostituteprotection.domain.model.PersonalData;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionTask;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.function.Supplier;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
public class ProstituteProtectionExportService {

  private static final DateTimeFormatter DATE_TIME_FORMATTER =
      DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss").withZone(ZoneId.systemDefault());
  private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy");
  private static int rowIndex = 0;
  private static XSSFCellStyle labelStyle;
  private static XSSFCellStyle valueStyle;

  private final ProstituteProtectionService prostituteProtectionService;

  public ProstituteProtectionExportService(
      ProstituteProtectionService prostituteProtectionService) {
    this.prostituteProtectionService = prostituteProtectionService;
  }

  public Resource exportGdprDataToXlsxByPersonSearch(
      ProstituteProtectionProcedurePersonSearchParameters searchParameters) {
    List<ProcedureGdprExportData> exportData =
        prostituteProtectionService.getProcedureDataForExportByPersonSearch(searchParameters);

    return exportToXlsx(exportData);
  }

  private Resource exportToXlsx(List<ProcedureGdprExportData> exportData) {
    try (XSSFWorkbook workbook = new XSSFWorkbook();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

      // Initialize cell styles once for the workbook
      labelStyle = createLabelCellStyle(workbook);
      valueStyle = createValueCellStyle(workbook);

      // Create one sheet per procedure
      for (ProcedureGdprExportData data : exportData) {
        String sheetName = createSheetName(data);
        XSSFSheet sheet = workbook.createSheet(sheetName);

        // Add key-value rows
        addKeyValueRows(sheet, data);

        // Auto-size columns
        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);
      }

      workbook.write(outputStream);
      return new ByteArrayResource(outputStream.toByteArray());
    } catch (IOException exception) {
      throw new UncheckedIOException("Unable to create GDPR export", exception);
    }
  }

  private String createSheetName(ProcedureGdprExportData data) {
    String externalId = data.procedure().procedure().getExternalId().toString();
    // Sheet names are limited to 31 characters, so we truncate if needed
    String baseName = "Vorgang-" + externalId;
    return baseName.length() > 31 ? baseName.substring(0, 31) : baseName;
  }

  private XSSFCellStyle createLabelCellStyle(XSSFWorkbook workbook) {
    XSSFCellStyle style = workbook.createCellStyle();
    style.setFont(XlsxUtil.createDefaultFont(workbook));
    return style;
  }

  private XSSFCellStyle createValueCellStyle(XSSFWorkbook workbook) {
    XSSFCellStyle style = workbook.createCellStyle();
    style.setQuotePrefixed(true);
    return style;
  }

  private void addKeyValueRows(XSSFSheet sheet, ProcedureGdprExportData data) {
    rowIndex = 0;

    ProstituteProtectionProcedure procedure = data.procedure().procedure();
    PersonalData personalData = procedure.getPersonalData();
    DecryptedPersonalDataDto decryptedPersonalData = data.decryptedPersonalData();
    Consultation consultation = data.consultation();
    List<ProgressEntry> progressEntries = procedure.getProgressEntries();
    List<ProstituteProtectionTask> tasks = procedure.getTasks();

    // Procedure basic information
    addKeyValueRow(sheet, "Vorgangs-ID", procedure.getId().toString());
    addKeyValueRow(sheet, "Externe ID", procedure.getExternalId().toString());
    addKeyValueRow(sheet, "Vorgang Version", procedure.getVersion().toString());
    addKeyValueRow(sheet, "Status", formatProcedureStatus(procedure.getProcedureStatus()));
    addKeyValueRow(sheet, "Erstellt am", formatInstant(procedure.getCreatedAt()));
    addKeyValueRow(sheet, "Geschlossen am", formatInstant(procedure.getClosedAt()));

    // Personal data (decrypted)
    addKeyValueRow(sheet, "Vorname", safeGet(() -> decryptedPersonalData.firstName()));
    addKeyValueRow(sheet, "Nachname", safeGet(() -> decryptedPersonalData.lastName()));
    addKeyValueRow(
        sheet, "Geburtsdatum", formatLocalDate(safeGet(() -> decryptedPersonalData.dateOfBirth())));

    // Personal data (other)
    addKeyValueRow(sheet, "Alias", safeGet(() -> personalData.getAlias()));
    addKeyValueRow(
        sheet, "Ausweisdokument", safeGet(() -> personalData.getDocumentType().getDescription()));
    addKeyValueRow(
        sheet,
        "Benutzerdefinierter Dokumenttyp",
        safeGet(() -> personalData.getCustomDocumentType()));
    addKeyValueRow(
        sheet, "Weitere Sprachen", safeGet(() -> formatLanguages(personalData.getLanguages())));
    addKeyValueRow(
        sheet,
        "Gültigkeit des Aufenthaltstitels",
        safeGet(() -> formatLocalDate(personalData.getResidencePermitValidityDate())));

    // Consultation type & age
    addKeyValueRow(sheet, "Konsultationsversion", consultation.getVersion().toString());
    addKeyValueRow(sheet, "Beratungsart", formatProcedureType(procedure.getProcedureType()));
    addKeyValueRow(
        sheet, "Alter bei Beratung", safeGet(() -> procedure.getAgeAtConsultation().toString()));
    addKeyValueRow(sheet, "Termin Start", formatInstant(procedure.getAppointmentStart()));

    // Consultation topics (boolean fields)
    addKeyValueRow(sheet, "Rechtsberatung", formatBoolean(consultation.isLegalAdvices()));
    addKeyValueRow(
        sheet,
        "Kranken- und Sozialversicherung",
        formatBoolean(consultation.isHealthAndSocialInsurance()));
    addKeyValueRow(sheet, "Beratungsangebote", formatBoolean(consultation.isConsultingServices()));
    addKeyValueRow(sheet, "Hilfe in Notsituationen", formatBoolean(consultation.isEmergencyHelp()));
    addKeyValueRow(sheet, "Steuerpflicht", formatBoolean(consultation.isTaxLiability()));
    addKeyValueRow(sheet, "Infomaterial", formatBoolean(consultation.isInformationMaterial()));
    addKeyValueRow(sheet, "Notlage / Zwangslage", formatBoolean(consultation.isPredicament()));
    addKeyValueRow(
        sheet, "Krankheitsprävention", formatBoolean(consultation.isDiseasePrevention()));
    addKeyValueRow(sheet, "Empfängnisverhütung", formatBoolean(consultation.isBirthControl()));
    addKeyValueRow(sheet, "Schwangerschaft", formatBoolean(consultation.isPregnancy()));
    addKeyValueRow(
        sheet, "Alkohol- / Drogengebrauch", formatBoolean(consultation.isAlcoholAndDrugUsage()));
    addKeyValueRow(sheet, "Weitervermittlung § 19", formatBoolean(consultation.isReferral()));
    addKeyValueRow(sheet, "Beratungsbedarf / Clearing", formatBoolean(consultation.isClearing()));

    // Consultation language & interpreter (NOTE: Interpreter names excluded per GDPR)
    addKeyValueRow(
        sheet,
        "Sprache der Beratung",
        safeGet(() -> consultation.getLanguageOfConsultation().name()));
    addKeyValueRow(
        sheet, "Dolmetscher hinzugezogen", formatBoolean(consultation.isInterpreterConsulted()));

    // Certificate information (NOTE: Certificate PDFs excluded)
    addKeyValueRow(
        sheet,
        "Zertifikat mit Alias erstellt",
        safeGet(() -> formatBoolean(procedure.getCertificateWithAliasCreated())));
    addKeyValueRow(sheet, "Anzahl Zertifikate", String.valueOf(data.encryptedFiles().size()));

    // Progress entries (nested collection)
    for (int i = 0; i < progressEntries.size(); i++) {
      ProgressEntry entry = progressEntries.get(i);
      String prefix = "ProgressEntries[" + i + "]";

      addKeyValueRow(sheet, prefix + ".Externe ID", entry.getExternalId().toString());
      addKeyValueRow(sheet, prefix + ".Typ", getProgressEntryType(entry));
      addKeyValueRow(sheet, prefix + ".Erstellt am", formatInstant(entry.getCreatedAt()));
      addKeyValueRow(sheet, prefix + ".Geändert am", formatInstant(entry.getModifiedAt()));

      // Type-specific fields (exclude PSEUDONYMIZED fields like createdBy, triggeredBy)
      if (entry instanceof ManualProgressEntry manualEntry) {
        addKeyValueRow(
            sheet,
            prefix + ".Manuelle Fortschritts-Art",
            safeGet(() -> manualEntry.getManualProgressEntryType().name()));
        // Note: note field is SENSITIVE, but it's the data subject's note, so include it
        addKeyValueRow(sheet, prefix + ".Notiz", safeGet(manualEntry::getNote));
      } else if (entry instanceof SystemProgressEntry systemEntry) {
        addKeyValueRow(
            sheet,
            prefix + ".System Fortschritts-Typ",
            safeGet(systemEntry::getSystemProgressEntryType));
        addKeyValueRow(
            sheet, prefix + ".Auslöser-Typ", safeGet(() -> systemEntry.getTriggerType().name()));
        // changeDescription is SENSITIVE but relevant to the data subject
        addKeyValueRow(
            sheet, prefix + ".Änderungsbeschreibung", safeGet(systemEntry::getChangeDescription));
      }
    }

    for (int i = 0; i < tasks.size(); i++) {
      ProstituteProtectionTask task = tasks.get(i);
      String prefix = "Tasks[" + i + "]";

      addKeyValueRow(sheet, prefix + ".Externe ID", task.getExternalId().toString());
      addKeyValueRow(sheet, prefix + ".Aufgabentyp", formatTaskType(task.getTaskType()));
      addKeyValueRow(sheet, prefix + ".Aufgabenstatus", formatTaskStatus(task.getTaskStatus()));
      addKeyValueRow(sheet, prefix + ".Erstellt am", formatInstant(task.getCreatedAt()));
      addKeyValueRow(sheet, prefix + ".Geändert am", formatInstant(task.getModifiedAt()));
      addKeyValueRow(sheet, prefix + ".Fällig am", formatInstant(task.getDueAt()));
      // NOTE: currentAssignment, assignmentHistory, and notifications are excluded (PSEUDONYMIZED)
    }
  }

  private static void addKeyValueRow(XSSFSheet sheet, String label, String value) {
    // Only add row if value is not null
    if (value == null) {
      return;
    }

    XSSFRow row = sheet.createRow(rowIndex);

    // Column 0: Label
    Cell labelCell = row.createCell(0);
    XlsxUtil.writeValue(labelCell, label, labelStyle);

    // Column 1: Value
    Cell valueCell = row.createCell(1);
    XlsxUtil.writeValue(valueCell, value, valueStyle);

    rowIndex++;
  }

  private String getProgressEntryType(ProgressEntry entry) {
    if (entry instanceof ManualProgressEntry) {
      return "ManualProgressEntry";
    } else if (entry instanceof SystemProgressEntry) {
      return "SystemProgressEntry";
    } else {
      return "ProgressEntry";
    }
  }

  // Formatting methods
  private static String formatInstant(Instant instant) {
    return instant != null ? DATE_TIME_FORMATTER.format(instant) : null;
  }

  private static String formatLocalDate(LocalDate date) {
    return date != null ? DATE_FORMATTER.format(date) : null;
  }

  private static String formatProcedureStatus(ProcedureStatus status) {
    return switch (status) {
      case DRAFT -> "Entwurf";
      case OPEN -> "Offen";
      case IN_PROGRESS -> "In Arbeit";
      case CLOSED -> "Geschlossen";
      case ABORTED -> "Abgebrochen";
    };
  }

  private static String formatTaskType(TaskType type) {
    return type != null ? type.name() : null;
  }

  private static String formatTaskStatus(TaskStatus status) {
    return status != null ? status.name() : null;
  }

  private static String formatBoolean(boolean value) {
    return value ? "Ja" : "Nein";
  }

  private static String formatLanguages(List<Language> languages) {
    if (languages == null || languages.isEmpty()) {
      return null;
    }
    return String.join(", ", languages.stream().map(Language::name).toList());
  }

  private static <T> T safeGet(Supplier<T> supplier) {
    try {
      return supplier.get();
    } catch (NullPointerException e) {
      return null;
    }
  }
}
