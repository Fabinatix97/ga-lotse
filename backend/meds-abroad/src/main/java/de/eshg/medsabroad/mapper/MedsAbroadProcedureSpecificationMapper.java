/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.mapper;

import static de.eshg.lib.procedure.MapperHelper.mapEnumSet;

import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.medsabroad.api.GetMedsAbroadProceduresFilterOptions;
import de.eshg.medsabroad.api.GetMedsAbroadProceduresSortOptions;
import de.eshg.medsabroad.persistence.centralfile.MedsAbroadProcedureDetails;
import de.eshg.medsabroad.persistence.support.MedsAbroadProcedureSpecification;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

@Component
public class MedsAbroadProcedureSpecificationMapper {

  private static Clock clock;

  private MedsAbroadProcedureSpecificationMapper() {}

  @Autowired
  public void setClock(Clock clock) {
    MedsAbroadProcedureSpecificationMapper.clock = clock;
  }

  public static MedsAbroadProcedureSpecification toSpecification(
      GetMedsAbroadProceduresFilterOptions filterOptions) {
    return new MedsAbroadProcedureSpecification(
        atStartOfDay(filterOptions.creationDateStart()),
        atEndOfDay(filterOptions.creationDateEnd()),
        mapEnumSet(filterOptions.procedureStatus(), ProcedureMapper::toDomainType));
  }

  public static String toSortProperty(GetMedsAbroadProceduresSortOptions sortOptions) {
    return switch (sortOptions.sortBy()) {
      case CREATED_AT -> Procedure_.CREATED_AT;
      case PROCEDURE_STATUS -> Procedure_.PROCEDURE_STATUS;
      default -> Procedure_.CREATED_AT;
    };
  }

  public static Sort.Direction toSortDirection(GetMedsAbroadProceduresSortOptions sortOptions) {
    return switch (sortOptions.sortOrder()) {
      case ASC -> Sort.Direction.ASC;
      case DESC -> Sort.Direction.DESC;
    };
  }

  public static Comparator<MedsAbroadProcedureDetails> toSortComparator(
      GetMedsAbroadProceduresSortOptions sortOptions) {
    Comparator<MedsAbroadProcedureDetails> comparator =
        switch (sortOptions.sortBy()) {
          case FIRST_NAME -> Comparator.comparing(o -> o.personDetails().firstName());
          case LAST_NAME -> Comparator.comparing(o -> o.personDetails().lastName());
          case DATE_OF_BIRTH -> Comparator.comparing(o -> o.personDetails().dateOfBirth());
          default -> Comparator.comparing(o -> 0);
        };

    return switch (sortOptions.sortOrder()) {
      case ASC -> comparator;
      case DESC -> comparator.reversed();
    };
  }

  private static Instant atStartOfDay(LocalDate date) {
    if (date == null) {
      return null;
    }
    return date.atStartOfDay(clock.getZone()).toInstant();
  }

  private static Instant atEndOfDay(LocalDate date) {
    if (date == null) {
      return null;
    }
    return date.atTime(LocalTime.MAX).atZone(clock.getZone()).toInstant();
  }
}
