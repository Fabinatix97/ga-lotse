/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import static de.eshg.lib.xlsximport.ImportStatus.DUPLICATE_IN_ASSET;
import static de.eshg.lib.xlsximport.ImportStatus.MERGED_SUCCESSFULLY;

import de.eshg.base.centralfile.api.person.PersonKeyAttributes;
import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.RowReader;
import de.eshg.schoolentry.SchoolEntryService;
import de.eshg.schoolentry.business.model.ImportPastProcedureData;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Predicate;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;

public class PastProcedureListImporter
    extends SchoolEntryImporter<
        PastProcedureListRowValues, PastProcedureListColumn, SchoolEntryProcedure> {

  private final PastProcedureListRowValueMapper rowValueMapper;
  private final List<UUID> mergeCandidatesToBeDeleted;

  public PastProcedureListImporter(
      XSSFSheet sheet,
      RowReader<PastProcedureListRowValues, PastProcedureListColumn> rowReader,
      FeedbackColumnAccessor feedbackColumnAccessor,
      UUID schoolId,
      Year schoolYear,
      SchoolEntryService schoolEntryService) {
    super(sheet, rowReader, feedbackColumnAccessor, schoolId, schoolYear, schoolEntryService);
    this.rowValueMapper = new PastProcedureListRowValueMapper();
    this.mergeCandidatesToBeDeleted = new ArrayList<>();
  }

  @Override
  protected void evaluateActionForValidRow(
      Row row,
      PastProcedureListRowValues value,
      Map<PersonKeyAttributes, List<SchoolEntryProcedure>> mergeCandidates) {

    List<SchoolEntryProcedure> candidates =
        mergeCandidates.getOrDefault(value.getChildKeyAttributes(), List.of());

    if (candidates.isEmpty()) {
      validRows.importableRows().add(value);
      stats.countCreated();
    } else {
      Optional<SchoolEntryProcedure> firstNonDeletableCandidate =
          candidates.stream().filter(Predicate.not(SchoolEntryProcedure::isDeletable)).findFirst();

      if (firstNonDeletableCandidate.isEmpty()) {
        List<UUID> mergeCandidateIds =
            candidates.stream().map(SchoolEntryProcedure::getExternalId).toList();
        mergeCandidatesToBeDeleted.addAll(mergeCandidateIds);
        validRows.mergeableRows().add(value);
        writeStatusAndReferenceId(row, MERGED_SUCCESSFULLY, mergeCandidateIds.getFirst());
        stats.countMerged();
      } else {
        writeStatusAndReferenceId(
            row, DUPLICATE_IN_ASSET, firstNonDeletableCandidate.get().getExternalId());
        stats.countMergeFailed();
      }
    }
  }

  @Override
  protected List<SchoolEntryProcedure> createProcedures(
      List<PastProcedureListRowValues> importableRows) {

    List<ImportPastProcedureData> importData =
        importableRows.stream().map(rowValueMapper::mapValuesToImportData).toList();
    return schoolEntryService.createProceduresFromDataImport(importData, schoolId, schoolYear);
  }

  @Override
  protected List<UUID> mergeProceduresAndGetFailedProcedureIds(
      List<PastProcedureListRowValues> mergeableRows) {
    if (!mergeCandidatesToBeDeleted.isEmpty()) {
      schoolEntryService.deleteProcedures(mergeCandidatesToBeDeleted);
    }
    List<SchoolEntryProcedure> createdProcedures = createProcedures(mergeableRows);
    writeProcedureIdsInSheet(mergeableRows, createdProcedures, MERGED_SUCCESSFULLY);
    return List.of();
  }

  @Override
  protected Map<PersonKeyAttributes, List<SchoolEntryProcedure>> fetchMergeCandidates(
      Set<PersonKeyAttributes> childKeyAttributes) {
    return schoolEntryService.searchForMergeCandidatesForPastProcedures(
        childKeyAttributes, schoolYear);
  }
}
