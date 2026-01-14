/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.lib.xlsximport.RowReader;
import de.eshg.schoolentry.Validator;
import de.eshg.schoolentry.domain.model.DevelopmentScreening;
import de.eshg.schoolentry.domain.model.HandicapWithDiagnosis;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Stream;
import org.springframework.util.Assert;

class Icd10Validation {

  private final Validator validator;
  private final RowReader<PastProcedureListRow, PastProcedureListColumn> rowReader;

  Icd10Validation(
      Validator validator, RowReader<PastProcedureListRow, PastProcedureListColumn> rowReader) {
    this.validator = validator;
    this.rowReader = rowReader;
  }

  void validateIcd10Codes(List<PastProcedureListRow> rows) {
    Map<String, List<PastProcedureListRow>> rowsByIcd10Code = collectRowsByIcd10Code(rows);
    Set<String> missingIcd10Codes = validator.validateIcd10Codes(rowsByIcd10Code.keySet());
    for (String missingIcd10Code : missingIcd10Codes) {
      for (PastProcedureListRow row : rowsByIcd10Code.get(missingIcd10Code)) {
        HandicapWithDiagnosis chronicDisease = row.getDevelopmentScreening().getChronicDisease();
        if (chronicDisease != null) {
          findAndMarkMissingIcd10Codes(
              missingIcd10Code,
              row,
              PastProcedureListRowReader.CHRONIC_DISEASE_ICD10_COLUMNS,
              chronicDisease.getIcd10CodesIncludingNulls());
        }

        HandicapWithDiagnosis disability = row.getDevelopmentScreening().getDisability();
        if (disability != null) {
          findAndMarkMissingIcd10Codes(
              missingIcd10Code,
              row,
              PastProcedureListRowReader.DISABILITY_ICD10_COLUMNS,
              disability.getIcd10CodesIncludingNulls());
        }
      }
    }
  }

  private void findAndMarkMissingIcd10Codes(
      String missingIcd10Code,
      PastProcedureListRow row,
      List<PastProcedureListColumn> icd10Columns,
      List<String> icd10CodesIncludingNulls) {
    Assert.isTrue(
        icd10Columns.size() == icd10CodesIncludingNulls.size(),
        () ->
            "List sizes mismatch: %d vs. %d"
                .formatted(icd10Columns.size(), icd10CodesIncludingNulls.size()));
    String errorMessage =
        "Ungültiger Wert (ICD-10 Code %s existiert nicht)".formatted(missingIcd10Code);
    for (int i = 0; i < icd10CodesIncludingNulls.size(); i++) {
      PastProcedureListColumn column = icd10Columns.get(i);
      String icd10Code = icd10CodesIncludingNulls.get(i);
      if (Objects.equals(icd10Code, missingIcd10Code)) {
        rowReader.addError(row, column, errorMessage);
      }
    }
  }

  private static Map<String, List<PastProcedureListRow>> collectRowsByIcd10Code(
      List<PastProcedureListRow> rows) {
    Map<String, List<PastProcedureListRow>> rowsByIcd10Code = new LinkedHashMap<>();
    for (PastProcedureListRow row : rows) {
      List<String> icd10Codes = collectAllIcd10Codes(row);
      for (String icd10Code : icd10Codes) {
        rowsByIcd10Code.computeIfAbsent(icd10Code, k -> new ArrayList<>()).add(row);
      }
    }
    return rowsByIcd10Code;
  }

  private static List<String> collectAllIcd10Codes(PastProcedureListRow row) {
    DevelopmentScreening developmentScreening = row.getDevelopmentScreening();
    return Stream.concat(
            streamIcd10Codes(developmentScreening.getDisability()),
            streamIcd10Codes(developmentScreening.getChronicDisease()))
        .toList();
  }

  private static Stream<String> streamIcd10Codes(HandicapWithDiagnosis handicapWithDiagnosis) {
    if (handicapWithDiagnosis == null) {
      return Stream.empty();
    }
    return handicapWithDiagnosis.getIcd10Codes().stream();
  }
}
