/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.importer;

import static de.eshg.lib.xlsximport.ImportStatus.DUPLICATE_WITHIN_LIST;
import static de.eshg.lib.xlsximport.ImportStatus.ERROR_INPUT_DATA;
import static de.eshg.lib.xlsximport.ImportStatus.IMPORTED_SUCCESSFULLY;

import de.eshg.dental.ChildService;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.mapper.ChildMapper;
import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.Importer;
import de.eshg.lib.xlsximport.RowReader;
import java.util.Collection;
import java.util.UUID;
import org.apache.poi.xssf.usermodel.XSSFSheet;

public class DentalImporter extends Importer<DentalRowValues, DentalColumn> {

  private final UUID institutionId;
  private final int schoolYear;
  private final ChildService childService;

  public DentalImporter(
      XSSFSheet sheet,
      RowReader<DentalRowValues, DentalColumn> rowReader,
      FeedbackColumnAccessor feedbackColumnAccessor,
      UUID institutionId,
      int schoolYear,
      ChildService childService) {
    super(sheet, rowReader, feedbackColumnAccessor);
    this.institutionId = institutionId;
    this.schoolYear = schoolYear;
    this.childService = childService;
  }

  @Override
  protected void readRowsAndEvaluateActions() {
    Collection<DentalRowValues> allRows = readRows().values();
    for (DentalRowValues rowValues : allRows) {
      if (rowValues.getStatus() == DUPLICATE_WITHIN_LIST || isDuplicateRow(rowValues)) {
        writeStatus(rowValues.getRow(), DUPLICATE_WITHIN_LIST);
        stats.countDuplicated();
      } else if (rowValues.isValid()) {
        validRows.importableRows().add(rowValues);
        stats.countCreated();
      } else {
        writeStatus(rowValues.getRow(), ERROR_INPUT_DATA);
        stats.countFailed();
      }
    }
  }

  @Override
  protected void createProceduresAndWriteResults() {
    for (DentalRowValues importableRow : validRows.importableRows()) {
      Child child =
          childService.createChild(
              ChildMapper.mapImportDataToCreateChildRequest(
                  importableRow.getChild(), institutionId, schoolYear));

      writeStatusAndEntityId(importableRow.getRow(), IMPORTED_SUCCESSFULLY, child.getExternalId());
    }
  }

  @Override
  protected void mergeProceduresAndWriteResults() {
    // Merge is not implemented
  }
}
