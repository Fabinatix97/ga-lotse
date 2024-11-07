/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import static de.eshg.lib.xlsximport.ImportStatus.DUPLICATE_IN_ASSET;
import static de.eshg.lib.xlsximport.ImportStatus.MERGED_SUCCESSFULLY;
import static de.eshg.lib.xlsximport.ImportStatus.MERGE_FAILED;
import static de.eshg.schoolentry.importer.ImportType.CITIZEN_LIST;
import static de.eshg.schoolentry.importer.ImportType.SCHOOL_LIST;

import de.eshg.base.GenderDto;
import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.centralfile.api.person.PersonKeyAttributes;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.RowReader;
import de.eshg.lib.xlsximport.XlsxColumn;
import de.eshg.lib.xlsximport.model.AddressData;
import de.eshg.schoolentry.SchoolEntryService;
import de.eshg.schoolentry.business.model.DataOrigin;
import de.eshg.schoolentry.business.model.ImportProcedureData;
import de.eshg.schoolentry.business.model.MergeProcedureData;
import de.eshg.schoolentry.business.model.ProcedureWithChildData;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import java.time.Year;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;

public class CitizenOrSchoolListImporter<T extends SchoolEntryRowValues, C extends XlsxColumn>
    extends SchoolEntryImporter<T, C, ProcedureWithChildData> {

  private static final Logger log = LoggerFactory.getLogger(CitizenOrSchoolListImporter.class);
  private final RowValueMapper<T> rowValueMapper;
  private final ImportType importType;
  private final UUID locationId;
  private final SchoolEntryProperties schoolEntryProperties;

  public CitizenOrSchoolListImporter(
      XSSFSheet sheet,
      RowReader<T, C> rowReader,
      FeedbackColumnAccessor feedbackColumnAccessor,
      ImportType importType,
      RowValueMapper<T> rowValueMapper,
      UUID schoolId,
      UUID locationId,
      Year schoolYear,
      SchoolEntryService schoolEntryService,
      SchoolEntryProperties schoolEntryProperties) {
    super(sheet, rowReader, feedbackColumnAccessor, schoolId, schoolYear, schoolEntryService);
    Assert.isTrue(
        EnumSet.of(SCHOOL_LIST, CITIZEN_LIST).contains(importType), "Unexpected import type");
    this.importType = importType;
    this.rowValueMapper = rowValueMapper;
    this.locationId = locationId;
    this.schoolEntryProperties = schoolEntryProperties;
  }

  @Override
  protected void evaluateActionForValidRow(
      Row row, T value, Map<PersonKeyAttributes, List<ProcedureWithChildData>> mergeCandidates) {
    List<ProcedureWithChildData> procedures =
        mergeCandidates.getOrDefault(value.getChildKeyAttributes(), List.of());
    if (procedures.isEmpty()) {
      validRows.importableRows().add(value);
      stats.countCreated();
    } else if (procedures.size() > 1
        || procedures.getFirst().procedure().getProcedureType() != procedureTypeToMergeWith()) {
      writeStatusAndReferenceId(
          row, DUPLICATE_IN_ASSET, procedures.getFirst().procedure().getExternalId());
      stats.countMergeFailed();
    } else {
      Assert.isTrue(
          !schoolEntryProperties.isDirectProcedureTypeAssignmentOnImport(),
          "Procedures of a draft type should not exist when direct procedure type assignment is enabled.");
      ProcedureWithChildData procedure = procedures.getFirst();
      UUID procedureId = procedure.procedure().getExternalId();
      if (mergeCandidateMatchesImportValues(procedure, value)) {
        if (validRows.mergeableRows().stream()
            .anyMatch(mergeableRow -> mergeableRow.getProcedureId().equals(procedureId))) {
          log.error("Procedure ID {} already found in a previous mergeable row", procedureId);
          writeStatusAndReferenceId(row, MERGE_FAILED, procedureId);
          stats.countMergeFailed();
        } else {
          value.setProcedureId(procedureId);
          validRows.mergeableRows().add(value);
          writeStatusAndProcedureId(row, MERGED_SUCCESSFULLY, procedureId);
          stats.countMerged();
        }
      } else {
        writeStatusAndReferenceId(row, DUPLICATE_IN_ASSET, procedure.procedure().getExternalId());
        stats.countMergeFailed();
      }
    }
  }

  private ProcedureType procedureTypeToMergeWith() {
    if (importType == CITIZEN_LIST) {
      return ProcedureType.DRAFT_SCHOOL_IMPORT;
    } else {
      return ProcedureType.DRAFT_CITIZEN_OFFICE_IMPORT;
    }
  }

  private boolean mergeCandidateMatchesImportValues(
      ProcedureWithChildData mergeCandidate, T values) {
    AddressDto address = mergeCandidate.child().address();
    if (address instanceof PostboxAddressDto) {
      return false;
    }
    DomesticAddressDto domesticAddressDto = (DomesticAddressDto) address;
    AddressData importAddress = values.getChild().address();
    boolean commonFieldsMatch =
        Objects.equals(domesticAddressDto.street(), importAddress.street())
            && Objects.equals(domesticAddressDto.city(), importAddress.city())
            && Objects.equals(domesticAddressDto.houseNumber(), importAddress.houseNumber())
            && Objects.equals(domesticAddressDto.postalCode(), importAddress.postalCode())
            && Objects.equals(domesticAddressDto.addressAddition(), importAddress.addressAddition())
            && Objects.equals(
                mergeCandidate.child().gender(),
                Optional.ofNullable(values.getChild().gender()).orElse(GenderDto.NOT_SPECIFIED))
            && (mergeCandidate.procedure().getSchoolYear() == null
                || Objects.equals(mergeCandidate.procedure().getSchoolYear(), schoolYear));

    if (!commonFieldsMatch) {
      return false;
    }

    if (importType == SCHOOL_LIST) {
      return (mergeCandidate.procedure().getSchoolId() == null
              || Objects.equals(mergeCandidate.procedure().getSchoolId(), schoolId))
          && (mergeCandidate.procedure().getLocationId() == null
              || Objects.equals(mergeCandidate.procedure().getLocationId(), locationId));
    } else {
      return (mergeCandidate.child().placeOfBirth() == null
              || Objects.equals(
                  mergeCandidate.child().placeOfBirth(), values.getChild().placeOfBirth()))
          && (mergeCandidate.child().countryOfBirth() == null
              || Objects.equals(
                  mergeCandidate.child().countryOfBirth(), values.getChild().countryOfBirth()));
    }
  }

  @Override
  protected List<SchoolEntryProcedure> createProcedures(List<T> importableRows) {
    List<ImportProcedureData> importData =
        importableRows.stream().map(rowValueMapper::mapValuesToImportData).toList();
    return schoolEntryService.createProceduresWithBookAppointmentTask(
        importData, schoolId, locationId, schoolYear, DataOrigin.DATA_IMPORT);
  }

  @Override
  protected List<UUID> mergeProceduresAndGetFailedProcedureIds(List<T> mergeableRows) {
    List<MergeProcedureData> mergeData =
        mergeableRows.stream().map(rowValueMapper::mapValuesToMergeData).toList();
    return schoolEntryService.mergeProcedures(
        mergeData, importType, schoolId, locationId, schoolYear);
  }

  @Override
  protected Map<PersonKeyAttributes, List<ProcedureWithChildData>> fetchMergeCandidates(
      Set<PersonKeyAttributes> childKeyAttributes) {
    return schoolEntryService.searchForMergeCandidates(childKeyAttributes);
  }
}
