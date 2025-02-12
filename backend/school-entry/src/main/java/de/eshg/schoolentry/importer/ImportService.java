/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.MERGED_DATA_FROM_CITIZEN_LIST;
import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.MERGED_DATA_FROM_SCHOOL_LIST;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.person.PersonKeyAttributes;
import de.eshg.lib.procedure.procedures.ProcedureSearchService;
import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.XlsxColumn;
import de.eshg.lib.xlsximport.XlsxImport;
import de.eshg.lib.xlsximport.model.ImportResult;
import de.eshg.schoolentry.LabelService;
import de.eshg.schoolentry.SchoolEntryProcedureDeletionService;
import de.eshg.schoolentry.SchoolEntryService;
import de.eshg.schoolentry.Validator;
import de.eshg.schoolentry.business.model.DataOrigin;
import de.eshg.schoolentry.business.model.ImportCustodianData;
import de.eshg.schoolentry.business.model.ImportCustodianDataWithProcedure;
import de.eshg.schoolentry.business.model.ImportPastProcedureData;
import de.eshg.schoolentry.business.model.ImportProcedureData;
import de.eshg.schoolentry.business.model.MergeProcedureData;
import de.eshg.schoolentry.business.model.ProcedureWithChildData;
import de.eshg.schoolentry.business.model.ResolvedMergeProcedureData;
import de.eshg.schoolentry.client.PersonClient;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import de.eshg.schoolentry.domain.model.Label;
import de.eshg.schoolentry.domain.model.Person;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure_;
import de.eshg.schoolentry.domain.repository.SchoolEntryProcedureRepository;
import de.eshg.schoolentry.util.ExceptionUtil;
import de.eshg.schoolentry.util.ProcedureTypeAssignmentHelper;
import de.eshg.schoolentry.util.ProgressEntryUtil;
import de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType;
import jakarta.persistence.criteria.Path;
import java.io.IOException;
import java.time.Clock;
import java.time.Year;
import java.util.*;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImportService {

  private static final Logger log = LoggerFactory.getLogger(ImportService.class);

  private final Clock clock;
  private final Validator validator;
  private final SchoolEntryService schoolEntryService;
  private final LabelService labelService;
  private final ProcedureSearchService<SchoolEntryProcedure> procedureSearchService;
  private final SchoolEntryProcedureDeletionService schoolEntryProcedureDeletionService;
  private final PersonClient personClient;
  private final ProgressEntryUtil progressEntryUtil;
  private final SchoolEntryProperties schoolEntryProperties;
  private final ProcedureTypeAssignmentHelper procedureTypeAssignmentHelper;
  private final SchoolEntryProcedureRepository schoolEntryProcedureRepository;

  public ImportService(
      Clock clock,
      Validator validator,
      SchoolEntryService schoolEntryService,
      LabelService labelService,
      ProcedureSearchService<SchoolEntryProcedure> procedureSearchService,
      SchoolEntryProcedureDeletionService schoolEntryProcedureDeletionService,
      PersonClient personClient,
      ProgressEntryUtil progressEntryUtil,
      SchoolEntryProperties schoolEntryProperties,
      ProcedureTypeAssignmentHelper procedureTypeAssignmentHelper,
      SchoolEntryProcedureRepository schoolEntryProcedureRepository) {
    this.clock = clock;
    this.validator = validator;
    this.schoolEntryService = schoolEntryService;
    this.labelService = labelService;
    this.schoolEntryProcedureDeletionService = schoolEntryProcedureDeletionService;
    this.schoolEntryProperties = schoolEntryProperties;
    this.procedureTypeAssignmentHelper = procedureTypeAssignmentHelper;
    this.schoolEntryProcedureRepository = schoolEntryProcedureRepository;
    this.procedureSearchService = procedureSearchService;
    this.personClient = personClient;
    this.progressEntryUtil = progressEntryUtil;
  }

  public ImportResult importProceduresFromFile(
      MultipartFile file, ImportType importType, UUID schoolId, UUID locationId, Year schoolYear)
      throws IOException {
    validator.validateSchoolYear(schoolYear);

    return switch (importType) {
      case CITIZEN_LIST ->
          processWorkbook(
              file,
              CitizenListColumn.values(),
              (sheet, actualColumns) ->
                  newCitizenListImporter(
                      importType, schoolId, locationId, schoolYear, sheet, actualColumns));

      case SCHOOL_LIST ->
          processWorkbook(
              file,
              SchoolListColumn.values(),
              (sheet, actualColumns) ->
                  newSchoolListImporter(
                      importType, schoolId, locationId, schoolYear, sheet, actualColumns));

      case PAST_PROCEDURE_LIST ->
          processWorkbook(
              file,
              PastProcedureListColumn.values(),
              (sheet, actualColumns) ->
                  newPastProcedureListImporter(schoolId, schoolYear, sheet, actualColumns));
    };
  }

  @FunctionalInterface
  private interface ImporterProvider<C extends XlsxColumn> {
    SchoolEntryImporter<?, C, ?> provide(XSSFSheet sheet, List<C> actualColumns);
  }

  private <C extends XlsxColumn> ImportResult processWorkbook(
      MultipartFile file, C[] expectedColumns, ImporterProvider<C> importerProvider)
      throws IOException {
    return XlsxImport.processWorkbook(
        file,
        schoolEntryProperties.getMaxNumberOfImportRows(),
        expectedColumns,
        (sheet, actualColumns) -> {
          SchoolEntryImporter<?, C, ?> schoolEntryImporter =
              importerProvider.provide(sheet, actualColumns);
          return schoolEntryImporter.process();
        });
  }

  private CitizenOrSchoolListImporter<CitizenListRow, CitizenListColumn> newCitizenListImporter(
      ImportType importType,
      UUID schoolId,
      UUID locationId,
      Year schoolYear,
      XSSFSheet sheet,
      List<CitizenListColumn> actualColumns) {
    return new CitizenOrSchoolListImporter<>(
        sheet,
        new CitizenListRowReader(sheet, clock, actualColumns),
        new FeedbackColumnAccessor(actualColumns),
        importType,
        new CitizenListRowValueMapper(),
        schoolId,
        locationId,
        schoolYear,
        this,
        schoolEntryProperties);
  }

  private CitizenOrSchoolListImporter<SchoolListRow, SchoolListColumn> newSchoolListImporter(
      ImportType importType,
      UUID schoolId,
      UUID locationId,
      Year schoolYear,
      XSSFSheet sheet,
      List<SchoolListColumn> actualColumns) {
    return new CitizenOrSchoolListImporter<>(
        sheet,
        new SchoolListRowReader(sheet, clock, actualColumns),
        new FeedbackColumnAccessor(actualColumns),
        importType,
        new SchoolListRowValueMapper(schoolYear, procedureTypeAssignmentHelper),
        schoolId,
        locationId,
        schoolYear,
        this,
        schoolEntryProperties);
  }

  private PastProcedureListImporter newPastProcedureListImporter(
      UUID schoolId,
      Year schoolYear,
      XSSFSheet sheet,
      List<PastProcedureListColumn> actualColumns) {
    return new PastProcedureListImporter(
        sheet,
        new PastProcedureListRowReader(sheet, clock, actualColumns),
        new FeedbackColumnAccessor(actualColumns),
        schoolId,
        schoolYear,
        this,
        validator);
  }

  List<UUID> collectExistingProcedures(Collection<UUID> externalIds) {
    if (externalIds.isEmpty()) {
      return List.of();
    }
    return schoolEntryProcedureRepository.collectExistingProceduresByExternalIds(externalIds);
  }

  Map<PersonKeyAttributes, List<ProcedureWithChildData>> searchForMergeCandidates(
      Set<PersonKeyAttributes> searchAttributes) {
    Map<PersonKeyAttributes, List<SchoolEntryProcedure>> proceduresByPersons =
        procedureSearchService.searchProceduresByPersons(
            searchAttributes,
            Person.PERSON_TYPE_USED_FOR_CHILDREN,
            ProcedureSearchService.isInStatusOpen(),
            Person.class);
    return personClient.augmentWithChildData(proceduresByPersons);
  }

  Map<PersonKeyAttributes, List<SchoolEntryProcedure>> searchForMergeCandidatesForPastProcedures(
      Set<PersonKeyAttributes> searchAttributes, Year schoolYear) {
    Specification<SchoolEntryProcedure> proceduresWithNoOrEqualSchoolYear =
        (root, query, criteriaBuilder) -> {
          Path<Year> schoolYearPath = root.get(SchoolEntryProcedure_.schoolYear);
          return criteriaBuilder.or(
              schoolYearPath.isNull(), criteriaBuilder.equal(schoolYearPath, schoolYear));
        };
    return procedureSearchService.searchProceduresByPersons(
        searchAttributes,
        Person.PERSON_TYPE_USED_FOR_CHILDREN,
        proceduresWithNoOrEqualSchoolYear,
        Person.class);
  }

  List<SchoolEntryProcedure> createProceduresWithBookAppointmentTask(
      List<ImportProcedureData> procedures, UUID schoolId, UUID locationId, Year schoolYear) {
    return schoolEntryService.createProceduresWithBookAppointmentTask(
        procedures, schoolId, locationId, schoolYear, DataOrigin.DATA_IMPORT);
  }

  List<SchoolEntryProcedure> createProceduresFromDataImport(
      List<ImportPastProcedureData> pastProcedures, UUID schoolId, Year schoolYear) {
    return schoolEntryService.createProceduresFromDataImport(pastProcedures, schoolId, schoolYear);
  }

  List<UUID> mergeProcedures(
      List<MergeProcedureData> mergeDataList,
      ImportType importType,
      UUID schoolId,
      UUID locationId,
      Year schoolYear) {
    if (mergeDataList.isEmpty()) {
      return List.of();
    }

    try {
      List<ResolvedMergeProcedureData> resolvedMergeDataList = resolveMergeData(mergeDataList);
      List<UUID> failedProcedureIds = personClient.updateChildren(resolvedMergeDataList);

      resolvedMergeDataList.removeIf(
          mergeData -> failedProcedureIds.contains(mergeData.procedure().getExternalId()));

      createCustodiansInBulk(resolvedMergeDataList);

      for (ResolvedMergeProcedureData mergeData : resolvedMergeDataList) {
        mergeDataForProcedure(mergeData, schoolId, locationId, schoolYear);
        updateProcedureTypeWithSuggestion(mergeData.procedure());
        addProgressEntryForMerge(mergeData.procedure(), importType);
      }

      schoolEntryProcedureRepository.flush();

      return failedProcedureIds;
    } catch (Exception e) {
      log.error("Error during merge of data.", e);
      return mergeDataList.stream().map(MergeProcedureData::procedureId).toList();
    }
  }

  private List<ResolvedMergeProcedureData> resolveMergeData(
      List<MergeProcedureData> mergeDataList) {
    List<ResolvedMergeProcedureData> merges;
    List<UUID> procedureIds = mergeDataList.stream().map(MergeProcedureData::procedureId).toList();

    Assert.isTrue(
        !StreamUtil.hasDuplicates(procedureIds.stream()),
        "Merge data contains duplicated procedure IDs");

    Map<UUID, SchoolEntryProcedure> procedures =
        schoolEntryProcedureRepository
            .findByExternalIdsForUpdate(procedureIds)
            .collect(StreamUtil.toLinkedHashMap(SchoolEntryProcedure::getExternalId));

    merges =
        mergeDataList.stream()
            .map(
                mergeProcedureData -> {
                  SchoolEntryProcedure procedure =
                      getProcedureOrThrow(procedures, mergeProcedureData.procedureId());
                  return new ResolvedMergeProcedureData(
                      procedure,
                      mergeProcedureData.placeOfBirth(),
                      mergeProcedureData.countryOfBirth(),
                      mergeProcedureData.custodians(),
                      mergeProcedureData.phoneNumber(),
                      mergeProcedureData.isEntryLevel(),
                      mergeProcedureData.isEarlyExamination());
                })
            .collect(StreamUtil.toModifiableList());
    return merges;
  }

  private static List<ImportCustodianDataWithProcedure> collectCustodiansWithProcedure(
      List<ResolvedMergeProcedureData> merges) {
    return merges.stream()
        .flatMap(
            mergeData ->
                mergeData.custodians().stream()
                    .map(
                        custodian ->
                            new ImportCustodianDataWithProcedure(custodian, mergeData.procedure())))
        .toList();
  }

  private void createCustodiansInBulk(List<ResolvedMergeProcedureData> mergeDataList) {
    List<ImportCustodianDataWithProcedure> custodiansWithProcedure =
        collectCustodiansWithProcedure(mergeDataList);
    if (custodiansWithProcedure.isEmpty()) {
      return;
    }
    List<ImportCustodianData> custodians =
        custodiansWithProcedure.stream().map(ImportCustodianDataWithProcedure::custodian).toList();
    List<UUID> custodianIds = personClient.createCustodiansInCentralFile(custodians);
    Assert.isTrue(
        custodiansWithProcedure.size() == custodianIds.size(),
        () ->
            "Unexpected number of created custodian. Expected %d but got %d"
                .formatted(custodiansWithProcedure.size(), custodianIds.size()));
    for (int i = 0; i < custodianIds.size(); i++) {
      ImportCustodianDataWithProcedure custodian = custodiansWithProcedure.get(i);
      SchoolEntryService.buildCustodian(custodianIds.get(i), custodian.procedure());
    }
  }

  private static SchoolEntryProcedure getProcedureOrThrow(
      Map<UUID, SchoolEntryProcedure> procedures, UUID procedureId) {
    return Optional.ofNullable(procedures.get(procedureId))
        .orElseThrow(ExceptionUtil::procedureNotFoundException);
  }

  private void addProgressEntryForMerge(SchoolEntryProcedure procedure, ImportType importType) {
    SchoolEntrySystemProgressEntryType progressEntryType =
        switch (importType) {
          case CITIZEN_LIST -> MERGED_DATA_FROM_CITIZEN_LIST;
          case SCHOOL_LIST -> MERGED_DATA_FROM_SCHOOL_LIST;
          case PAST_PROCEDURE_LIST -> throw ExceptionUtil.mergeNotSupportedForPastProcedureImport();
        };
    progressEntryUtil.addProgressEntry(procedure, progressEntryType);
  }

  private void mergeDataForProcedure(
      ResolvedMergeProcedureData mergeData, UUID schoolId, UUID locationId, Year schoolYear) {
    SchoolEntryProcedure procedure = mergeData.procedure();

    if (mergeData.isEntryLevel() != null) {
      procedure.setEntryLevel(mergeData.isEntryLevel());
    }

    if (mergeData.isEarlyExamination() != null && mergeData.isEarlyExamination()) {
      Label specialNeedsLabel = labelService.getSpecialNeedsLabel();

      List<Label> labels = procedure.getLabels();
      if (!labels.contains(specialNeedsLabel)) {
        labels.add(specialNeedsLabel);
      }
    }

    if (schoolId != null) {
      procedure.setSchoolId(schoolId);
    }

    if (locationId != null) {
      procedure.setLocationId(locationId);
    }

    if (schoolYear != null) {
      procedure.setSchoolYear(schoolYear);
    }
  }

  private void updateProcedureTypeWithSuggestion(SchoolEntryProcedure procedure) {
    procedure.setProcedureType(
        procedureTypeAssignmentHelper.suggestProcedureType(
            procedure.isEntryLevel(),
            personClient.fetchChildData(procedure).dateOfBirth(),
            procedure.getSchoolYear()));
  }

  void deleteProcedures(List<UUID> procedureIds) {
    schoolEntryProcedureDeletionService.bulkDeleteAndWriteToCemetery(procedureIds);
  }
}
