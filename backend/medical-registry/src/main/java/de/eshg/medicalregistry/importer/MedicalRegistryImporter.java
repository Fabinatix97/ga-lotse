/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.importer;

import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.ImportStatus;
import de.eshg.lib.xlsximport.ImportValidator;
import de.eshg.lib.xlsximport.Importer;
import de.eshg.lib.xlsximport.RowValues;
import de.eshg.medicalregistry.MedicalRegistryService;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.apache.commons.collections4.ListUtils;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;

public class MedicalRegistryImporter
    extends Importer<MedicalRegistryRowValues, MedicalRegistryColumn> {

  private final MedicalRegistryService medicalRegistryService;

  private final int batchSize;

  public MedicalRegistryImporter(
      XSSFSheet sheet, MedicalRegistryService medicalRegistryService, int batchSize) {
    super(sheet, new MedicalRegistryRowReader(sheet), feedbackColumnAccessor(sheet));
    this.medicalRegistryService = medicalRegistryService;
    if (batchSize < 1 || batchSize > 10_000) {
      throw new IllegalArgumentException("batchSize must be between 1 and 10_000");
    }
    this.batchSize = batchSize;
  }

  @Override
  protected void readRowsAndEvaluateActions() {
    Collection<MedicalRegistryRowValues> rowValuesCollection = readRows().values();
    Set<UUID> existingIds =
        medicalRegistryService.findExistingProcedureIds(
            rowValuesCollection.stream()
                .map(RowValues::getProcedureId)
                .filter(Objects::nonNull)
                .toList(),
            batchSize);
    for (MedicalRegistryRowValues rowValues : rowValuesCollection) {
      if (rowValues.getProcedureId() != null) {
        if (existingIds.contains(rowValues.getProcedureId())) {
          writeStatus(rowValues.getRow(), ImportStatus.IMPORTED_PREVIOUSLY);
          stats.countPreviouslyImported();
        } else {
          writeStatus(rowValues.getRow(), ImportStatus.INVALID_PROCEDURE_ID);
          stats.countFailed();
        }
      } else if (rowValues.getStatus() == ImportStatus.DUPLICATE_WITHIN_LIST
          || isDuplicateRow(rowValues)) {
        writeStatus(rowValues.getRow(), ImportStatus.DUPLICATE_WITHIN_LIST);
        stats.countDuplicated();
      } else if (rowValues.isValid()) {
        addToImportableRows(rowValues);
      } else {
        writeStatus(rowValues.getRow(), ImportStatus.ERROR_INPUT_DATA);
        stats.countFailed();
      }
    }
  }

  @Override
  protected void createProceduresAndWriteResults() {
    ListUtils.partition(validRows.importableRows(), batchSize).forEach(this::persistRows);
  }

  @Override
  protected void mergeProceduresAndWriteResults() {}

  private void addToImportableRows(MedicalRegistryRowValues rowValues) {
    validRows.importableRows().add(rowValues);
  }

  private void persistRows(List<MedicalRegistryRowValues> rowValues) {
    medicalRegistryService.createProceduresFromImport(rowValues).forEach(this::writeResult);
  }

  private void writeResult(Row row, Optional<UUID> optionalProcedureId) {
    if (optionalProcedureId.isPresent()) {
      writeStatusAndEntityId(row, ImportStatus.IMPORTED_SUCCESSFULLY, optionalProcedureId.get());
      stats.countCreated();
    } else {
      writeStatus(row, ImportStatus.EXCEPTION);
      stats.countFailed();
    }
  }

  private static FeedbackColumnAccessor feedbackColumnAccessor(XSSFSheet sheet) {
    return new FeedbackColumnAccessor(
        ImportValidator.validateHeaderFormat(MedicalRegistryColumn.values(), sheet));
  }
}
