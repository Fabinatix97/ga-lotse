/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.config;

import de.eshg.testhelper.ResettableProperties;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.time.MonthDay;
import java.time.Period;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.schoolentry")
public final class SchoolEntryProperties implements ResettableProperties {

  private @NotNull Period bulkCreateAppointmentsMinLeadTime;
  private @NotNull @Valid Citizens citizens;
  private @NotNull MonthDay maxDateOfBirthForRegularSchoolEntry;
  private boolean maxDateOfBirthForRegularSchoolEntryIsInclusive;
  private @NotNull Integer maxNumberOfImportRows = 10_000;
  private boolean directProcedureTypeAssignmentOnImport;
  private @NotNull URI privacyNoticeLocation;
  private @NotNull URI privacyPolicyLocation;
  private @NotNull SchoolEntryProperties.OpeningHours openingHours;
  private @NotBlank String pdfDocumentAccentColor;

  public Period getBulkCreateAppointmentsMinLeadTime() {
    return bulkCreateAppointmentsMinLeadTime;
  }

  public Citizens getCitizens() {
    return citizens;
  }

  public MonthDay getMaxDateOfBirthForRegularSchoolEntry() {
    return maxDateOfBirthForRegularSchoolEntry;
  }

  public boolean isMaxDateOfBirthForRegularSchoolEntryIsInclusive() {
    return maxDateOfBirthForRegularSchoolEntryIsInclusive;
  }

  public Integer getMaxNumberOfImportRows() {
    return maxNumberOfImportRows;
  }

  public void setMaxNumberOfImportRows(Integer maxNumberOfImportRows) {
    this.maxNumberOfImportRows = maxNumberOfImportRows;
  }

  public void setMaxDateOfBirthForRegularSchoolEntryIsInclusive(
      boolean maxDateOfBirthForRegularSchoolEntryIsInclusive) {
    this.maxDateOfBirthForRegularSchoolEntryIsInclusive =
        maxDateOfBirthForRegularSchoolEntryIsInclusive;
  }

  public void setMaxDateOfBirthForRegularSchoolEntry(MonthDay maxDateOfBirthForRegularSchoolEntry) {
    this.maxDateOfBirthForRegularSchoolEntry = maxDateOfBirthForRegularSchoolEntry;
  }

  public void setCitizens(Citizens citizens) {
    this.citizens = citizens;
  }

  public void setBulkCreateAppointmentsMinLeadTime(Period bulkCreateAppointmentsMinLeadTime) {
    this.bulkCreateAppointmentsMinLeadTime = bulkCreateAppointmentsMinLeadTime;
  }

  public boolean isDirectProcedureTypeAssignmentOnImport() {
    return directProcedureTypeAssignmentOnImport;
  }

  public void setDirectProcedureTypeAssignmentOnImport(
      boolean directProcedureTypeAssignmentOnImport) {
    this.directProcedureTypeAssignmentOnImport = directProcedureTypeAssignmentOnImport;
  }

  public URI getPrivacyNoticeLocation() {
    return privacyNoticeLocation;
  }

  public void setPrivacyNoticeLocation(URI privacyNoticeLocation) {
    this.privacyNoticeLocation = privacyNoticeLocation;
  }

  public URI getPrivacyPolicyLocation() {
    return privacyPolicyLocation;
  }

  public void setPrivacyPolicyLocation(URI privacyPolicyLocation) {
    this.privacyPolicyLocation = privacyPolicyLocation;
  }

  public record Citizens(
      @NotNull Period freeAppointmentsMinLeadTime, @NotNull Period freeAppointmentsMaxLeadTime) {}

  public SchoolEntryProperties.OpeningHours getOpeningHours() {
    return openingHours;
  }

  public void setOpeningHours(SchoolEntryProperties.OpeningHours openingHours) {
    this.openingHours = openingHours;
  }

  public record OpeningHours(@NotEmpty List<String> de, @NotEmpty List<String> en) {}

  public String getPdfDocumentAccentColor() {
    return pdfDocumentAccentColor;
  }

  public void setPdfDocumentAccentColor(String pdfDocumentAccentColor) {
    this.pdfDocumentAccentColor = pdfDocumentAccentColor;
  }
}
