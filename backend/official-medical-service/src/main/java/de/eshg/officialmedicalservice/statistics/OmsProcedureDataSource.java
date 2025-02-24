/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.statistics;

import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.datasource.ProcedureDataSource;
import de.eshg.lib.statistics.util.TimeRange;
import de.eshg.officialmedicalservice.appointment.persistence.entity.BookingState;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureRepository;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure_;
import java.time.Duration;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class OmsProcedureDataSource
    extends ProcedureDataSource<OmsProcedure, OmsProcedureAttributes> {

  public static final UUID DATA_SOURCE_ID = UUID.fromString("07d387be-ba7b-4925-a892-946f2da0a6da");
  public static final String DATA_SOURCE_NAME = "Amtsärztliches Gutachten";

  public OmsProcedureDataSource(OmsProcedureRepository omsProcedureRepository) {
    super(
        DATA_SOURCE_ID,
        DATA_SOURCE_NAME,
        DataSourceSensitivity.INTERNAL_USAGE,
        omsProcedureRepository,
        OmsProcedureAttributes.values(),
        false);
  }

  @Override
  protected Object mapSpecificValue(
      OmsProcedure procedure, OmsProcedureAttributes attribute, TimeRange timeRange) {
    return switch (attribute) {
      case PROCEDURE_ID -> procedure.getExternalId();
      case STATUS -> procedure.getProcedureStatus().toString();
      case CONCERN -> procedure.getConcern() != null ? procedure.getConcern().getNameDe() : null;
      case CONCERN_CATEGORY ->
          procedure.getConcern() != null ? procedure.getConcern().getCategoryNameDe() : null;
      case DURATION -> getDurationInMinutes(procedure);
      case PERSON_CENTRAL_FILE_ID -> procedure.findAffectedPerson().getCentralFileStateId();
      case NUMBER_OF_DOCUMENTS -> procedure.getDocuments().size();
      case NUMBER_OF_APPOINTMENTS -> procedure.getAppointments().size();
      case NUMBER_OF_BOOKED_APPOINTMENTS ->
          procedure.getAppointments().stream()
              .filter(appointment -> BookingState.BOOKED.equals(appointment.getBookingState()))
              .count();
      case NUMBER_OF_CANCELLED_APPOINTMENTS ->
          procedure.getAppointments().stream()
              .filter(appointment -> BookingState.CANCELLED.equals(appointment.getBookingState()))
              .count();
    };
  }

  @Override
  protected Specification<OmsProcedure> getProcedureSpecification(TimeRange timeRange) {
    return (root, query, criteriaBuilder) ->
        isInTimeRange(criteriaBuilder, root.get(OmsProcedure_.createdAt), timeRange);
  }

  private Long getDurationInMinutes(OmsProcedure procedure) {
    if (procedure.getStartedAt() == null || procedure.getClosedAt() == null) {
      return null;
    }
    return Duration.between(procedure.getStartedAt(), procedure.getClosedAt()).toMinutes();
  }
}
