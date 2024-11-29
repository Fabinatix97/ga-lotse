/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.DeleteFileStatesRequest;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateRequest;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStatesRequest;
import de.eshg.base.centralfile.api.facility.ExternalAddFacilityFileStateRequest;
import de.eshg.base.centralfile.api.facility.FacilityContactPersonDto;
import de.eshg.base.centralfile.api.facility.FacilityDetails;
import de.eshg.base.centralfile.api.facility.FacilityDetailsDto;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesRequest;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesResponse;
import de.eshg.base.centralfile.api.facility.PutFacilityRequest;
import de.eshg.base.centralfile.api.facility.UpdateReferenceFacilityRequest;
import de.eshg.lib.procedure.MapperHelper;
import de.eshg.lib.procedure.domain.model.RelatedFacility;
import de.eshg.medicalregistry.api.CreateApplicantDto;
import de.eshg.medicalregistry.api.CreatePracticeDto;
import de.eshg.medicalregistry.api.PracticeReferenceFacilityDto;
import de.eshg.medicalregistry.domain.model.Practice;
import de.eshg.medicalregistry.importer.MedicalRegistryRowValues;
import de.eshg.medicalregistry.mapper.AddressMapper;
import de.eshg.medicalregistry.mapper.EnrichmentHelper;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.apache.poi.ss.usermodel.Row;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

@Component
public class FacilityService {

  private static final Logger log = LoggerFactory.getLogger(FacilityService.class);
  private final FacilityApi facilityApi;

  public FacilityService(FacilityApi facilityApi) {
    this.facilityApi = facilityApi;
  }

  List<AddFacilityFileStateResponse> findPracticeDetails(List<Practice> practices) {
    if (CollectionUtils.isEmpty(practices)) {
      return List.of();
    }

    GetFacilityFileStatesResponse fileStateDetails =
        facilityApi.getFacilityFileStates(
            new GetFacilityFileStatesRequest(
                practices.stream().map(RelatedFacility::getCentralFileStateId).toList()));

    if (fileStateDetails.facilityFileStates().size() != practices.size()) {
      throw new IllegalStateException("Some facilities were not found in the central file.");
    }

    return fileStateDetails.facilityFileStates();
  }

  UUID createFacilityInCentralFile(CreatePracticeDto practice, CreateApplicantDto applicant) {
    if (practice == null) {
      return null;
    }

    AddFacilityFileStateResponse addFacilityResponse =
        facilityApi.addFacilityFromExternalSource(
            new ExternalAddFacilityFileStateRequest(
                practice.getName(),
                MapperHelper.toList(practice.getEmailAddress()),
                MapperHelper.toList(practice.getPhoneNumber()),
                List.of(FacilityService.mapContactPerson(applicant)),
                AddressMapper.mapAddress(practice.getAddress()),
                null));

    return addFacilityResponse.id();
  }

  Map<Row, UUID> createFacilitiesInCentralFile(List<MedicalRegistryRowValues> rowValues) {
    List<MedicalRegistryRowValues> relevantRowValues =
        rowValues.stream().filter(MedicalRegistryRowValues::hasPractice).toList();
    if (relevantRowValues.isEmpty()) {
      return Collections.emptyMap();
    } else {
      List<UUID> facilityStateIds =
          facilityApi
              .addFacilityFileStates(
                  new AddFacilityFileStatesRequest(
                      relevantRowValues.stream()
                          .map(FacilityService::mapToAddFacilityFileStateRequest)
                          .toList()))
              .facilityFileStateIds();
      return IntStream.range(0, relevantRowValues.size())
          .boxed()
          .collect(Collectors.toMap(i -> relevantRowValues.get(i).getRow(), facilityStateIds::get));
    }
  }

  Optional<Practice> findTargetPractice(
      List<Practice> targetPractices, PracticeReferenceFacilityDto practiceReferenceFacility) {
    if (practiceReferenceFacility == null) {
      return Optional.empty();
    }

    Set<UUID> fileStates =
        facilityApi
            .getFacilityFileStateIdsAssociatedWithReferenceFacility(practiceReferenceFacility.id())
            .fileStateIds()
            .stream()
            .collect(Collectors.toUnmodifiableSet());

    return targetPractices.stream()
        .filter(practice -> fileStates.contains(practice.getCentralFileStateId()))
        .collect(StreamUtil.toSingleOptionalElement());
  }

  UUID updateOrConfirmPractice(
      UUID centralFileStateId, PracticeReferenceFacilityDto practiceReferenceFacility) {
    GetFacilityFileStateResponse facilityFileState =
        facilityApi.getFacilityFileState(centralFileStateId);

    if (practiceReferenceFacility != null) {
      return updateReferenceFacilityWithDraftDetails(facilityFileState, practiceReferenceFacility);
    } else {
      return confirmFacility(facilityFileState);
    }
  }

  void deleteInCentralFile(UUID practiceId) {
    facilityApi.markFacilityFileStateForDeletion(new DeleteFileStatesRequest(practiceId));
  }

  private UUID confirmFacility(GetFacilityFileStateResponse facilityFileState) {
    log.info("Confirming facility {} in central file", facilityFileState.id());
    return facilityApi
        .updateFacilityFileStateAndReference(
            facilityFileState.id(),
            new PutFacilityRequest(new FacilityDetailsDto(facilityFileState)))
        .id();
  }

  private UUID updateReferenceFacilityWithDraftDetails(
      GetFacilityFileStateResponse fileState, PracticeReferenceFacilityDto practiceReference) {
    log.info(
        "Updating facility {} in central file state with draft details", practiceReference.id());

    AddFacilityFileStateResponse updatedFileState =
        facilityApi.updateReferenceFacility(
            practiceReference.id(),
            new UpdateReferenceFacilityRequest(
                enrich(fileState, practiceReference), practiceReference.version()));

    facilityApi.markFacilityFileStateForDeletion(new DeleteFileStatesRequest(fileState.id()));

    return updatedFileState.id();
  }

  private FacilityDetailsDto enrich(
      GetFacilityFileStateResponse draftFacilityFileState,
      PracticeReferenceFacilityDto practiceReference) {
    return new FacilityDetailsDto(
        EnrichmentHelper.enrich(FacilityDetails::name, draftFacilityFileState, practiceReference),
        EnrichmentHelper.enrichList(
            FacilityDetails::emailAddresses, draftFacilityFileState, practiceReference),
        EnrichmentHelper.enrichList(
            FacilityDetails::phoneNumbers, draftFacilityFileState, practiceReference),
        EnrichmentHelper.enrichList(
            FacilityDetails::contactPersons, draftFacilityFileState, practiceReference),
        EnrichmentHelper.enrich(
            FacilityDetails::contactAddress, draftFacilityFileState, practiceReference),
        EnrichmentHelper.enrich(
            FacilityDetails::differentBillingAddress, draftFacilityFileState, practiceReference));
  }

  private static AddFacilityFileStateRequest mapToAddFacilityFileStateRequest(
      MedicalRegistryRowValues rowValues) {
    return new AddFacilityFileStateRequest(
        rowValues.getPractice().getName(),
        List.of(rowValues.getPractice().getEmailAddress()),
        List.of(rowValues.getPractice().getPhoneNumber()),
        List.of(FacilityService.mapContactPerson(rowValues.getApplicant())),
        AddressMapper.mapAddress(rowValues.getPractice().getAddress()),
        null,
        DataOriginDto.IMPORT);
  }

  private static FacilityContactPersonDto mapContactPerson(CreateApplicantDto applicant) {
    return new FacilityContactPersonDto(
        applicant.getEmailAddress(),
        applicant.getPhoneNumber(),
        null,
        applicant.getLastName(),
        applicant.getFirstName(),
        applicant.getTitle(),
        null,
        applicant.getGender());
  }
}
