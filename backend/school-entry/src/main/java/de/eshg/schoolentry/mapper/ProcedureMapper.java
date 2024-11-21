/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.base.SortDirection;
import de.eshg.lib.appointmentblock.AppointmentMapper;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.schoolentry.api.*;
import de.eshg.schoolentry.business.model.ProcedureData;
import de.eshg.schoolentry.business.model.ProcedureDetailsData;
import de.eshg.schoolentry.util.ProcedurePageSpec;
import de.eshg.schoolentry.util.ProcedureSortKey;
import java.time.Year;
import org.springframework.data.domain.Sort;

public final class ProcedureMapper {

  private ProcedureMapper() {}

  public static ProcedureDetailsDto mapProcedureToDetailsDto(
      ProcedureDetailsData procedureDetailsData) {
    if (procedureDetailsData == null) {
      return null;
    }

    return new ProcedureDetailsDto(
        procedureDetailsData.externalId(),
        procedureDetailsData.version(),
        mapTypeToDto(procedureDetailsData.type()),
        PersonMapper.mapPersonDetailsToDto(procedureDetailsData.child()),
        PersonMapper.mapCustodiansToDto(procedureDetailsData.custodians()),
        LabelMapper.toDto(procedureDetailsData.labels()),
        AppointmentMapper.mapAppointmentToDto(procedureDetailsData.appointment()),
        procedureDetailsData.school(),
        procedureDetailsData.location(),
        procedureDetailsData.isEntryLevel(),
        procedureDetailsData.isInvitationSent(),
        procedureDetailsData.isDeceased(),
        procedureDetailsData.deceased(),
        mapYearToInteger(procedureDetailsData.schoolYear()),
        mapStatusToDto(procedureDetailsData.status()),
        procedureDetailsData.isDeletable(),
        procedureDetailsData.createdAt(),
        procedureDetailsData.modifiedAt(),
        WaitingRoomMapper.mapToDto(procedureDetailsData.waitingRoom()),
        procedureDetailsData.schoolInfoLetterCreatedAt(),
        procedureDetailsData.hasInformationBlock(),
        procedureDetailsData.hasBeenClosed(),
        procedureDetailsData.isPastProcedure());
  }

  public static ProcedureDto mapProcedureToDto(ProcedureData procedureData) {
    if (procedureData == null) {
      return null;
    }

    return new ProcedureDto(
        procedureData.externalId(),
        mapTypeToDto(procedureData.type()),
        PersonMapper.mapChildToDto(procedureData.child()),
        mapStatusToDto(procedureData.status()),
        procedureData.school(),
        mapYearToInteger(procedureData.schoolYear()),
        LabelMapper.toDto(procedureData.labels()),
        procedureData.appointmentStart(),
        procedureData.createdAt(),
        procedureData.modifiedAt());
  }

  public static ProcedureTypeDto mapTypeToDto(
      de.eshg.lib.procedure.domain.model.ProcedureType procedureType) {
    if (procedureType == null) {
      return null;
    }

    return switch (procedureType) {
      case REGULAR_EXAMINATION -> ProcedureTypeDto.REGULAR_EXAMINATION;
      case CAN_CHILD -> ProcedureTypeDto.CAN_CHILD;
      case ENTRY_LEVEL -> ProcedureTypeDto.ENTRY_LEVEL;
      case DRAFT_CITIZEN_OFFICE_IMPORT -> ProcedureTypeDto.DRAFT_CITIZEN_OFFICE_IMPORT;
      case DRAFT_SCHOOL_IMPORT -> ProcedureTypeDto.DRAFT_SCHOOL_IMPORT;
      default ->
          throw new IllegalArgumentException(
              "No mapping found for procedure type %s".formatted(procedureType));
    };
  }

  public static de.eshg.lib.procedure.domain.model.ProcedureType mapToDomain(
      ProcedureTypeDto procedureType) {
    return switch (procedureType) {
      case null -> null;
      case REGULAR_EXAMINATION ->
          de.eshg.lib.procedure.domain.model.ProcedureType.REGULAR_EXAMINATION;
      case CAN_CHILD -> de.eshg.lib.procedure.domain.model.ProcedureType.CAN_CHILD;
      case ENTRY_LEVEL -> de.eshg.lib.procedure.domain.model.ProcedureType.ENTRY_LEVEL;
      case DRAFT_CITIZEN_OFFICE_IMPORT ->
          de.eshg.lib.procedure.domain.model.ProcedureType.DRAFT_CITIZEN_OFFICE_IMPORT;
      case DRAFT_SCHOOL_IMPORT ->
          de.eshg.lib.procedure.domain.model.ProcedureType.DRAFT_SCHOOL_IMPORT;
    };
  }

  public static ProcedureStatusDto mapStatusToDto(ProcedureStatus procedureStatus) {
    if (procedureStatus == null) {
      return null;
    }
    return switch (procedureStatus) {
      case DRAFT -> ProcedureStatusDto.DRAFT;
      case OPEN -> ProcedureStatusDto.OPEN;
      case IN_PROGRESS -> ProcedureStatusDto.IN_PROGRESS;
      case CLOSED -> ProcedureStatusDto.CLOSED;
      case ABORTED -> ProcedureStatusDto.ABORTED;
    };
  }

  public static ProcedurePageSpec mapToPageSpec(
      int page, int pageSize, SchoolEntryProcedureSortKey sortField, SortDirection direction) {
    return new ProcedurePageSpec(page, pageSize, mapSortField(sortField), mapDirection(direction));
  }

  private static ProcedureSortKey mapSortField(SchoolEntryProcedureSortKey sortKey) {
    return switch (sortKey) {
      case null -> ProcedureSortKey.ID;
      case ID -> ProcedureSortKey.ID;
      case DATE_OF_BIRTH -> ProcedureSortKey.DATE_OF_BIRTH;
      case FIRSTNAME -> ProcedureSortKey.FIRSTNAME;
      case LASTNAME -> ProcedureSortKey.LASTNAME;
      case SCHOOL_YEAR -> ProcedureSortKey.SCHOOL_YEAR;
      case TYPE -> ProcedureSortKey.PROCEDURE_TYPE;
      case APPOINTMENT_START -> ProcedureSortKey.APPOINTMENT_START;
      case CREATED_AT -> ProcedureSortKey.CREATED_AT;
      case MODIFIED_AT -> ProcedureSortKey.MODIFIED_AT;
    };
  }

  public static Sort.Direction mapDirection(SortDirection sortDirection) {
    return switch (sortDirection) {
      case null -> Sort.Direction.ASC;
      case ASC -> Sort.Direction.ASC;
      case DESC -> Sort.Direction.DESC;
    };
  }

  private static Integer mapYearToInteger(Year year) {
    if (year == null) {
      return null;
    }
    return year.getValue();
  }

  public static Year mapIntegerToYear(Integer schoolYear) {
    if (schoolYear == null) {
      return null;
    }
    return Year.of(schoolYear);
  }
}
