/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.calendar;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.calendar.lib.EventMetadataService;
import de.eshg.calendar.lib.api.EventWithMetaData;
import de.eshg.inspection.facility.FacilityClient;
import de.eshg.inspection.inspection.api.InspectionPhase;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.InspectionRelatedFacility;
import de.eshg.inspection.inspection.persistence.InspectionResource;
import de.eshg.inspection.inspection.persistence.InspectionResourceRepository;
import de.eshg.inspection.inspection.persistence.InspectionTaskRepository;
import java.time.Clock;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InspectionEventMetadataService implements EventMetadataService {

  private static final DateTimeFormatter DATE_FORMATTER =
      DateTimeFormatter.ofPattern("dd.MM.yyyy", Locale.GERMAN);

  private final InspectionTaskRepository inspectionTaskRepository;
  private final InspectionResourceRepository inspectionResourceRepository;
  private final FacilityClient facilityClient;
  private final Clock clock;

  public InspectionEventMetadataService(
      InspectionTaskRepository inspectionTaskRepository,
      InspectionResourceRepository inspectionResourceRepository,
      FacilityClient facilityClient,
      Clock clock) {
    this.inspectionTaskRepository = inspectionTaskRepository;
    this.inspectionResourceRepository = inspectionResourceRepository;
    this.facilityClient = facilityClient;
    this.clock = clock;
  }

  @Override
  @Transactional(readOnly = true)
  public Stream<EventWithMetaData> findByCalendarEventIds(List<UUID> eventIds) {
    List<Inspection> taskInspections =
        inspectionTaskRepository.findAllByCalendarEventIdOrderById(eventIds);
    Stream<EventWithMetaData> resultTask =
        taskInspections.stream().map(this::mapInspectionToEventMetaData);
    List<InspectionResource> resourceInspections =
        inspectionResourceRepository.findAllByCalendarEventIdOrderById(eventIds);
    Stream<EventWithMetaData> resultResource =
        resourceInspections.stream().map(this::mapResourceToEventMetaData);
    return Stream.concat(resultTask, resultResource);
  }

  private EventWithMetaData mapInspectionToEventMetaData(Inspection inspection) {
    InspectionRelatedFacility facility = inspection.getRelatedFacility();
    GetFacilityFileStateResponse baseFacility = getBaseFacility(facility);

    String descriptionPrefix;
    Instant appointmentEnd;
    if (inspection.getExecutionAppointment() != null) {
      appointmentEnd = inspection.getExecutionAppointment().getAppointmentEnd();
      if (inspection.getPhase() == InspectionPhase.READY_FOR_EXECUTION
          || inspection.getPhase() == InspectionPhase.EXECUTING) {
        descriptionPrefix = "Durchführung bis ";
      } else {
        descriptionPrefix = "Ausgeführt am ";
      }
    } else {
      appointmentEnd = inspection.getPlannedAppointment().getAppointmentEnd();
      descriptionPrefix = "Bitte planen Sie die Begehung bis zum ";
    }

    String endDateString = appointmentEnd.atZone(clock.getZone()).format(DATE_FORMATTER);
    return new EventWithMetaData(
        inspection.getCalendarEventId(),
        "Begehung " + baseFacility.name(),
        descriptionPrefix + endDateString,
        getLocation(baseFacility),
        inspection.getExternalId());
  }

  private EventWithMetaData mapResourceToEventMetaData(InspectionResource inspectionResource) {
    InspectionRelatedFacility facility = inspectionResource.getInspection().getRelatedFacility();
    GetFacilityFileStateResponse baseFacility = getBaseFacility(facility);
    return new EventWithMetaData(
        inspectionResource.getCalendarEventId(),
        "Begehung " + baseFacility.name(),
        "gebucht für Begehung " + baseFacility.name(),
        getLocation(baseFacility),
        inspectionResource.getExternalId());
  }

  private String getLocation(GetFacilityFileStateResponse baseFacility) {
    AddressDto address = baseFacility.contactAddress();
    return baseFacility.name() + ", " + getAddressString(address);
  }

  private static String getAddressString(AddressDto address) {
    if (address instanceof DomesticAddressDto domesticAddress) {
      return "%s%s, %s %s"
          .formatted(
              domesticAddress.street(),
              isNotBlank(domesticAddress.houseNumber()) ? " " + domesticAddress.houseNumber() : "",
              domesticAddress.postalCode(),
              domesticAddress.city());
    } else {
      throw new IllegalArgumentException("Unexpected instance of Address");
    }
  }

  private GetFacilityFileStateResponse getBaseFacility(InspectionRelatedFacility facility) {
    return facilityClient.getFacilityFileState(facility.getCentralFileStateId());
  }
}
