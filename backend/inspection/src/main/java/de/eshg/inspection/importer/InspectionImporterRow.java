/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.importer;

import static org.apache.commons.lang3.StringUtils.isBlank;

import de.eshg.lib.xlsximport.RowData;

class InspectionImporterRow extends RowData<InspectionImporterRow> {
  private ImportInspectionFacility facility;
  private ImportInspection inspection;

  public ImportInspectionFacility getFacility() {
    return facility;
  }

  public void setFacility(ImportInspectionFacility facility) {
    this.facility = facility;
  }

  public ImportInspection getInspection() {
    return inspection;
  }

  public void setInspection(ImportInspection inspection) {
    this.inspection = inspection;
  }

  public boolean hasImportId() {
    return !isBlank(facility.importId());
  }

  @Override
  public boolean isDuplicateRow(InspectionImporterRow other) {
    return facility.equals(other.facility) && inspection.equals(other.inspection);
  }
}
