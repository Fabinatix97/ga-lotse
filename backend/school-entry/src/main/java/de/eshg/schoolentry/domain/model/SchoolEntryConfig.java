/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import de.eshg.config.domain.Initializable;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.appointmentblock.api.LocationSelectionMode;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
}
