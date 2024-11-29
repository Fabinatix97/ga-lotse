/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import static de.eshg.base.gdpr.GdprProcedureMapper.*;
import static de.eshg.lib.aggregation.AggregationHelper.aggregateErrorResponses;

import de.eshg.base.SortDirection;
import de.eshg.base.centralfile.mapper.FacilityMapper;
import de.eshg.base.centralfile.mapper.PersonMapper;
import de.eshg.base.centralfile.persistence.FacilityService;
import de.eshg.base.centralfile.persistence.PersonService;
import de.eshg.base.centralfile.persistence.entity.Facility;
import de.eshg.base.centralfile.persistence.entity.Person;
import de.eshg.base.centralfile.persistence.repository.FacilityRepository;
import de.eshg.base.centralfile.persistence.repository.PersonRepository;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureToggle;
import de.eshg.base.gdpr.api.*;
import de.eshg.base.gdpr.persistence.*;
import de.eshg.base.pdf.gdpr.GdprRightToObjectLetterGenerator;
import de.eshg.base.util.PaginationUtil;
import de.eshg.lib.aggregation.BusinessModuleAggregationHelper;
import de.eshg.lib.aggregation.ClientResponse;
import de.eshg.lib.common.BusinessModuleCapability;
import de.eshg.lib.procedure.model.gdpr.AddGdprValidationTaskRequest;
import de.eshg.lib.procedure.model.gdpr.GdprValidationTaskStatusDto;
import de.eshg.lib.procedure.model.gdpr.GetGdprValidationTaskResponse;
import de.eshg.rest.service.error.AggregationException;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponseWithLocation;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.validation.ValidationUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "GdprProcedure")
public class GdprProcedureController implements GdprProcedureApi {

  private static final Logger log = LoggerFactory.getLogger(GdprProcedureController.class);

  private final GdprProcedureService service;
  private final PersonService personService;
  private final PersonRepository personRepository;
  private final FacilityService facilityService;
  private final FacilityRepository facilityRepository;
  private final GdprRightToObjectLetterGenerator rightToObjectLetterGenerator;
  private final BaseFeatureToggle baseFeatureToggle;
  private final BusinessModuleAggregationHelper businessModuleAggregationHelper;

  public GdprProcedureController(
      GdprProcedureService service,
      PersonService personService,
      FacilityService facilityService,
      PersonRepository personRepository,
      FacilityRepository facilityRepository,
      GdprRightToObjectLetterGenerator rightToObjectLetterGenerator,
      BaseFeatureToggle baseFeatureToggle,
      BusinessModuleAggregationHelper businessModuleAggregationHelper) {
    this.service = service;
    this.personService = personService;
    this.facilityService = facilityService;
    this.personRepository = personRepository;
    this.facilityRepository = facilityRepository;
    this.rightToObjectLetterGenerator = rightToObjectLetterGenerator;
    this.baseFeatureToggle = baseFeatureToggle;
    this.businessModuleAggregationHelper = businessModuleAggregationHelper;
  }

  @Override
  @Transactional
  public GetGdprProcedureResponse addGdprProcedure(AddGdprProcedureRequest request) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    GdprProcedure procedure = mapToDm(request);
    GdprProcedure saved = service.add(procedure);
    return mapGdprProcedureToApi(saved);
  }

  @Override
  @Transactional(readOnly = true)
  public GetGdprProcedureResponse getGdprProcedure(UUID id) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    return mapGdprProcedureToApi(getGdprProcedureFromDb(id));
  }

  private static final Set<GdprProcedureType> TYPES_REQUIRING_BROADCAST =
      Set.of(GdprProcedureType.RIGHT_TO_ERASURE, GdprProcedureType.RIGHT_OF_ACCESS);

  @Override
  @Transactional
  public GetGdprProcedureResponse refreshStatus(UUID id) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);

    GdprProcedure gdprProcedureFromDb = service.getGdprProcedureForUpdate(id);

    if (isStatusRefreshRequired(gdprProcedureFromDb)) {
      List<GetGdprValidationTaskResponse> validationTasks =
          getValidationTasksFromBusinessModules(id);
      closeGdprProcedureIfAllValidationTasksClosed(validationTasks, gdprProcedureFromDb);
    }

    return mapGdprProcedureToApi(gdprProcedureFromDb);
  }

  private static boolean isStatusRefreshRequired(GdprProcedure gdprProcedureFromDb) {
    return GdprProcedureStatus.IN_PROGRESS == gdprProcedureFromDb.getStatus()
        && TYPES_REQUIRING_BROADCAST.contains(gdprProcedureFromDb.getType());
  }

  private void closeGdprProcedureIfAllValidationTasksClosed(
      List<GetGdprValidationTaskResponse> validationTasks, GdprProcedure gdprProcedureFromDb) {
    UUID id = gdprProcedureFromDb.getExternalId();
    if (isAllClosed(validationTasks)) {
      log.info("GdpProcedure(id={}) is closed. It has no open validation tasks.", id);
      service.updateStatus(gdprProcedureFromDb, GdprProcedureStatus.CLOSED);
    } else {
      log.info("GdpProcedure(id={}) is not closed. It has open validation tasks.", id);
    }
  }

  private static boolean isAllClosed(List<GetGdprValidationTaskResponse> validationTasks) {
    return validationTasks.stream()
        .allMatch(task -> GdprValidationTaskStatusDto.CLOSED.equals(task.status()));
  }

  private GdprProcedure getGdprProcedureFromDb(UUID id) {
    return service.findByExternalId(id).orElseThrow(notFound(id));
  }

  private List<GetGdprValidationTaskResponse> getValidationTasksFromBusinessModules(UUID id) {
    log.info("Getting GdprValidationTasks for GdprProcedure(id={}) from business modules.", id);
    List<ClientResponse<GetGdprValidationTaskResponse>> clientResponses = doGetValidationTasks(id);
    List<ErrorResponseWithLocation> errorResponses = aggregateErrorResponses(clientResponses);
    if (hasError(errorResponses)) {
      onBusinessModuleError(errorResponses, "getValidationTasks", id);
    }

    return clientResponses.stream().map(ClientResponse::response).collect(Collectors.toList());
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

  private List<ClientResponse<GetGdprValidationTaskResponse>> doGetValidationTasks(
      UUID gdprProcedureId) {
    return businessModuleAggregationHelper.requestFromBusinessModules(
        null,
        BusinessModuleCapability.PROCEDURES,
        client -> {
          return client.getGdprValidationTask(gdprProcedureId);
        });
  }

  @Override
  @Transactional(readOnly = true)
  public GetGdprProcedureDetailsPageResponse getGdprProcedureDetailsPage(UUID id) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    GetGdprProcedureResponse procedure = mapGdprProcedureToApi(getGdprProcedureFromDb(id));
    GdprIdentificationDataDto identificationData = procedure.identificationData();

    List<Person> linkedPersons = List.of();
    List<Facility> linkedFacilities = List.of();
    List<Person> personMatches = List.of();
    List<Facility> facilityMatches = List.of();

    switch (identificationData) {
      case GdprPersonDto person -> {
        if (procedure.centralFileId() != null) {
          linkedPersons = List.of(personService.getReferencePerson(procedure.centralFileId()));
        } else if (procedure.status() == GdprProcedureStatusDto.DRAFT) {
          personMatches =
              personService.fuzzySearchIncludingDeleted(
                  person.firstName(), person.lastName(), person.dateOfBirth());
        }
      }
      case GdprFacilityDto facility -> {
        if (procedure.centralFileId() != null) {
          linkedFacilities =
              List.of(facilityService.getReferenceFacility(procedure.centralFileId()));
        } else if (procedure.status() == GdprProcedureStatusDto.DRAFT) {
          facilityMatches =
              facilityService.searchReferenceFacilitiesIncludingDeleted(facility.name());
        }
      }
    }

    return new GetGdprProcedureDetailsPageResponse(
        procedure,
        linkedPersons.stream().map(PersonMapper::mapReferencePersonToApi).toList(),
        linkedFacilities.stream().map(FacilityMapper::mapReferenceFacilityToApi).toList(),
        personMatches.stream().map(PersonMapper::mapReferencePersonToApi).toList(),
        facilityMatches.stream().map(FacilityMapper::mapReferenceFacilityToApi).toList());
  }

  private static Supplier<NotFoundException> notFound(UUID id) {
    return () -> new NotFoundException("GdprProcedure with id '%s' not found.".formatted(id));
  }

  @Override
  @Transactional(readOnly = true)
  public GetGdprProceduresResponse getGdprProcedures(GdprProcedureFilterParameters parameters) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    PaginationUtil.PageSpec pageSpec =
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
    return mapGdprProcedureToApi(
        service.addCentralFileIdToGdprProcedure(request.centralFileId(), id, request.version()));
  }

  @Override
  @Transactional(readOnly = true)
  public GetGdprProcedureFileStateIdsResponse getFileStateIds(UUID id) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    GdprProcedure gdprProcedure = getGdprProcedureFromDb(id);
    validateGdprProcedureState(gdprProcedure);

    List<UUID> personFileStateIds =
        personRepository.findAllFileStateIdsByReferencePersonCreatedBefore(
            gdprProcedure.getCentralFileId(), gdprProcedure.getCreatedAt());

    List<UUID> facilityFileStateIds =
        facilityRepository.findAllFileStateIdsByReferenceFacilityCreatedBefore(
            gdprProcedure.getCentralFileId(), gdprProcedure.getCreatedAt());

    return new GetGdprProcedureFileStateIdsResponse(personFileStateIds, facilityFileStateIds);
  }

  private static void validateGdprProcedureState(GdprProcedure gdprProcedure) {
    UUID centralFileId = gdprProcedure.getCentralFileId();
    if (centralFileId == null) {
      throw new BadRequestException("The GDPR procedure does not have a central file ID set.");
    }

    Instant createdAt = gdprProcedure.getCreatedAt();
    if (createdAt == null) {
      throw new IllegalStateException("The GDPR procedure does not have a createdAt set.");
    }
  }

  @Override
  @Transactional
  public void setMatterOfConcern(UUID id, SetMatterOfConcernRequest request) {
    GdprProcedure procedure = getProcedureAndValidateVersion(id, request.version());
    procedure.setMatterOfConcern(request.concern());
  }

  @Override
  @Transactional
  public void startProcedure(UUID id, StartGdprProcedureRequest request) {
    GdprProcedure procedure = getProcedureAndValidateVersion(id, request.version());

    if (isInvalidStatus(procedure, GdprProcedureStatus.DRAFT)) {
      throw badStatusTransition(GdprProcedureStatusDto.IN_PROGRESS, procedure.getStatus());
    }

    GdprProcedureType currentType = procedure.getType();
    if (currentType == GdprProcedureType.RIGHT_OF_ACCESS
        || currentType == GdprProcedureType.RIGHT_TO_ERASURE) {
      validateGdprProcedureState(procedure);
      log.info(
          "Attempting to broadcast ValidationTasks for GdprProcedure(id={}) of type {}",
          id,
          currentType);
      createValidationTasks(procedure);
    } else {
      if (procedure.getMatterOfConcern() == null) {
        throw new BadRequestException("Cannot start procedure without valid matter of concern.");
      }
    }

    changeStatusAndLog(id, procedure, GdprProcedureStatus.IN_PROGRESS);
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
    changeStatusAndLog(id, procedure, GdprProcedureStatus.ABORTED);
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
    changeStatusAndLog(id, procedure, GdprProcedureStatus.CLOSED);
  }

  private void changeStatusAndLog(UUID id, GdprProcedure procedure, GdprProcedureStatus newStatus) {
    procedure.setStatus(newStatus);
    log.info(
        "Changed status of GdprProcedure(id={}) of type {} from {} to {}",
        id,
        procedure.getType(),
        procedure.getStatus(),
        newStatus);
  }

  private GdprProcedure getProcedureAndValidateVersion(UUID id, long version) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    GdprProcedure procedure = service.getGdprProcedureForUpdate(id);
    ValidationUtil.validateVersion(version, procedure);
    return procedure;
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

  private void createValidationTasks(GdprProcedure gdprProcedure) {
    AddGdprValidationTaskRequest request =
        new AddGdprValidationTaskRequest(
            gdprProcedure.getExternalId(),
            mapToValidationTaskApi(gdprProcedure.getType()),
            gdprProcedure.getCreatedAt());
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

  @Override
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getReportDocument(UUID id) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    GdprProcedure procedure = getGdprProcedureFromDb(id);

    if (procedure.getType() != GdprProcedureType.RIGHT_TO_OBJECT) {
      throw new BadRequestException(
          "Cannot create report document for procedure of type " + procedure.getType());
    }

    byte[] pdf = rightToObjectLetterGenerator.generatePdf(procedure);

    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment()
                .filename("Widerspruch-%s.pdf".formatted(id))
                .build()
                .toString())
        .contentType(MediaType.APPLICATION_PDF)
        .body(new ByteArrayResource(pdf));
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
    GdprProcedure procedure = getGdprProcedureFromDb(id);
    log.info("Retrieved downloadIds={} from GdprProcedure(id={})", procedure.getDownloads(), id);

    return new GetGdprDownloadsResponse(mapDownloadToApi(procedure.getDownloads()));
  }

  @Override
  @Transactional
  public void deleteDownloads(UUID id, DeleteGdprDownloadsRequest request) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    service.deleteGdprDownloads(id, request.downloadIds());
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
}
