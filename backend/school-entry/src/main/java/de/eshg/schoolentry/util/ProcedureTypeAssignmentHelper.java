/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.util;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.schoolentry.SchoolEntryConfigService;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import java.time.LocalDate;
import java.time.MonthDay;
import java.time.Year;
import org.jetbrains.annotations.VisibleForTesting;
import org.springframework.stereotype.Component;

@Component
public class ProcedureTypeAssignmentHelper {

  private final SchoolEntryProperties schoolEntryProperties;
  private final SchoolEntryConfigService schoolEntryConfigService;

  public ProcedureTypeAssignmentHelper(
      SchoolEntryProperties schoolEntryProperties,
      SchoolEntryConfigService schoolEntryConfigService) {
    this.schoolEntryProperties = schoolEntryProperties;
    this.schoolEntryConfigService = schoolEntryConfigService;
  }

  public ProcedureType getProcedureTypeForSchoolListImport(
      boolean isEntryLevel, LocalDate dateOfBirth, Year schoolYear) {
    if (schoolEntryConfigService.isDirectProcedureTypeAssignmentOnImport()) {
      return suggestProcedureType(isEntryLevel, dateOfBirth, schoolYear);
    }
    return ProcedureType.DRAFT_SCHOOL_IMPORT;
  }

  public ProcedureType suggestProcedureType(
      boolean isEntryLevel, LocalDate dateOfBirth, Year schoolYear) {
    if (isEntryLevel) {
      return ProcedureType.ENTRY_LEVEL;
    } else {
      if (isRegularSchoolEntry(dateOfBirth, schoolYear)) {
        return ProcedureType.REGULAR_EXAMINATION;
      } else {
        return ProcedureType.CAN_CHILD;
      }
    }
  }

  @VisibleForTesting
  boolean isRegularSchoolEntry(LocalDate dateOfBirth, Year schoolYear) {
    MonthDay maxDateOfBirthForRegularSchoolEntry =
        schoolEntryProperties.getMaxDateOfBirthForRegularSchoolEntry();
    LocalDate maxDateOfBirthForRegularSchoolEntryWithYear =
        schoolYear.minusYears(6).atMonthDay(maxDateOfBirthForRegularSchoolEntry);
    if (schoolEntryProperties.isMaxDateOfBirthForRegularSchoolEntryIsInclusive()) {
      return !dateOfBirth.isAfter(maxDateOfBirthForRegularSchoolEntryWithYear);
    } else {
      return dateOfBirth.isBefore(maxDateOfBirthForRegularSchoolEntryWithYear);
    }
  }
}
