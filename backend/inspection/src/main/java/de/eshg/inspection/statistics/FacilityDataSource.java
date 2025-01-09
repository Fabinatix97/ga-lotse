/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.statistics;

import de.eshg.inspection.facility.persistence.Facility;
import de.eshg.inspection.facility.persistence.FacilityRepository;
import de.eshg.inspection.inspection.api.InspectionResult;
import de.eshg.inspection.objecttype.ObjectTypeProperties;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.datasource.EntityDataSource;
import de.eshg.lib.statistics.util.TimeRange;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

@Component
public class FacilityDataSource extends EntityDataSource<Facility, FacilityAttributes> {
  public static final UUID DATA_SOURCE_ID = UUID.fromString("3f5939db-c5ca-4567-ae03-33012e2abc39");
  public static final String DATA_SOURCE_NAME = "Einrichtungen";

  private final FacilityRepository facilityRepository;

  public FacilityDataSource(
      FacilityRepository facilityRepository, ObjectTypeProperties objectTypeProperties) {
    super(
        DATA_SOURCE_ID,
        DATA_SOURCE_NAME,
        DataSourceSensitivity.INTERNAL_USAGE,
        FacilityAttributes.values(),
        false);
    this.facilityRepository = facilityRepository;
    AttributeUtil.addValueOptions(FacilityAttributes.OBJECT_TYPE, objectTypeProperties);
  }

  @Override
  protected Page<Facility> retrieveEntities(TimeRange timeRange, int page, int pageSize) {
    return facilityRepository.findFacilitiesWithInspectionsBefore(
        timeRange.end(), PageRequest.of(page, pageSize));
  }

  @Override
  protected Object mapSpecificValue(
      Facility facility, FacilityAttributes attribute, TimeRange timeRange) {
    Instant timeRangeStart = timeRange.start();
    Instant timeRangeEnd = timeRange.end();
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
      case OBJECT_TYPE -> AttributeUtil.getObjectTypeName(facility.getObjectType());
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
}
