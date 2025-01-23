/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.importer;

import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.ImportStatus;
import de.eshg.lib.xlsximport.Importer;
import de.eshg.lib.xlsximport.RowData;
import de.eshg.medicalregistry.MedicalRegistryService;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.apache.commons.collections4.ListUtils;
import org.apache.poi.xssf.usermodel.XSSFSheet;

public class MedicalRegistryImporter extends Importer<MedicalRegistryRow, MedicalRegistryColumn> {

  private final MedicalRegistryService medicalRegistryService;

  private final int batchSize;

  public MedicalRegistryImporter(
      XSSFSheet sheet,
      List<MedicalRegistryColumn> actualColumns,
      MedicalRegistryService medicalRegistryService,
      int batchSize) {
    super(sheet, new MedicalRegistryRowReader(sheet), new FeedbackColumnAccessor(actualColumns));
    this.medicalRegistryService = medicalRegistryService;
    if (batchSize < 1 || batchSize > 10_000) {
      throw new IllegalArgumentException("batchSize must be between 1 and 10_000");
    }
    this.batchSize = batchSize;
  }

  @Override
  protected void evaluateActionsForRows(List<MedicalRegistryRow> rows) {
    Set<UUID> existingIds =
        medicalRegistryService.findExistingProcedureIds(
            rows.stream().map(RowData::getEntityId).filter(Objects::nonNull).toList(), batchSize);
    for (MedicalRegistryRow row : rows) {
      if (row.getEntityId() != null) {
        if (existingIds.contains(row.getEntityId())) {
          writeStatus(row, ImportStatus.IMPORTED_PREVIOUSLY);
          stats.countPreviouslyImported();
        } else {
          writeStatus(row, ImportStatus.INVALID_ENTITY_ID);
          stats.countFailed();
        }
      } else if (isDuplicateRow(row)) {
        markAsDuplicateWithinList(row);
      } else if (row.isValid()) {
        addToImportableRows(row);
      } else {
        writeStatus(row, ImportStatus.ERROR_INPUT_DATA);
        stats.countFailed();
      }
    }
  }

  @Override
  protected void createEntitiesAndWriteResults(List<MedicalRegistryRow> importableRows) {
    ListUtils.partition(importableRows, batchSize).forEach(this::persistRows);
  }

  private void persistRows(List<MedicalRegistryRow> rows) {
    medicalRegistryService.createProceduresFromImport(rows).forEach(this::writeResult);
  }

  private void writeResult(MedicalRegistryRow row, Optional<UUID> optionalProcedureId) {
    if (optionalProcedureId.isPresent()) {
      writeStatusAndEntityId(row, ImportStatus.IMPORTED_SUCCESSFULLY, optionalProcedureId.get());
      stats.countCreated();
    } else {
      writeStatus(row, ImportStatus.EXCEPTION);
      stats.countFailed();
    }
  }
}
