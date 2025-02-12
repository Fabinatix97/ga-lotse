/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import static de.eshg.base.gdpr.GdprProcedureMapper.*;
import static de.eshg.base.gdpr.GdprProcedureService.TYPES_REQUIRING_BROADCAST;
import static de.eshg.lib.aggregation.AggregationHelper.aggregateErrorResponses;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.SortDirection;
import de.eshg.base.centralfile.mapper.FacilityMapper;
import de.eshg.base.centralfile.mapper.PersonMapper;
import de.eshg.base.centralfile.persistence.FacilityService;
import de.eshg.base.centralfile.persistence.PersonService;
import de.eshg.base.centralfile.persistence.entity.Facility;
import de.eshg.base.centralfile.persistence.entity.Person;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureToggle;
import de.eshg.base.gdpr.api.*;
import de.eshg.base.gdpr.api.GetCitizenSelfUsersGdprProceduresResponse;
import de.eshg.base.gdpr.persistence.*;
import de.eshg.base.util.PaginationUtil.PageSpec;
import de.eshg.file.common.CustomMediaTypes;
import de.eshg.lib.aggregation.BusinessModuleAggregationHelper;
import de.eshg.lib.aggregation.ClientResponse;
import de.eshg.lib.common.BusinessModuleCapability;
import de.eshg.lib.procedure.model.CheckFileStateUsageRequest;
import de.eshg.lib.procedure.model.CheckFileStateUsageResponse;
import de.eshg.lib.procedure.model.gdpr.AddGdprValidationTaskRequest;
import de.eshg.lib.procedure.model.gdpr.GdprValidationTaskStatusDto;
import de.eshg.lib.procedure.model.gdpr.GetGdprValidationTaskResponse;
import de.eshg.rest.service.error.AggregationException;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponseWithLocation;
import de.eshg.validation.ValidationUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "GdprProcedure")
public class GdprProcedureController implements GdprProcedureApi {

  private static final Logger log = LoggerFactory.getLogger(GdprProcedureController.class);

  private final GdprProcedureService service;
  private final PersonService personService;
  private final FacilityService facilityService;
  private final BaseFeatureToggle baseFeatureToggle;
  private final BusinessModuleAggregationHelper businessModuleAggregationHelper;
  private final Clock clock;

  public GdprProcedureController(
      GdprProcedureService service,
      PersonService personService,
      FacilityService facilityService,
      BaseFeatureToggle baseFeatureToggle,
      BusinessModuleAggregationHelper businessModuleAggregationHelper,
      Clock clock) {
    this.service = service;
    this.personService = personService;
    this.facilityService = facilityService;
    this.baseFeatureToggle = baseFeatureToggle;
    this.businessModuleAggregationHelper = businessModuleAggregationHelper;
    this.clock = clock;
  }

  @Override
  @Transactional
  public GetGdprProcedureResponse addGdprProcedure(AddGdprProcedureRequest request) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    GdprProcedure procedure = mapToDm(request);
    GdprProcedure saved = service.addFromEmployeePortal(procedure);
    return mapGdprProcedureToApi(saved);
  }

  @Override
  @Transactional
  public CitizenUsersGdprProcedureDto addGdprProcedureFromCitizenPortal(
      AddGdprProcedureFromCitizenPortalRequest request) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR_ONLINE_PORTAL);

    GdprProcedure procedure = mapToDm(request);

    IdentificationData identificationData = service.getCitizenSelfUserIdentificationData();
    procedure.setIdentificationData(identificationData);

    GdprProcedure saved = service.addFromCitizenPortal(procedure);
    return GdprProcedureMapper.mapProcedureToCitizenApi(saved);
  }

  @Override
  public GetCitizenSelfUsersGdprProceduresResponse getCitizenSelfUserLinkedGdprProcedures() {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR_ONLINE_PORTAL);

    List<GdprProcedure> procedures = service.findGdprProceduresLinkedWithSelfUser();

    return GdprProcedureMapper.mapCitizenGdprProceduresToApi(procedures);
  }

  @Override
  @Transactional(readOnly = true)
  public GetGdprProcedureResponse getGdprProcedure(UUID id) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    return mapGdprProcedureToApi(service.getGdprProcedureFromDb(id));
  }

  @Override
  @Transactional
  public GetGdprProcedureResponse refreshStatus(UUID id) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    log.info("Refreshing status of GdprProcedure with id {}", id);
    GdprProcedure gdprProcedureFromDb = service.getGdprProcedureForUpdate(id);

    if (isStatusRefreshRequired(gdprProcedureFromDb)) {
      List<GetGdprValidationTaskResponse> validationTasks =
          getValidationTasksFromBusinessModules(gdprProcedureFromDb);

      if (gdprProcedureFromDb.getType() == GdprProcedureType.RIGHT_TO_ERASURE
          && isAllClosed(validationTasks)) {
        deleteUnusedFileStates(gdprProcedureFromDb);
      }

      closeGdprProcedureAndCreateCentralFileDownloadIfAllValidationTasksClosed(
          validationTasks, gdprProcedureFromDb);
    }

    return mapGdprProcedureToApi(gdprProcedureFromDb);
  }

  @Override
  @Transactional(readOnly = true)
  public GetGdprProcedureDetailsPageResponse getGdprProcedureDetailsPage(UUID id) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    GdprProcedure persistedProcedure = service.getGdprProcedureFromDb(id);
    GetGdprProcedureResponse procedure = mapGdprProcedureToApi(persistedProcedure);

    List<Person> linkedPersons = List.of();
    List<Facility> linkedFacilities = List.of();
    List<Person> unlinkedPersonMatches = List.of();
    List<Facility> unlinkedFacilityMatches = List.of();

    switch (procedure.identificationData()) {
      case GdprPersonDto person -> {
        linkedPersons = service.getLinkedPersons(procedure);

        if (procedure.status() == GdprProcedureStatusDto.DRAFT) {
          List<UUID> linkedPersonsIds = linkedPersons.stream().map(Person::getExternalId).toList();
          List<Person> searchMatches = getPersonSearchMatches(person, procedure);
          unlinkedPersonMatches =
              searchMatches.stream()
                  .filter(m -> !linkedPersonsIds.contains(m.getExternalId()))
                  .toList();
        }
      }
      case GdprFacilityDto facility -> {
        linkedFacilities = service.getLinkedFacilities(procedure);

        if (procedure.status() == GdprProcedureStatusDto.DRAFT) {
          List<UUID> linkedFacilitiesIds =
              linkedFacilities.stream().map(Facility::getExternalId).toList();
          List<Facility> searchMatches = getFacilitySearchMatches(facility, procedure);

          unlinkedFacilityMatches =
              searchMatches.stream()
                  .filter(m -> !linkedFacilitiesIds.contains(m.getExternalId()))
                  .toList();
        }
      }
    }

    return new GetGdprProcedureDetailsPageResponse(
        procedure,
        persistedProcedure.getCentralFileDownload() != null,
        linkedPersons.stream().map(PersonMapper::mapReferencePersonToApi).toList(),
        linkedFacilities.stream().map(FacilityMapper::mapReferenceFacilityToApi).toList(),
        unlinkedPersonMatches.stream().map(PersonMapper::mapReferencePersonToApi).toList(),
        unlinkedFacilityMatches.stream().map(FacilityMapper::mapReferenceFacilityToApi).toList());
  }

  @Override
  @Transactional(readOnly = true)
  public GetGdprProceduresResponse getGdprProcedures(GdprProcedureFilterParameters parameters) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    PageSpec pageSpec =
        mapToPageSpec(
            parameters.pageNumberOrFallback(0),
            parameters.pageSizeOrFallback(25),
            parameters.sortKeyOrFallback(GdprProcedureSortKey.CREATED_AT),
            parameters.sortDirectionOrFallback(SortDirection.ASC));
    Page<GdprProcedure> procedures = service.findAll(mapToDm(parameters.type()), pageSpec);
    return mapGdprProceduresToApi(procedures);
  }

  @Override
  @Transactional
  public GetGdprProcedureResponse addCentralFileIdToGdprProcedure(
      UUID id, AddCentralFileIdToGdprProcedureRequest request) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);

    List<CentralFileIdWrapper> centralFileIds =
        mapToDm(request.centralFileIds().stream().distinct().toList());
    return mapGdprProcedureToApi(
        service.addCentralFileIdsToGdprProcedure(centralFileIds, id, request.version()));
  }

  @Override
  @Transactional(readOnly = true)
  public GetGdprProcedureFileStateIdsResponse getFileStateIds(UUID id) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    GdprProcedure gdprProcedure = service.getGdprProcedureFromDb(id);
    validateCreatedAt(gdprProcedure);

    return service.getFileStateResponseByExternalIds(gdprProcedure);
  }

  @Override
  @Transactional
  public void setMatterOfConcern(UUID id, SetMatterOfConcernRequest request) {
    GdprProcedure procedure = getProcedureAndValidateVersion(id, request.version());
    procedure.setMatterOfConcern(request.concern());
    service.writeAuditLog("Anliegen setzen", service.mapAuditLog(procedure));
  }

  @Override
  @Transactional
  public void startProcedure(UUID id, StartGdprProcedureRequest request) {
    GdprProcedure procedure = getProcedureAndValidateVersion(id, request.version());

    validateStatusTransitionToInProgress(procedure);
    validateMatterOfConcern(procedure);

    if (procedure.getType() == GdprProcedureType.RIGHT_OF_ACCESS
        || procedure.getType() == GdprProcedureType.RIGHT_TO_ERASURE) {
      validateCreatedAt(procedure);
      createValidationTasks(procedure);
    }
    service.updateStatus(procedure, GdprProcedureStatus.IN_PROGRESS);
  }

  @Override
  @Transactional
  public void cancelProcedure(UUID id, CancelGdprProcedureRequest request) {
    GdprProcedure procedure = getProcedureAndValidateVersion(id, request.version());

    validateType(
        procedure, GdprProcedureType.RIGHT_TO_OBJECT, GdprProcedureType.RIGHT_TO_RECTIFICATION);

    if (isInvalidStatus(procedure, GdprProcedureStatus.DRAFT, GdprProcedureStatus.IN_PROGRESS)) {
      throw badStatusTransition(GdprProcedureStatusDto.ABORTED, procedure.getStatus());
    }

    procedure.setInternalNote(request.internalNote());
    service.updateStatus(procedure, GdprProcedureStatus.ABORTED);
  }

  @Override
  @Transactional
  public void closeProcedure(UUID id, CloseGdprProcedureRequest request) {
    GdprProcedure procedure = getProcedureAndValidateVersion(id, request.version());

    validateType(
        procedure, GdprProcedureType.RIGHT_TO_OBJECT, GdprProcedureType.RIGHT_TO_RECTIFICATION);

    if (isInvalidStatus(procedure, GdprProcedureStatus.IN_PROGRESS)) {
      throw badStatusTransition(GdprProcedureStatusDto.CLOSED, procedure.getStatus());
    }

    procedure.setInternalNote(request.internalNote());
    service.updateStatus(procedure, GdprProcedureStatus.CLOSED);
  }

  @Override
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getReportDocument(UUID id) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    GdprProcedure procedure = service.getGdprProcedureFromDb(id);

    return service.generateResponseWithRightToObjectLetter(procedure);
  }

  @Override
  @Transactional
  public void addDownloads(UUID id, AddGdprDownloadsRequest request) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    service.addGdprDownloads(id, request.downloadIds());
  }

  @Override
  @Transactional(readOnly = true)
  public GetGdprDownloadsResponse getDownloads(UUID id) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    GdprProcedure procedure = service.getGdprProcedureFromDb(id);
    log.info("Retrieved downloadIds={} from GdprProcedure(id={})", procedure.getDownloads(), id);

    return new GetGdprDownloadsResponse(mapDownloadToApi(procedure.getDownloads()));
  }

  @Override
  @Transactional
  public void deleteDownloads(UUID id, DeleteGdprDownloadsRequest request) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    service.deleteGdprDownloads(id, request.downloadIds());
  }

  @Override
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getCentralFileDownloadPackage(UUID id) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);

    byte[] content = service.getCentralFileDownloadPackage(id);

    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment()
                .filename(downloadPackageFilename(id), StandardCharsets.UTF_8)
                .build()
                .toString())
        .header(HttpHeaders.CONTENT_TYPE, CustomMediaTypes.ZIP_VALUE)
        .body(new ByteArrayResource(content));
  }

  private static String downloadPackageFilename(UUID id) {
    return "DSGVO_Stammdaten_Download_Paket_%s.zip".formatted(id);
  }

  private void deleteUnusedFileStates(GdprProcedure procedure) {
    UUID id = procedure.getExternalId();
    log.info("Deleting unused file states for GdprProcedure(id={}).", id);

    Set<UUID> fileStateIds = service.fetchFileStateIdsFromDb(procedure);
    if (fileStateIds.isEmpty()) {
      log.info("No file states to delete. None found in DB for GdprProcedure(id={}).", id);
      return;
    }

    Set<UUID> fileStatesInUse =
        fetchUsedFileStateIdsFromBusinessModules(fileStateIds.stream().toList(), id);

    fileStateIds.removeAll(fileStatesInUse);
    log.info("Marking file states for deletion for GdprProcedure(id={}): {}", id, fileStateIds);
    personService.markAllForDeletionAt(fileStateIds, Instant.now(clock));
    facilityService.markAllForDeletionAt(fileStateIds, Instant.now(clock));
  }

  private void closeGdprProcedureAndCreateCentralFileDownloadIfAllValidationTasksClosed(
      List<GetGdprValidationTaskResponse> validationTasks, GdprProcedure gdprProcedureFromDb) {
    UUID id = gdprProcedureFromDb.getExternalId();
    if (isAllClosed(validationTasks)) {
      log.info("GdpProcedure(id={}) is closed. It has no open validation tasks.", id);
      service.updateStatus(gdprProcedureFromDb, GdprProcedureStatus.CLOSED);
      if (gdprProcedureFromDb.getType() == GdprProcedureType.RIGHT_OF_ACCESS) {
        service.createDownloadPackageForCentralFiles(gdprProcedureFromDb);
      }
    } else {
      log.info("GdpProcedure(id={}) is not closed. It has open validation tasks.", id);
    }
  }

  private List<GetGdprValidationTaskResponse> getValidationTasksFromBusinessModules(
      GdprProcedure procedure) {
    UUID id = procedure.getExternalId();
    log.info("Getting GdprValidationTasks for GdprProcedure(id={}) from business modules.", id);
    List<ClientResponse<GetGdprValidationTaskResponse>> clientResponses = doGetValidationTasks(id);
    List<ErrorResponseWithLocation> errorResponses = aggregateErrorResponses(clientResponses);

    if (hasErrorForRebroadcast(clientResponses)) {
      log.info("Rebroadcasting GdprValidationTasks for for GdprProcedure(id={})", id);
      createValidationTasks(procedure);
      clientResponses = doGetValidationTasks(id);
      errorResponses = aggregateErrorResponses(clientResponses);
    }

    if (hasError(errorResponses)) {
      onBusinessModuleError(errorResponses, "getValidationTasks", id);
    }

    return clientResponses.stream().map(ClientResponse::response).toList();
  }

  private boolean hasErrorForRebroadcast(
      List<ClientResponse<GetGdprValidationTaskResponse>> clientResponses) {
    return clientResponses.stream()
        .filter(
            r -> r.errorResponse() != null && r.errorResponse().errorCode() == ErrorCode.NOT_FOUND)
        .peek(error -> log.info("Found error for rebroadcasting GDPR validation tasks: {}", error))
        .findFirst()
        .isPresent();
  }

  private List<ClientResponse<GetGdprValidationTaskResponse>> doGetValidationTasks(
      UUID gdprProcedureId) {
    return businessModuleAggregationHelper.requestFromBusinessModules(
        null,
        BusinessModuleCapability.PROCEDURES,
        client -> client.getGdprValidationTask(gdprProcedureId));
  }

  private Set<UUID> fetchUsedFileStateIdsFromBusinessModules(List<UUID> fileStateIds, UUID id) {
    log.info("Checking usage in modules: GdprProcedure(id={}), fileStateIds={}", id, fileStateIds);
    List<ClientResponse<CheckFileStateUsageResponse>> clientResponses =
        businessModuleAggregationHelper.requestFromBusinessModules(
            null,
            BusinessModuleCapability.PROCEDURES,
            client -> client.checkFileStateUsage(new CheckFileStateUsageRequest(fileStateIds)));

    List<ErrorResponseWithLocation> errorResponses = aggregateErrorResponses(clientResponses);

    if (hasError(errorResponses)) {
      onBusinessModuleError(errorResponses, "checkFileStateUsage", id);
    }

    return clientResponses.stream()
        .flatMap(r -> r.response().inUse().stream())
        .collect(StreamUtil.toLinkedHashSet());
  }

  private List<Person> getPersonSearchMatches(
      GdprPersonDto person, GetGdprProcedureResponse procedure) {
    String firstName = person.firstName();
    String lastName = person.lastName();
    LocalDate dateOfBirth = person.dateOfBirth();

    if (procedure.type() == GdprProcedureTypeDto.RIGHT_TO_RECTIFICATION) {
      return personService.fuzzySearchIncludingDeleted(firstName, lastName, dateOfBirth);
    }

    return personService.fuzzySearchIncludingDeletedAndExternal(firstName, lastName, dateOfBirth);
  }

  private List<Facility> getFacilitySearchMatches(
      GdprFacilityDto facility, GetGdprProcedureResponse procedure) {
    String facilityName = facility.name();
    if (procedure.type() == GdprProcedureTypeDto.RIGHT_TO_RECTIFICATION) {
      return facilityService.searchReferenceFacilitiesIncludingDeleted(facilityName);
    }

    return facilityService.searchReferenceFacilitiesIncludingDeletedAndExternal(facilityName);
  }

  private GdprProcedure getProcedureAndValidateVersion(UUID id, long version) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    GdprProcedure procedure = service.getGdprProcedureForUpdate(id);
    ValidationUtil.validateVersion(version, procedure);
    return procedure;
  }

  private void createValidationTasks(GdprProcedure gdprProcedure) {
    AddGdprValidationTaskRequest request =
        new AddGdprValidationTaskRequest(
            gdprProcedure.getExternalId(),
            mapToValidationTaskApi(gdprProcedure.getType()),
            gdprProcedure.getCreatedAt());

    log.info(
        "Attempting to broadcast ValidationTasks for GdprProcedure(id={}) of type {}",
        gdprProcedure.getExternalId(),
        gdprProcedure.getType());

    List<ErrorResponseWithLocation> errorResponses = postValidationTasks(request);

    if (hasError(errorResponses)) {
      log.error(
          "Error from one or more Business Modules while creating ValidationTasks for GdprProcedure(id={}): {}",
          gdprProcedure.getExternalId(),
          errorResponses);
      throw new BadRequestException(
          ErrorCode.UNEXPECTED_ERROR,
          "Error from one or more Business Modules while creating ValidationTasks");
    }
    service.writeAuditLog("Fachmodul Prüfaufträge erzeugen", service.mapAuditLog(gdprProcedure));
  }

  private List<ErrorResponseWithLocation> postValidationTasks(
      AddGdprValidationTaskRequest request) {
    return aggregateErrorResponses(
        businessModuleAggregationHelper.requestFromBusinessModules(
            null,
            BusinessModuleCapability.PROCEDURES,
            client -> {
              client.addGdprValidationTask(request);
              return null;
            }));
  }

  private static void validateCreatedAt(GdprProcedure gdprProcedure) {
    Instant createdAt = gdprProcedure.getCreatedAt();
    if (createdAt == null) {
      throw new IllegalStateException("The GDPR procedure does not have a createdAt set.");
    }
  }

  private static void validateStatusTransitionToInProgress(GdprProcedure procedure) {
    if (isInvalidStatus(procedure, GdprProcedureStatus.DRAFT)) {
      throw badStatusTransition(GdprProcedureStatusDto.IN_PROGRESS, procedure.getStatus());
    }
  }

  private static void validateMatterOfConcern(GdprProcedure procedure) {
    if (isInvalidMatterOfConcern(procedure)) {
      throw new BadRequestException("Cannot start procedure without valid matter of concern.");
    }
  }

  private static boolean isInvalidMatterOfConcern(GdprProcedure procedure) {
    return isRightToObjectionOrRectification(procedure) && procedure.getMatterOfConcern() == null;
  }

  private static boolean isRightToObjectionOrRectification(GdprProcedure procedure) {
    return procedure.getType() == GdprProcedureType.RIGHT_TO_OBJECT
        || procedure.getType() == GdprProcedureType.RIGHT_TO_RECTIFICATION;
  }

  private static BadRequestException badStatusTransition(
      GdprProcedureStatusDto wantedStatus, GdprProcedureStatus currentStatus) {
    return new BadRequestException(
        "Status cannot be changed to '"
            + wantedStatus
            + "' while current status is '"
            + currentStatus
            + "'.");
  }

  private static boolean isStatusRefreshRequired(GdprProcedure gdprProcedureFromDb) {
    return GdprProcedureStatus.IN_PROGRESS == gdprProcedureFromDb.getStatus()
        && TYPES_REQUIRING_BROADCAST.contains(gdprProcedureFromDb.getType());
  }

  private static boolean isAllClosed(List<GetGdprValidationTaskResponse> validationTasks) {
    return validationTasks.stream()
        .allMatch(task -> GdprValidationTaskStatusDto.CLOSED.equals(task.status()));
  }

  private static boolean hasError(List<ErrorResponseWithLocation> errorResponses) {
    return !errorResponses.isEmpty();
  }

  private static void onBusinessModuleError(
      List<ErrorResponseWithLocation> errorResponses, String operationName, UUID id) {
    String internalMsg =
        "Operation %s failed for GdprProcedure(id=%s) in one or more business modules: %s"
            .formatted(operationName, id, errorResponses);
    throw new AggregationException(
        ErrorCode.AGGREGATION_EXCEPTION, "Unexpected error during refresh.", internalMsg);
  }

  private static void validateType(GdprProcedure procedure, GdprProcedureType... validTypes) {
    GdprProcedureType currentType = procedure.getType();
    for (GdprProcedureType validType : validTypes) {
      if (currentType == validType) {
        return;
      }
    }

    throw new BadRequestException(
        "Not supported for procedures of type '%s'".formatted(currentType));
  }

  private static boolean isInvalidStatus(
      GdprProcedure procedure, GdprProcedureStatus... validStatuses) {
    GdprProcedureStatus currentStatus = procedure.getStatus();
    for (GdprProcedureStatus validStatus : validStatuses) {
      if (currentStatus == validStatus) {
        return false;
      }
    }

    return true;
  }
}
