/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample;

import static de.eshg.inspection.inspection.InspectionUtils.checkInspectionIsNotClosed;

import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.base.contact.api.InstitutionContactDto;
import de.eshg.base.user.api.UserDto;
import de.eshg.inspection.client.ContactClient;
import de.eshg.inspection.client.UserClient;
import de.eshg.inspection.facility.FacilityClient;
import de.eshg.inspection.inspection.InspectionMapper;
import de.eshg.inspection.inspection.InspectionService;
import de.eshg.inspection.inspection.InspectionUpdater;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.sample.api.CreateInspectionSampleMeasurementParameterRequest;
import de.eshg.inspection.sample.api.CreateInspectionSampleRequest;
import de.eshg.inspection.sample.api.GetInspectionSamplesResponse;
import de.eshg.inspection.sample.api.InspectionSampleActorReferenceDto;
import de.eshg.inspection.sample.api.InspectionSampleContactReferenceDto;
import de.eshg.inspection.sample.api.InspectionSampleDto;
import de.eshg.inspection.sample.api.InspectionSampleInspectedFacilityReferenceDto;
import de.eshg.inspection.sample.api.InspectionSampleMeasurementParameterDto;
import de.eshg.inspection.sample.api.InspectionSampleUserReferenceDto;
import de.eshg.inspection.sample.api.UpdateInspectionSampleMeasurementParameterUserAssessmentRequest;
import de.eshg.inspection.sample.api.UpdateInspectionSampleMeasurementParameterValueRequest;
import de.eshg.inspection.sample.api.UpdateInspectionSampleRequest;
import de.eshg.inspection.sample.persistence.InspectionSample;
import de.eshg.inspection.sample.persistence.InspectionSampleEvaluationType;
import de.eshg.inspection.sample.persistence.InspectionSampleMeasurementParameter;
import de.eshg.inspection.sample.persistence.InspectionSampleMeasurementParameterRepository;
import de.eshg.inspection.sample.persistence.InspectionSamplePreclassification;
import de.eshg.inspection.sample.persistence.InspectionSampleType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Clock;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class InspectionSampleService {

  private final InspectionService inspectionService;
  private final InspectionUpdater inspectionUpdater;
  private final InspectionMapper inspectionMapper;
  private final InspectionSampleMeasurementParameterRepository
      inspectionSampleMeasurementParameterRepository;
  private final Clock clock;
  private final FacilityClient facilityClient;
  private final UserClient userClient;
  private final ContactClient contactClient;

  public InspectionSampleService(
      InspectionService inspectionService,
      InspectionUpdater inspectionUpdater,
      InspectionMapper inspectionMapper,
      InspectionSampleMeasurementParameterRepository inspectionSampleMeasurementParameterRepository,
      Clock clock,
      FacilityClient facilityClient,
      UserClient userClient,
      ContactClient contactClient) {
    this.inspectionService = inspectionService;
    this.inspectionUpdater = inspectionUpdater;
    this.inspectionMapper = inspectionMapper;
    this.inspectionSampleMeasurementParameterRepository =
        inspectionSampleMeasurementParameterRepository;
    this.clock = clock;
    this.facilityClient = facilityClient;
    this.userClient = userClient;
    this.contactClient = contactClient;
  }

  public GetInspectionSamplesResponse getSamples(UUID inspectionId) {
    Inspection inspection = inspectionService.loadInspection(inspectionId);
    List<InspectionSampleDto> sampleDtos = inspectionMapper.mapSamples(inspection);
    return new GetInspectionSamplesResponse(sampleDtos);
  }

  public InspectionSampleDto createSample(
      UUID inspectionId, CreateInspectionSampleRequest request) {
    Inspection inspection = inspectionService.loadInspectionForUpdate(inspectionId);
    checkInspectionIsNotClosed(
        inspection,
        "Proben können nicht zu abgeschlossenen Vorgängen hinzugefügt werden.",
        "sample could not be added");

    GetFacilityFileStateResponse facilityFileState =
        actorReferencesContainInspectedFacility(
                List.of(request.evaluatingActor(), request.samplingActor()))
            ? facilityClient.getFacilityFileState(inspection.getCentralFileStateId())
            : null;

    Map<UUID, UserDto> userMap =
        userClient.getUsersAsMap(
            getUserIdsFromActorReferences(
                List.of(request.samplingActor(), request.evaluatingActor())),
            true);
    Map<UUID, ContactDto> contactMap =
        contactClient.getContactsAsMap(
            getContactIdsFromActorReferences(
                List.of(request.samplingActor(), request.evaluatingActor())),
            true);

    for (ContactDto contact : contactMap.values()) {
      validateContact(contact);
    }

    InspectionSample sample = new InspectionSample();
    sample.setSampleExternalId(request.externalId());
    sample.setTypeOfSample(InspectionSampleType.valueOf(request.typeOfSample().name()));
    sample.setPointOfWithdrawal(request.pointOfWithdrawal());
    sample.setNameOfSamplingPoint(request.nameOfSamplingPoint());
    sample.setEvaluationType(
        InspectionSampleEvaluationType.valueOf(request.evaluationType().name()));

    sample.setSamplingActor(InspectionSampleMapper.mapToPersistenceObject(request.samplingActor()));
    sample.setEvaluatingActor(
        InspectionSampleMapper.mapToPersistenceObject(request.evaluatingActor()));

    sample.setTimeOfSampling(request.timeOfSampling());
    sample.setTimeOfEvaluation(request.timeOfEvaluation());
    sample.setCreatedAt(clock.instant());
    sample.setModifiedAt(clock.instant());
    addNewMeasurementParameters(sample, request.measurementParameters());

    inspection.addSample(sample);

    inspectionUpdater.updateModified(inspection);

    return InspectionSampleMapper.mapToDto(sample, facilityFileState, userMap, contactMap);
  }

  public InspectionSampleDto updateSample(
      UUID inspectionId, UUID sampleId, UpdateInspectionSampleRequest request) {
    Inspection inspection = inspectionService.loadInspectionForUpdate(inspectionId);
    checkInspectionIsNotClosed(
        inspection,
        "Proben von abgeschlossenen Vorgängen können nicht geändert werden.",
        "sample could not be updated");
    InspectionSample sample = findInspectionSample(inspection, sampleId);

    GetFacilityFileStateResponse facilityFileState =
        actorReferencesContainInspectedFacility(
                List.of(request.evaluatingActor(), request.samplingActor()))
            ? facilityClient.getFacilityFileState(inspection.getCentralFileStateId())
            : null;

    Map<UUID, UserDto> userMap =
        userClient.getUsersAsMap(
            getUserIdsFromActorReferences(
                List.of(request.samplingActor(), request.evaluatingActor())),
            true);
    Map<UUID, ContactDto> contactMap =
        contactClient.getContactsAsMap(
            getContactIdsFromActorReferences(
                List.of(request.samplingActor(), request.evaluatingActor())),
            true);

    for (ContactDto contact : contactMap.values()) {
      validateContact(contact);
    }

    // TODO Maybe this should be in the mapper?
    sample.setTypeOfSample(InspectionSampleType.valueOf(request.typeOfSample().name()));
    sample.setPointOfWithdrawal(request.pointOfWithdrawal());
    sample.setNameOfSamplingPoint(request.nameOfSamplingPoint());
    sample.setEvaluationType(
        InspectionSampleEvaluationType.valueOf(request.evaluationType().name()));

    sample.setSamplingActor(InspectionSampleMapper.mapToPersistenceObject(request.samplingActor()));
    sample.setEvaluatingActor(
        InspectionSampleMapper.mapToPersistenceObject(request.evaluatingActor()));

    sample.setTimeOfSampling(request.timeOfSampling());
    sample.setTimeOfEvaluation(request.timeOfEvaluation());

    for (UUID measurementParameterId : request.measurementParametersToDelete()) {
      InspectionSampleMeasurementParameter measurementParameter =
          findInspectionSampleMeasurementParameter(sample, measurementParameterId);

      sample.getMeasurementParameters().remove(measurementParameter);
      inspectionSampleMeasurementParameterRepository.delete(measurementParameter);
    }

    addNewMeasurementParameters(sample, request.measurementParametersToAdd());

    inspectionUpdater.updateModified(inspection);

    return InspectionSampleMapper.mapToDto(sample, facilityFileState, userMap, contactMap);
  }

  public InspectionSampleMeasurementParameterDto updateSampleMeasurementParameterValue(
      UUID inspectionId,
      UUID sampleId,
      UUID measurementParameterId,
      UpdateInspectionSampleMeasurementParameterValueRequest request) {
    Inspection inspection = inspectionService.loadInspectionForUpdate(inspectionId);
    checkInspectionIsNotClosed(
        inspection,
        "Proben von abgeschlossenen Vorgängen können nicht geändert werden.",
        "sample could not be updated");
    InspectionSample sample = findInspectionSample(inspection, sampleId);

    InspectionSampleMeasurementParameter measurementParameter =
        findInspectionSampleMeasurementParameter(sample, measurementParameterId);

    measurementParameter.setMeasurementValue(request.value());
    determinePreclassification(measurementParameter);

    return InspectionSampleMapper.mapToDto(measurementParameter);
  }

  public InspectionSampleMeasurementParameterDto updateSampleMeasurementParameterUserAssessment(
      UUID inspectionId,
      UUID sampleId,
      UUID measurementParameterId,
      UpdateInspectionSampleMeasurementParameterUserAssessmentRequest request) {
    Inspection inspection = inspectionService.loadInspectionForUpdate(inspectionId);
    checkInspectionIsNotClosed(
        inspection,
        "Proben von abgeschlossenen Vorgängen können nicht geändert werden.",
        "sample could not be updated");
    InspectionSample sample = findInspectionSample(inspection, sampleId);

    InspectionSampleMeasurementParameter measurementParameter =
        findInspectionSampleMeasurementParameter(sample, measurementParameterId);

    if (measurementParameter.getPreclassification() == InspectionSamplePreclassification.WITHIN_NORM
        && request.userAssessment() != null) {
      throw new BadRequestException(
          "User assessment is only allowed for values that are outside the norm.");
    }

    measurementParameter.setUserAssessment(request.userAssessment());

    return InspectionSampleMapper.mapToDto(measurementParameter);
  }

  // private void removeMeasurementParameter(InspectionSample sample, me)

  public void deleteSample(UUID inspectionId, UUID sampleId) {
    Inspection inspection = inspectionService.loadInspectionForUpdate(inspectionId);
    checkInspectionIsNotClosed(
        inspection,
        "Proben von abgeschlossenen Vorgängen können nicht gelöscht werden.",
        "sample could not be deleted");

    InspectionSample sample = findInspectionSample(inspection, sampleId);

    inspection.getSamples().remove(sample);

    inspectionUpdater.updateModified(inspection);
  }

  private void determinePreclassification(
      InspectionSampleMeasurementParameter measurementParameter) {

    // TODO Replace this with the proper preclassification logic!
    if (measurementParameter.getMeasurementValue() < 1.0) {
      measurementParameter.setPreclassification(InspectionSamplePreclassification.TOO_LOW);
    } else if (measurementParameter.getMeasurementValue() > 5.0) {
      measurementParameter.setPreclassification(InspectionSamplePreclassification.TOO_HIGH);
    } else {
      measurementParameter.setPreclassification(InspectionSamplePreclassification.WITHIN_NORM);
    }

    if (measurementParameter.getPreclassification() != InspectionSamplePreclassification.TOO_LOW
        && measurementParameter.getPreclassification()
            != InspectionSamplePreclassification.TOO_HIGH) {
      measurementParameter.setUserAssessment(null);
    }
  }

  private void addNewMeasurementParameters(
      InspectionSample sample,
      List<CreateInspectionSampleMeasurementParameterRequest> measurementParametersToAdd) {
    for (CreateInspectionSampleMeasurementParameterRequest measurementParameterDto :
        measurementParametersToAdd) {
      InspectionSampleMeasurementParameter measurementParameter =
          InspectionSampleMapper.mapToPersistenceObject(measurementParameterDto);
      sample.addMeasurementParameter(measurementParameter);
    }
  }

  private static InspectionSample findInspectionSample(Inspection inspection, UUID sampleId) {
    return inspection.getSamples().stream()
        .filter(sample -> sample.getSampleExternalId().equals(sampleId))
        .findAny()
        .orElseThrow(() -> new NotFoundException("Sample not found for given id"));
  }

  private static InspectionSampleMeasurementParameter findInspectionSampleMeasurementParameter(
      InspectionSample sample, UUID measurementParameterId) {
    return sample.getMeasurementParameters().stream()
        .filter(mp -> mp.getMeasurementParameterExternalId().equals(measurementParameterId))
        .findAny()
        .orElseThrow(
            () -> new NotFoundException("Sample measurement parameter not found for given id"));
  }

  private void validateContact(ContactDto contact) {
    if (contact instanceof InstitutionContactDto institution) {
      if (institution.category() != InstitutionContactCategoryDto.LABORATORY) {
        throw new BadRequestException(
            "Institution must be laboratory but it is " + institution.category());
      }
    }
  }

  private static boolean actorReferencesContainInspectedFacility(
      Collection<InspectionSampleActorReferenceDto> actors) {
    return actors.stream()
        .filter(Objects::nonNull)
        .anyMatch(actor -> actor instanceof InspectionSampleInspectedFacilityReferenceDto);
  }

  private static Set<UUID> getUserIdsFromActorReferences(
      Collection<InspectionSampleActorReferenceDto> actors) {
    return actors.stream()
        .filter(Objects::nonNull)
        .filter(actor -> actor instanceof InspectionSampleUserReferenceDto)
        .map(actor -> ((InspectionSampleUserReferenceDto) actor).userId())
        .collect(Collectors.toSet());
  }

  private static Set<UUID> getContactIdsFromActorReferences(
      Collection<InspectionSampleActorReferenceDto> actors) {
    return actors.stream()
        .filter(Objects::nonNull)
        .filter(actor -> actor instanceof InspectionSampleContactReferenceDto)
        .map(actor -> ((InspectionSampleContactReferenceDto) actor).contactId())
        .collect(Collectors.toSet());
  }
}
