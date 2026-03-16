/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import de.eshg.config.domain.Initializable;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.appointmentblock.api.LocationSelectionMode;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.schoolentry.api.DocumentTypes;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderBy;
import java.util.LinkedHashSet;
import java.util.Set;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.PUBLIC)
public class SchoolEntryConfig extends BaseEntity implements Initializable {

  @Column(nullable = false)
  private boolean initialized = false;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private LocationSelectionMode locationSelectionMode;

  @Column(nullable = false)
  private boolean directProcedureTypeAssignmentOnImport;

  @Column(nullable = false)
  private String pdfDocumentAccentColor;

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(
      name = "documents_with_employee_info",
      joinColumns = @JoinColumn(name = "school_entry_config_id", nullable = false))
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @OrderBy
  @Column(name = "document_type", nullable = false)
  private Set<DocumentTypes> documentsWithEmployeeInfo = new LinkedHashSet<>();

  @Column(nullable = false)
  private boolean invitationIncludePerson;

  @Column(nullable = false)
  private boolean invitationIncludeRoom;

  @Override
  public boolean isInitialized() {
    return initialized;
  }

  @Override
  public void setInitialized(boolean initialized) {
    this.initialized = initialized;
  }

  public LocationSelectionMode getLocationSelectionMode() {
    return locationSelectionMode;
  }

  public void setLocationSelectionMode(LocationSelectionMode locationSelectionMode) {
    this.locationSelectionMode = locationSelectionMode;
  }

  public boolean isDirectProcedureTypeAssignmentOnImport() {
    return directProcedureTypeAssignmentOnImport;
  }

  public void setDirectProcedureTypeAssignmentOnImport(
      boolean directProcedureTypeAssignmentOnImport) {
    this.directProcedureTypeAssignmentOnImport = directProcedureTypeAssignmentOnImport;
  }

  public String getPdfDocumentAccentColor() {
    return pdfDocumentAccentColor;
  }

  public void setPdfDocumentAccentColor(String pdfDocumentAccentColor) {
    this.pdfDocumentAccentColor = pdfDocumentAccentColor;
  }

  public Set<DocumentTypes> getDocumentsWithEmployeeInfo() {
    return documentsWithEmployeeInfo;
  }

  public void setDocumentsWithEmployeeInfo(Set<DocumentTypes> documentsWithEmployeeInfo) {
    this.documentsWithEmployeeInfo = documentsWithEmployeeInfo;
  }

  public boolean isInvitationIncludePerson() {
    return invitationIncludePerson;
  }

  public void setInvitationIncludePerson(boolean invitationIncludePerson) {
    this.invitationIncludePerson = invitationIncludePerson;
  }

  public boolean isInvitationIncludeRoom() {
    return invitationIncludeRoom;
  }

  public void setInvitationIncludeRoom(boolean invitationIncludeRoom) {
    this.invitationIncludeRoom = invitationIncludeRoom;
  }
}
