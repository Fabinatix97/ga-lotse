/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.statistics;

import de.eshg.inspection.facility.persistence.Facility;
import de.eshg.inspection.facility.persistence.FacilityRepository;
import de.eshg.inspection.feature.InspectionFeature;
import de.eshg.inspection.feature.InspectionFeatureToggle;
import de.eshg.inspection.inspection.api.InspectionResult;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.InspectionAppointment;
import de.eshg.inspection.inspection.persistence.InspectionAppointment_;
import de.eshg.inspection.inspection.persistence.Inspection_;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.statistics.AbstractStatisticsService;
import de.eshg.lib.statistics.api.DataRow;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.api.DataTableHeader;
import de.eshg.lib.statistics.api.GetSpecificDataRequest;
import de.eshg.lib.statistics.api.SubjectType;
import de.eshg.lib.statistics.util.AttributeInfo;
import de.eshg.lib.statistics.util.DataSourceInfo;
import de.eshg.lib.statistics.util.SpecificData;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.Temporal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class InspectionStatisticsService extends AbstractStatisticsService<Inspection> {

  public static final UUID INSPECTION_DATA_SOURCE_ID =
      UUID.fromString("f0ac7a7b-dfa7-4a1a-9409-a7588da26531");
  public static final String INSPECTION_DATA_SOURCE_NAME = "Vorgänge";

  public static final UUID FACILITY_DATA_SOURCE_ID =
      UUID.fromString("3f5939db-c5ca-4567-ae03-33012e2abc39");
  public static final String FACILITY_DATA_SOURCE_NAME = "Einrichtungen";

  private final Clock clock;
  private final FacilityRepository facilityRepository;
  private final InspectionFeatureToggle inspectionFeatureToggle;

  protected InspectionStatisticsService(
      ProcedureRepository<Inspection> inspectionRepository,
      Clock clock,
      FacilityRepository facilityRepository,
      InspectionFeatureToggle inspectionFeatureToggle) {
    super(inspectionRepository);
    this.clock = clock;
    this.facilityRepository = facilityRepository;
    this.inspectionFeatureToggle = inspectionFeatureToggle;
  }

  @Override
  protected boolean isProcedureBasedDataSource(UUID dataSourceId) {
    inspectionFeatureToggle.assertNewFeatureIsEnabled(InspectionFeature.STATISTICS);
    return INSPECTION_DATA_SOURCE_ID.equals(dataSourceId);
  }

  @Override
  public List<DataSourceInfo> getDataSourceMetaInfos() {
    if (inspectionFeatureToggle.isNewFeatureDisabled(InspectionFeature.STATISTICS)) {
      return Collections.emptyList();
    }

    return List.of(
        new DataSourceInfo(
            INSPECTION_DATA_SOURCE_ID,
            INSPECTION_DATA_SOURCE_NAME,
            DataSourceSensitivity.INTERNAL_USAGE,
            false),
        new DataSourceInfo(
            FACILITY_DATA_SOURCE_ID,
            FACILITY_DATA_SOURCE_NAME,
            DataSourceSensitivity.INTERNAL_USAGE,
            false));
  }

  @Override
  protected Map<UUID, List<AttributeInfo>> getDataSourceIdToAttributeInfos() {
    if (inspectionFeatureToggle.isNewFeatureDisabled(InspectionFeature.STATISTICS)) {
      return Collections.emptyMap();
    }

    return Map.of(
        INSPECTION_DATA_SOURCE_ID,
        Arrays.asList(InspectionAttributes.values()),
        FACILITY_DATA_SOURCE_ID,
        Arrays.asList(FacilityAttributes.values()));
  }

  @Override
  protected SubjectType getSubjectType(AttributeInfo attributeInfo) {
    inspectionFeatureToggle.assertNewFeatureIsEnabled(InspectionFeature.STATISTICS);
    return SubjectType.FACILITY;
  }

  @Override
  protected Object getSpecificValue(
      Inspection procedure, AttributeInfo attributeInfo, UUID dataSourceId, boolean anonymized) {
    inspectionFeatureToggle.assertNewFeatureIsEnabled(InspectionFeature.STATISTICS);
    if (!dataSourceId.equals(INSPECTION_DATA_SOURCE_ID)) {
      throw new IllegalArgumentException("Only inspection allowed here");
    }
    InspectionAttributes attribute = (InspectionAttributes) attributeInfo;
    return switch (attribute) {
      case PROCEDURE_ID -> procedure.getExternalId();
      case FACILITY_CENTRAL_FILE_ID -> procedure.getCentralFileStateId();
      case YEAR_OF_INSPECTION -> getYearOfInspection(procedure);
      case OBJECT_TYPE -> getObjectTypeName(procedure.getFacility().getObjectType());
      case RESULT -> procedure.getResult();
      case DURATION -> getDuration(procedure);
      case NUMBER_OF_INCIDENTS -> procedure.getIncidents().size();
    };
  }

  @Override
  protected SpecificData getSpecificDataNotProcedureBased(
      String dataSourceName,
      GetSpecificDataRequest getSpecificDataRequest,
      List<AttributeInfo> requestedAttributeInfos,
      DataTableHeader dataTableHeader) {
    inspectionFeatureToggle.assertNewFeatureIsEnabled(InspectionFeature.STATISTICS);
    if (!dataSourceName.equals(FACILITY_DATA_SOURCE_NAME)) {
      throw new IllegalArgumentException("Only facility allowed here");
    }

    List<FacilityAttributes> facilityAttributes =
        requestedAttributeInfos.stream().map(FacilityAttributes.class::cast).toList();

    Page<Facility> facilitiesPage =
        facilityRepository.findFacilitiesWithInspectionsBefore(
            getSpecificDataRequest.timeRangeEnd(),
            PageRequest.of(getSpecificDataRequest.page(), getSpecificDataRequest.pageSize()));

    List<DataRow> dataRows =
        facilitiesPage.getContent().stream()
            .map(
                facility ->
                    facilityToDataRow(
                        facility,
                        facilityAttributes,
                        getSpecificDataRequest.timeRangeStart(),
                        getSpecificDataRequest.timeRangeEnd()))
            .toList();

    return new SpecificData(
        dataSourceName,
        getSpecificDataRequest.timeRangeStart(),
        getSpecificDataRequest.timeRangeEnd(),
        dataTableHeader,
        dataRows,
        facilitiesPage.getTotalElements());
  }

  @Override
  protected Specification<Inspection> getProcedureSpecification(
      Instant startTimestamp, Instant endTimestamp) {
    return (root, query, criteriaBuilder) -> {
      Path<Instant> appointmentStartPath =
          root.join(Inspection_.executionAppointment).get(InspectionAppointment_.appointmentStart);

      Predicate appointmentStartInTimeRange =
          isInTimeRange(criteriaBuilder, appointmentStartPath, startTimestamp, endTimestamp);

      Predicate isClosed =
          criteriaBuilder.equal(root.get(Procedure_.procedureStatus), ProcedureStatus.CLOSED);

      return criteriaBuilder.and(appointmentStartInTimeRange, isClosed);
    };
  }

  private <T extends Temporal & Comparable<? super T>> Predicate isInTimeRange(
      CriteriaBuilder criteriaBuilder,
      Expression<T> temporalPath,
      T startInclusive,
      T endExclusive) {
    return criteriaBuilder.and(
        criteriaBuilder.greaterThanOrEqualTo(temporalPath, startInclusive),
        criteriaBuilder.lessThan(temporalPath, endExclusive));
  }

  private Integer getYearOfInspection(Inspection inspection) {
    InspectionAppointment appointment = inspection.getExecutionAppointment();
    if (appointment == null) {
      return null;
    }
    return LocalDate.ofInstant(appointment.getAppointmentStart(), clock.getZone()).getYear();
  }

  private Long getDuration(Inspection inspection) {
    InspectionAppointment appointment = inspection.getExecutionAppointment();
    if (appointment == null) {
      return null;
    }
    return (appointment.getAppointmentEnd().getEpochSecond()
            - appointment.getAppointmentStart().getEpochSecond())
        / 60L;
  }

  private DataRow facilityToDataRow(
      Facility facility,
      List<FacilityAttributes> requestedAttributeInfos,
      Instant timeRangeStart,
      Instant timeRangeEnd) {
    return new DataRow(
        requestedAttributeInfos.stream()
            .map(
                attribute ->
                    getFacilityAttribute(facility, attribute, timeRangeStart, timeRangeEnd))
            .toList());
  }

  private Object getFacilityAttribute(
      Facility facility,
      FacilityAttributes attribute,
      Instant timeRangeStart,
      Instant timeRangeEnd) {
    return switch (attribute) {
      case CENTRAL_FILE_ID ->
          facilityRepository
              .findNewestCentralFileStateIdForFacilityWithExecutionAppointmentIn(
                  facility, timeRangeStart, timeRangeEnd)
              .orElseGet(
                  () ->
                      facilityRepository
                          .findNewestCentralFileStateIdForFacility(facility)
                          .orElseThrow());
      case OBJECT_TYPE -> getObjectTypeName(facility.getObjectType());
      case COMPLAINED_ABOUT ->
          facilityRepository
              .findHasInspectionsWithResultForFacility(
                  facility,
                  timeRangeStart,
                  timeRangeEnd,
                  List.of(InspectionResult.SUCCESSFUL_WITH_INCIDENTS, InspectionResult.FAILED))
              .orElse(false);
      case BANNED ->
          facilityRepository
              .findHasInspectionsWithResultForFacility(
                  facility, timeRangeStart, timeRangeEnd, List.of(InspectionResult.FAILED))
              .orElse(false);
      case INSPECTED ->
          facilityRepository
              .findHasInspectionsForFacility(facility, timeRangeStart, timeRangeEnd)
              .orElse(false);
    };
  }

  private String getObjectTypeName(ObjectType objectType) {
    if (objectType == null) {
      return null;
    }
    return objectType.getName();
  }
}
