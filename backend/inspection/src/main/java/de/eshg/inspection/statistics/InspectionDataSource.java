/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.statistics;

import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.InspectionAppointment;
import de.eshg.inspection.inspection.persistence.InspectionAppointment_;
import de.eshg.inspection.inspection.persistence.InspectionRepository;
import de.eshg.inspection.inspection.persistence.Inspection_;
import de.eshg.inspection.objecttype.ObjectTypeProperties;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.datasource.ProcedureDataSource;
import de.eshg.lib.statistics.util.TimeRange;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class InspectionDataSource extends ProcedureDataSource<Inspection, InspectionAttributes> {

  public static final UUID DATA_SOURCE_ID = UUID.fromString("f0ac7a7b-dfa7-4a1a-9409-a7588da26531");
  public static final String DATA_SOURCE_NAME = "Vorgänge";

  private final Clock clock;

  public InspectionDataSource(
      InspectionRepository inspectionRepository,
      Clock clock,
      ObjectTypeProperties objectTypeProperties) {
    super(
        DATA_SOURCE_ID,
        DATA_SOURCE_NAME,
        DataSourceSensitivity.INTERNAL_USAGE,
        inspectionRepository,
        InspectionAttributes.values(),
        false);
    this.clock = clock;
    AttributeUtil.addValueOptions(InspectionAttributes.OBJECT_TYPE, objectTypeProperties);
  }

  @Override
  protected Object mapSpecificValue(
      Inspection procedure, InspectionAttributes attribute, TimeRange timeRange) {
    return switch (attribute) {
      case PROCEDURE_ID -> procedure.getExternalId();
      case FACILITY_CENTRAL_FILE_ID -> procedure.getCentralFileStateId();
      case YEAR_OF_INSPECTION -> getYearOfInspection(procedure);
      case OBJECT_TYPE -> AttributeUtil.getObjectTypeName(procedure.getFacility().getObjectType());
      case RESULT -> procedure.getResult();
      case DURATION -> getDurationInMinutes(procedure);
      case NUMBER_OF_INCIDENTS -> procedure.getIncidents().size();
    };
  }

  private Integer getYearOfInspection(Inspection inspection) {
    InspectionAppointment appointment = inspection.getExecutionAppointment();
    if (appointment == null) {
      return null;
    }
    return LocalDate.ofInstant(appointment.getAppointmentStart(), clock.getZone()).getYear();
  }

  @Override
  protected Specification<Inspection> getProcedureSpecification(TimeRange timeRange) {
    return (root, query, criteriaBuilder) -> {
      Path<Instant> appointmentStartPath =
          root.join(Inspection_.executionAppointment).get(InspectionAppointment_.appointmentStart);

      Predicate appointmentStartInTimeRange =
          isInTimeRange(criteriaBuilder, appointmentStartPath, timeRange);

      Predicate isClosed =
          criteriaBuilder.equal(root.get(Procedure_.procedureStatus), ProcedureStatus.CLOSED);

      return criteriaBuilder.and(appointmentStartInTimeRange, isClosed);
    };
  }

  private Long getDurationInMinutes(Inspection inspection) {
    InspectionAppointment appointment = inspection.getExecutionAppointment();
    if (appointment == null) {
      return null;
    }
    return Duration.between(appointment.getAppointmentStart(), appointment.getAppointmentEnd())
        .toMinutes();
  }
}
