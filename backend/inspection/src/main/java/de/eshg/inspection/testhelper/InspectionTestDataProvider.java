/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper;

import de.eshg.base.calendar.CalendarEventApi;
import de.eshg.base.calendar.api.BlockingEventsOfResource;
import de.eshg.base.calendar.api.GetBlockingEventsOfResourcesRequest;
import de.eshg.base.calendar.api.GetBlockingEventsOfResourcesResponse;
import de.eshg.base.inventory.InventoryApi;
import de.eshg.base.inventory.api.AddInventoryItemRequest;
import de.eshg.base.inventory.api.InventoryItemDto;
import de.eshg.base.inventory.api.InventoryItemFilterParameters;
import de.eshg.base.inventory.api.InventoryItemTypeDto;
import de.eshg.base.resource.ResourceApi;
import de.eshg.base.resource.api.AddResourceRequest;
import de.eshg.base.resource.api.ResourceDto;
import de.eshg.base.resource.api.ResourceFilterParameters;
import de.eshg.base.resource.api.ResourceTypeDto;
import de.eshg.inspection.checklist.api.ChecklistDto;
import de.eshg.inspection.checklist.api.ChecklistSectionDto;
import de.eshg.inspection.checklist.api.GetChecklistsResponse;
import de.eshg.inspection.checklist.api.element.ChecklistElementDto;
import de.eshg.inspection.checklist.api.element.field.ChecklistCheckboxFieldDto;
import de.eshg.inspection.checklist.api.element.field.ChecklistMultiSelectFieldDto;
import de.eshg.inspection.checklist.api.element.field.ChecklistSingleSelectFieldDto;
import de.eshg.inspection.checklist.api.element.field.ChecklistTextFieldDto;
import de.eshg.inspection.checklist.api.update.UpdateChecklistDto;
import de.eshg.inspection.checklist.api.update.element.UpdateChecklistCheckboxDto;
import de.eshg.inspection.checklist.api.update.element.UpdateChecklistElementDto;
import de.eshg.inspection.checklist.api.update.element.UpdateChecklistMultiSelectDto;
import de.eshg.inspection.checklist.api.update.element.UpdateChecklistSingleSelectDto;
import de.eshg.inspection.checklist.api.update.element.UpdateChecklistTextDto;
import de.eshg.inspection.feature.InspectionFeature;
import de.eshg.inspection.feature.InspectionFeatureToggle;
import de.eshg.inspection.incident.InspectionIncidentService;
import de.eshg.inspection.incident.api.CreateInspectionIncidentRequest;
import de.eshg.inspection.inspection.InspectionService;
import de.eshg.inspection.inspection.api.FinalizeInspectionRequest;
import de.eshg.inspection.inspection.api.FollowupType;
import de.eshg.inspection.inspection.api.InspectionAvailableCLDVersionsResponse;
import de.eshg.inspection.inspection.api.InspectionCLDVersionDto;
import de.eshg.inspection.inspection.api.InspectionDto;
import de.eshg.inspection.inspection.api.InspectionResult;
import de.eshg.inspection.inspection.api.UpdateInspectionAddResourceRequest;
import de.eshg.inspection.inspection.api.UpdateInspectionAppointmentDto;
import de.eshg.inspection.inspection.api.UpdateInspectionModifyInventoryRequest;
import de.eshg.inspection.inspection.api.UpdateInspectionRequest;
import de.eshg.inspection.sample.InspectionSampleService;
import de.eshg.inspection.sample.api.CreateInspectionSampleMeasurementParameterRequest;
import de.eshg.inspection.sample.api.CreateInspectionSampleRequest;
import de.eshg.inspection.sample.api.GetInspectionSamplesResponse;
import de.eshg.inspection.sample.api.InspectionSampleDto;
import de.eshg.inspection.sample.api.InspectionSampleEvaluationTypeDto;
import de.eshg.inspection.sample.api.InspectionSampleInspectedFacilityReferenceDto;
import de.eshg.inspection.sample.api.InspectionSampleTypeDto;
import de.eshg.inspection.sample.api.UpdateInspectionSampleMeasurementParameterValueRequest;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import net.datafaker.Faker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class InspectionTestDataProvider {

  private static final Logger log = LoggerFactory.getLogger(InspectionTestDataProvider.class);

  private final InspectionService inspectionService;
  private final ResourceApi resourceApi;
  private final InventoryApi inventoryApi;
  private final CalendarEventApi calendarEventApi;
  private final InspectionIncidentService inspectionIncidentService;

  private static final int INSPECTIONS_FOR_SIXTH_FACILITY = 4;
  private static final List<String> resourceNames =
      List.of(
          "Bulls Wildtail", "Seat Leon", "Hilbertraum", "Nikon Z8", "Lineal", "Linealset", "Auryn");
  private static final List<ResourceTypeDto> resourceTypes =
      List.of(
          ResourceTypeDto.BICYCLE,
          ResourceTypeDto.CAR,
          ResourceTypeDto.ROOM,
          ResourceTypeDto.CAMERA,
          ResourceTypeDto.MEASURING_DEVICE,
          ResourceTypeDto.MEASURING_KIT,
          ResourceTypeDto.MISC);

  private static final String inventoryName = "FFP2-Maske";
  private static final InventoryItemTypeDto inventoryType =
      InventoryItemTypeDto.PROTECTIVE_EQUIPMENT;

  private static final String ZID_CHLOR_FREI = "299999999000000001421"; // only upper limit: 0,3
  private static final String ZID_CHLOR_GEBUNDEN = "299999999000000000808"; // only upper limit: 0,2

  private final InspectionSampleService inspectionSampleService;

  private final InspectionFeatureToggle inspectionFeatureToggle;

  public InspectionTestDataProvider(
      InspectionService inspectionService,
      ResourceApi resourceApi,
      InventoryApi inventoryApi,
      CalendarEventApi calendarEventApi,
      InspectionIncidentService inspectionIncidentService,
      InspectionSampleService inspectionSampleService,
      InspectionFeatureToggle inspectionFeatureToggle) {
    this.inspectionService = inspectionService;
    this.resourceApi = resourceApi;
    this.inventoryApi = inventoryApi;
    this.calendarEventApi = calendarEventApi;
    this.inspectionIncidentService = inspectionIncidentService;
    this.inspectionSampleService = inspectionSampleService;
    this.inspectionFeatureToggle = inspectionFeatureToggle;
  }

  public void prepareTestInspection(
      @NotNull UUID inspectionId, @NotNull UUID centralFileStateId, Faker faker, int index) {
    /*
    The inspections that should be created with the respective indices are:
    0: Facility with inspection in DRAFT status (inspection wasn't started yet)
    1: Inspection in phase NEW (nothing will be done here)
    2: Inspection in phase PLANNING
    3: Inspection in phase EXECUTING
    4: Inspection in phase CREATING_REPORT_AND_INVOICE
    5: Inspection in phase CLOSED (thereby also creating followup inspection)
    6: Lots of Inspections
    */

    if (index == 6) {
      prepareSixthTestInspection(inspectionId, faker, 0);
      return;
    }

    if ((index % FacilityTestDataProvider.NUMBER_OF_DEFINED_FACILITIES) > 1) {
      addPlannedAppointment(inspectionId, index);
      addResource(inspectionId, index);
      addInventory(inspectionId);
    }
    if ((index % FacilityTestDataProvider.NUMBER_OF_DEFINED_FACILITIES) > 2) {
      addChecklists(inspectionId);
      fillOutAllChecklists(inspectionId, faker);
      createManualIncident(inspectionId, faker);
      if (inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.SAMPLES)
          && inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.TEIS_DATA)) {
        addUnfinishedSample(inspectionId, centralFileStateId);
      }
    }
    if ((index % FacilityTestDataProvider.NUMBER_OF_DEFINED_FACILITIES) > 3) {
      inspectionService.finalizeInspection(inspectionId, new FinalizeInspectionRequest(null), null);
      if (inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.SAMPLES)
          && inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.TEIS_DATA)) {
        fillOutSample(inspectionId);
      }
    }
    if ((index % FacilityTestDataProvider.NUMBER_OF_DEFINED_FACILITIES) > 4) {
      inspectionService.approveInspection(inspectionId);
    }
  }

  public void prepareSixthTestInspection(
      @NotNull UUID inspectionId, Faker faker, int inspectionIndex) {
    int index = 6;

    addPlannedAppointment(inspectionId, index + inspectionIndex);
    addResource(inspectionId, index);
    addInventory(inspectionId);
    if (inspectionIndex % 2 == 0) {
      addChecklists(inspectionId);
    }
    fillOutAllChecklists(inspectionId, faker);
    createManualIncident(inspectionId, faker);
    inspectionService.finalizeInspection(inspectionId, new FinalizeInspectionRequest(null), null);
    if (inspectionIndex == INSPECTIONS_FOR_SIXTH_FACILITY - 1) {
      failInspection(inspectionId);
    } else if (inspectionIndex % 2 == 0) {
      almostFailInspection(inspectionId, index + inspectionIndex);
    } else {
      passInspection(inspectionId);
    }
    InspectionDto inspection = inspectionService.approveInspection(inspectionId);
    if (inspectionIndex < INSPECTIONS_FOR_SIXTH_FACILITY - 1) {
      prepareSixthTestInspection(
          inspection.followupInfo().followupId(), faker, inspectionIndex + 1);
    }
  }

  private void almostFailInspection(UUID inspectionId, int index) {
    inspectionService.updateInspection(
        inspectionId,
        UpdateInspectionRequest.forResult(
            InspectionResult.SUCCESSFUL_WITH_INCIDENTS,
            FollowupType.REVIEW,
            getAppointmentTime(index).start()));
  }

  private void failInspection(UUID inspectionId) {
    inspectionService.updateInspection(
        inspectionId, UpdateInspectionRequest.forResult(InspectionResult.FAILED, null, null));
  }

  private void passInspection(UUID inspectionId) {
    inspectionService.updateInspection(
        inspectionId, UpdateInspectionRequest.forResult(InspectionResult.SUCCESSFUL, null, null));
  }

  private static UpdateChecklistElementDto getUpdateElementDto(
      ChecklistElementDto elementDto, Faker faker) {
    if (elementDto instanceof ChecklistCheckboxFieldDto checklistFieldDto) {
      return new UpdateChecklistCheckboxDto(checklistFieldDto.getId(), true);
    }
    if (elementDto instanceof ChecklistTextFieldDto checklistTextFieldDto) {
      return new UpdateChecklistTextDto(checklistTextFieldDto.getId(), faker.lorem().sentence());
    }
    if (elementDto instanceof ChecklistMultiSelectFieldDto checklistMultiSelectFieldDto) {
      return new UpdateChecklistMultiSelectDto(
          checklistMultiSelectFieldDto.getId(),
          List.of(checklistMultiSelectFieldDto.getContext().getItems().getFirst().getText()),
          true);
    }
    if (elementDto instanceof ChecklistSingleSelectFieldDto checklistSingleSelectFieldDto) {
      return new UpdateChecklistSingleSelectDto(
          checklistSingleSelectFieldDto.getId(),
          checklistSingleSelectFieldDto.getContext().getItems().getFirst().getText(),
          true);
    }
    return null;
  }

  private void fillOutChecklist(UUID inspectionId, ChecklistDto checklistDto, Faker faker) {
    for (ChecklistSectionDto sectionDto : checklistDto.getSections()) {
      for (ChecklistElementDto elementDto : sectionDto.getElements()) {

        if (elementDto instanceof ChecklistCheckboxFieldDto
            || elementDto instanceof ChecklistTextFieldDto
            || elementDto instanceof ChecklistMultiSelectFieldDto
            || elementDto instanceof ChecklistSingleSelectFieldDto) {
          UpdateChecklistDto updateChecklistDto =
              new UpdateChecklistDto(
                  Collections.singletonList(getUpdateElementDto(elementDto, faker)));

          inspectionService.updateChecklist(inspectionId, checklistDto.getId(), updateChecklistDto);
        }
      }
    }
  }

  private void fillOutAllChecklists(UUID inspectionId, Faker faker) {
    GetChecklistsResponse getChecklistsResponse = inspectionService.getChecklists(inspectionId);

    for (ChecklistDto checklistDto : getChecklistsResponse.checklists()) {
      fillOutChecklist(inspectionId, checklistDto, faker);
    }
  }

  private String getNameForResource(int index) {
    return resourceNames.get(index % FacilityTestDataProvider.NUMBER_OF_DEFINED_FACILITIES)
        + FacilityTestDataProvider.getNameSuffix(index);
  }

  private ResourceTypeDto getTypeForResource(int index) {
    return resourceTypes.get(index % FacilityTestDataProvider.NUMBER_OF_DEFINED_FACILITIES);
  }

  private ResourceDto createResource(int index) {
    return resourceApi.addResource(
        new AddResourceRequest(
            getNameForResource(index),
            "Resource für " + FacilityTestDataProvider.getNameOfFacility(index),
            "12345" + index,
            getTypeForResource(index),
            Collections.singletonList("Hygiene")));
  }

  private ResourceDto findOrCreateResource(int index) {
    String resourceName = getNameForResource(index);
    ResourceTypeDto resourceType = getTypeForResource(index);
    return resourceApi
        .getResources(
            new ResourceFilterParameters(resourceName, resourceType, "Hygiene", null, null, 0, 100))
        .elements()
        .stream()
        .filter(resourceDto -> resourceDto.name().equals(resourceName))
        .findFirst()
        .orElseGet(() -> createResource(index));
  }

  private void addResource(UUID inspectionId, int index) {
    ResourceDto resource = findOrCreateResource(index);

    Instant startTime = getAppointmentTime(index).start();
    Instant endTime = startTime.plus(Duration.ofMinutes(1));

    GetBlockingEventsOfResourcesResponse calendarResponse =
        calendarEventApi.getBlockingEventsOfResourceCalendars(
            new GetBlockingEventsOfResourcesRequest(
                Collections.singletonList(resource.id()), startTime, endTime));

    Optional<UUID> resourceId =
        calendarResponse.resourcesWithBlockingEvents().stream()
            .filter(entry -> entry.events().isEmpty())
            .findFirst()
            .map(BlockingEventsOfResource::resourceId);

    if (resourceId.isPresent()) {
      inspectionService.addResource(
          inspectionId,
          new UpdateInspectionAddResourceRequest(resourceId.get(), startTime, endTime));
    } else {
      log.error("No available resources found. Not adding any.");
    }
  }

  private InventoryItemDto createInventory() {
    return inventoryApi.addInventoryItem(
        new AddInventoryItemRequest(
            inventoryName,
            inventoryType,
            "Inventargegenstände für Begehungen",
            "123456",
            Collections.singletonList("Hygiene"),
            Integer.MAX_VALUE,
            100));
  }

  private InventoryItemDto findOrCreateInventory() {
    return inventoryApi
        .getInventoryItems(
            new InventoryItemFilterParameters(
                inventoryName, inventoryType, "Hygiene", null, null, 0, 100))
        .elements()
        .stream()
        .filter(inventoryItemDto -> inventoryItemDto.name().equals(inventoryName))
        .findFirst()
        .orElseGet(this::createInventory);
  }

  private void addInventory(UUID inspectionId) {
    InventoryItemDto inventoryItem = findOrCreateInventory();

    inspectionService.modifyInventory(
        inspectionId, new UpdateInspectionModifyInventoryRequest(inventoryItem.id(), null, 1));
  }

  private void addUnfinishedSample(UUID inspectionId, UUID centralFileStateId) {
    inspectionSampleService.createSample(
        inspectionId,
        new CreateInspectionSampleRequest(
            UUID.randomUUID(),
            InspectionSampleTypeDto.BATH_WATER,
            "Entnahmestelle",
            "Dusche links Herren",
            InspectionSampleEvaluationTypeDto.LABORATORY,
            new InspectionSampleInspectedFacilityReferenceDto(centralFileStateId),
            Instant.parse("2024-03-01T00:00:00.123456Z"),
            new InspectionSampleInspectedFacilityReferenceDto(centralFileStateId),
            null,
            List.of(
                new CreateInspectionSampleMeasurementParameterRequest(
                    UUID.randomUUID(), ZID_CHLOR_FREI, ""),
                new CreateInspectionSampleMeasurementParameterRequest(
                    UUID.randomUUID(), ZID_CHLOR_GEBUNDEN, ""))));
  }

  private void fillOutSample(UUID inspectionId) {
    GetInspectionSamplesResponse getSamplesResponse =
        inspectionSampleService.getSamples(inspectionId);

    for (InspectionSampleDto sample : getSamplesResponse.samples()) {
      inspectionSampleService.updateSampleMeasurementParameterValue(
          inspectionId,
          sample.sampleId(),
          sample.measurementParameters().getFirst().externalId(),
          new UpdateInspectionSampleMeasurementParameterValueRequest(10.0));
      inspectionSampleService.updateSampleMeasurementParameterValue(
          inspectionId,
          sample.sampleId(),
          sample.measurementParameters().getLast().externalId(),
          new UpdateInspectionSampleMeasurementParameterValueRequest(0.1));
    }
  }

  private static UpdateInspectionAppointmentDto getAppointmentTime(int index) {
    int year = index > 4 && index < 10 ? 2036 + (index % 2) : 2030 + index;
    OffsetDateTime startTime =
        OffsetDateTime.of(
            year,
            index % 12 + 1,
            index % 28 + 1,
            12 + (index % 12),
            0,
            0,
            0,
            ZoneOffset.ofHours(1));
    OffsetDateTime endTime = startTime.plusHours(3);
    return new UpdateInspectionAppointmentDto(startTime.toInstant(), endTime.toInstant());
  }

  private void addPlannedAppointment(UUID inspectionId, int index) {
    inspectionService.updateInspection(
        inspectionId, UpdateInspectionRequest.forPlannedAppointment(getAppointmentTime(index)));
  }

  private void addChecklists(UUID inspectionId) {
    InspectionAvailableCLDVersionsResponse availableCLDVersionsResponse =
        inspectionService.getAvailableCLDs(inspectionId);

    List<UUID> checklistIds =
        availableCLDVersionsResponse
            .versions()
            .subList(0, Math.min(2, availableCLDVersionsResponse.versions().size()))
            .stream()
            .map(InspectionCLDVersionDto::versionId)
            .toList();

    inspectionService.updateInspection(
        inspectionId, UpdateInspectionRequest.forChecklistDefinitionVersionIds(checklistIds));
  }

  private void createManualIncident(UUID inspectionId, Faker faker) {
    inspectionIncidentService.createIncident(
        inspectionId,
        new CreateInspectionIncidentRequest(
            faker.lorem().sentence(5),
            faker.lorem().paragraph(),
            UUID.fromString(faker.internet().uuid())));
  }
}
