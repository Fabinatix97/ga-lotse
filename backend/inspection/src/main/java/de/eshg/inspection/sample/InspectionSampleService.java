/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample;

import static de.eshg.inspection.inspection.InspectionUtils.checkInspectionIsNotClosed;
import static java.util.Locale.ROOT;

import de.eshg.api.commons.SortDirection;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.contact.api.ContactFilterParameters;
import de.eshg.base.contact.api.ContactSortKey;
import de.eshg.base.contact.api.ContactTypeDto;
import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.base.contact.api.InstitutionContactDto;
import de.eshg.base.user.api.UserDto;
import de.eshg.base.user.api.UserFilterParameters;
import de.eshg.base.user.api.UserRoleDto;
import de.eshg.inspection.client.ContactClient;
import de.eshg.inspection.client.UserClient;
import de.eshg.inspection.facility.FacilityClient;
import de.eshg.inspection.inspection.InspectionMapper;
import de.eshg.inspection.inspection.InspectionService;
import de.eshg.inspection.inspection.InspectionUpdater;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.sample.api.AutocompleteActorDto;
import de.eshg.inspection.sample.api.AutocompleteActorResponse;
import de.eshg.inspection.sample.api.AutocompleteContactDto;
import de.eshg.inspection.sample.api.AutocompleteParameterResponse;
import de.eshg.inspection.sample.api.AutocompleteUserDto;
import de.eshg.inspection.sample.api.CreateInspectionSampleMeasurementParameterRequest;
import de.eshg.inspection.sample.api.CreateInspectionSampleRequest;
import de.eshg.inspection.sample.api.GetInspectionSamplesResponse;
import de.eshg.inspection.sample.api.GetUntersuchungsparameterResponse;
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
import de.eshg.inspection.teis.persistence.TeisParameter;
import de.eshg.inspection.teis.persistence.TeisParameterRepository;
import de.eshg.inspection.teis.persistence.TeisUntersuchungsparameter;
import de.eshg.inspection.teis.persistence.TeisUntersuchungsparameterRepository;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Clock;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
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
  private final InspectionSampleMapper inspectionSampleMapper;
  private final TeisParameterRepository teisParameterRepository;
  private final TeisUntersuchungsparameterRepository teisUntersuchungsparameterRepository;

  public InspectionSampleService(
      InspectionService inspectionService,
      InspectionUpdater inspectionUpdater,
      InspectionMapper inspectionMapper,
      InspectionSampleMeasurementParameterRepository inspectionSampleMeasurementParameterRepository,
      Clock clock,
      FacilityClient facilityClient,
      UserClient userClient,
      ContactClient contactClient,
      InspectionSampleMapper inspectionSampleMapper,
      TeisParameterRepository teisParameterRepository,
      TeisUntersuchungsparameterRepository teisUntersuchungsparameterRepository) {
    this.inspectionService = inspectionService;
    this.inspectionUpdater = inspectionUpdater;
    this.inspectionMapper = inspectionMapper;
    this.inspectionSampleMeasurementParameterRepository =
        inspectionSampleMeasurementParameterRepository;
    this.clock = clock;
    this.facilityClient = facilityClient;
    this.userClient = userClient;
    this.contactClient = contactClient;
    this.inspectionSampleMapper = inspectionSampleMapper;
    this.teisParameterRepository = teisParameterRepository;
    this.teisUntersuchungsparameterRepository = teisUntersuchungsparameterRepository;
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

    validateReferencedInspectedFacility(
        List.of(request.evaluatingActor(), request.samplingActor()),
        inspection.getCentralFileStateId());

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

    validateReferencedInspectedFacility(
        List.of(request.evaluatingActor(), request.samplingActor()),
        inspection.getCentralFileStateId());

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

    inspectionUpdater.advanceToExecutingPhase(inspection);

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

  public void deleteMeasurementParameter(
      UUID inspectionId, UUID sampleId, UUID measurementParameterId) {
    Inspection inspection = inspectionService.loadInspectionForUpdate(inspectionId);
    checkInspectionIsNotClosed(
        inspection,
        "Proben von abgeschlossenen Vorgängen können nicht geändert werden.",
        "sample could not be updated");
    InspectionSample sample = findInspectionSample(inspection, sampleId);

    InspectionSampleMeasurementParameter measurementParameter =
        findInspectionSampleMeasurementParameter(sample, measurementParameterId);

    sample.getMeasurementParameters().remove(measurementParameter);

    inspectionUpdater.updateModified(inspection);
  }

  public AutocompleteParameterResponse getParameterAutocomplete(String prefix) {
    List<TeisParameter> parameterList =
        teisParameterRepository.findAutocomplete(prepareStringForPrefixLike(prefix), 100);
    return new AutocompleteParameterResponse(
        parameterList.stream()
            .map(InspectionSampleMapper::mapToUntersuchungsParameterReferenceDto)
            .toList());
  }

  public GetUntersuchungsparameterResponse getUntersuchungsparameter(String parameterZid) {
    TeisParameter parameter =
        teisParameterRepository.findTeisParameterByZid(parameterZid).orElseThrow();
    List<TeisUntersuchungsparameter> untersuchungsparameterList =
        teisUntersuchungsparameterRepository.findUntersuchungsparameterByParameter(parameter);
    return new GetUntersuchungsparameterResponse(
        untersuchungsparameterList.stream()
            .map(InspectionSampleMapper::mapToUntersuchungsParameterReferenceDto)
            .toList());
  }

  public AutocompleteActorResponse getActorAutocomplete(String prefix, boolean useLaboratories) {
    List<UserDto> users =
        useLaboratories
            ? Collections.emptyList()
            : userClient
                .getUsers(new UserFilterParameters(UserRoleDto.INSPECTION_PROCEDURE_EDIT, prefix))
                .users();

    ContactFilterParameters contactFilterParameters =
        useLaboratories
            ? new ContactFilterParameters(
                prefix,
                null,
                ContactTypeDto.INSTITUTION,
                Set.of(InstitutionContactCategoryDto.LABORATORY),
                ContactSortKey.NAME,
                SortDirection.ASC,
                null,
                null)
            : new ContactFilterParameters(
                prefix,
                null,
                ContactTypeDto.PERSON,
                null,
                ContactSortKey.NAME,
                SortDirection.ASC,
                null,
                null);

    List<ContactDto> contacts = contactClient.getContacts(contactFilterParameters).elements();

    List<? extends AutocompleteActorDto> autocompleteUsers =
        users.stream()
            .map(
                user ->
                    new AutocompleteUserDto(
                        user.userId(), user.firstName() + " " + user.lastName()))
            .toList();

    List<? extends AutocompleteActorDto> autocompleteContacts =
        contacts.stream()
            .map(contact -> new AutocompleteContactDto(contact.id(), contact.name()))
            .toList();

    List<AutocompleteActorDto> combinedAutocompleteActors =
        Stream.concat(autocompleteUsers.stream(), autocompleteContacts.stream())
            .sorted(Comparator.comparing(AutocompleteActorDto::name))
            .limit(100)
            .toList();

    return new AutocompleteActorResponse(combinedAutocompleteActors);
  }

  private void determinePreclassification(
      InspectionSampleMeasurementParameter measurementParameter) {

    Double upperLimit =
        measurementParameter.getTeisUntersuchungsparameter() != null
            ? measurementParameter.getTeisUntersuchungsparameter().getObgrenzwert()
            : null;
    Double lowerLimit =
        measurementParameter.getTeisUntersuchungsparameter() != null
            ? measurementParameter.getTeisUntersuchungsparameter().getUntgrenzwert()
            : null;
    Double value = measurementParameter.getMeasurementValue();

    if (upperLimit == null && lowerLimit == null) {
      measurementParameter.setPreclassification(
          InspectionSamplePreclassification.NO_NORM_SPECIFIED);
    } else if (value == null) {
      measurementParameter.setPreclassification(InspectionSamplePreclassification.PENDING);
    } else if (upperLimit != null && value > upperLimit) {
      measurementParameter.setPreclassification(InspectionSamplePreclassification.TOO_HIGH);
    } else if (lowerLimit != null && value < lowerLimit) {
      measurementParameter.setPreclassification(InspectionSamplePreclassification.TOO_LOW);
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
          inspectionSampleMapper.mapToPersistenceObject(measurementParameterDto);
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

  private static void validateReferencedInspectedFacility(
      Collection<InspectionSampleActorReferenceDto> actors, UUID centralFileStateId) {
    actors.stream()
        .filter(Objects::nonNull)
        .filter(actor -> actor instanceof InspectionSampleInspectedFacilityReferenceDto)
        .forEach(
            facilityReference -> {
              if (!((InspectionSampleInspectedFacilityReferenceDto) facilityReference)
                  .centralFileStateId()
                  .equals(centralFileStateId)) {
                throw new BadRequestException("Facility central file state ID is incorrect");
              }
            });
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

  private static String prepareStringForPrefixLike(String s) {
    return s.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_").toLowerCase(ROOT) + "%";
  }
}
