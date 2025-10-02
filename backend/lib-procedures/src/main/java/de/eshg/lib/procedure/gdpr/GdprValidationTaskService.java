/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.gdpr;

import static de.eshg.lib.keycloak.CitizenPermissionRole.BUND_ID_USER;
import static de.eshg.lib.keycloak.CitizenPermissionRole.MUK_USER;
import static de.eshg.lib.procedure.domain.model.GdprValidationTaskStatus.CLOSED;

import de.eshg.base.gdpr.GdprProcedureApi;
import de.eshg.base.gdpr.api.AddGdprDownloadsRequest;
import de.eshg.base.gdpr.api.GdprFacilityDto;
import de.eshg.base.gdpr.api.GdprIdentificationDataDto;
import de.eshg.base.gdpr.api.GdprPersonDto;
import de.eshg.base.gdpr.api.GetGdprDownloadsResponse;
import de.eshg.base.gdpr.api.GetGdprProcedureFileStateIdsResponse;
import de.eshg.base.util.PaginationUtil;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.GdprDownloadPackage;
import de.eshg.lib.procedure.domain.model.GdprValidationTask;
import de.eshg.lib.procedure.domain.model.GdprValidationTaskStatus;
import de.eshg.lib.procedure.domain.model.GdprValidationTaskType;
import de.eshg.lib.procedure.domain.model.GdprValidationTask_;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.Task;
import de.eshg.lib.procedure.domain.repository.*;
import de.eshg.lib.procedure.mapping.ProcedureLibraryEnrichingMapper;
import de.eshg.lib.procedure.model.ProcedureDto;
import de.eshg.lib.procedure.model.gdpr.AddGdprValidationTaskRequest;
import de.eshg.lib.procedure.model.gdpr.BusinessProcedureInclusionStatusDto;
import de.eshg.lib.procedure.model.gdpr.BusinessProcedureWithInclusionStatusDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GdprValidationTaskService<
    ProcedureT extends Procedure<ProcedureT, TaskT, ?, ?>, TaskT extends Task<ProcedureT>> {

  private static final String AUDITLOG_CATEGORY = "DSGVO Prüfauftrag";

  private static final Logger log = LoggerFactory.getLogger(GdprValidationTaskService.class);
  private final GdprValidationTaskRepository validationTaskRepository;
  private final GdprDownloadPackageRepository downloadPackageRepository;
  private final ProcedureRepository<ProcedureT> procedureRepository;
  private final ProcedureLibraryEnrichingMapper<ProcedureT, TaskT> enrichingMapper;
  private final GdprProcedureApi baseGdprProcedureApi;
  private final Clock clock;
  private final AuditLogger auditLogger;

  public GdprValidationTaskService(
      GdprValidationTaskRepository validationTaskRepository,
      GdprDownloadPackageRepository downloadPackageRepository,
      ProcedureRepository<ProcedureT> procedureRepository,
      ProcedureLibraryEnrichingMapper<ProcedureT, TaskT> enrichingMapper,
      GdprProcedureApi baseGdprProcedureApi,
      Clock clock,
      AuditLogger auditLogger) {
    this.validationTaskRepository = validationTaskRepository;
    this.downloadPackageRepository = downloadPackageRepository;
    this.procedureRepository = procedureRepository;
    this.enrichingMapper = enrichingMapper;
    this.baseGdprProcedureApi = baseGdprProcedureApi;
    this.clock = clock;
    this.auditLogger = auditLogger;
  }

  public GdprValidationTask getValidationTaskFromDb(UUID id) {
    return findValidationTask(id)
        .orElseThrow(() -> new NotFoundException("GdprValidationTask not found."));
  }

  public Optional<GdprValidationTask> findValidationTask(UUID id) {
    return validationTaskRepository.findByGdprProcedureId(id);
  }

  public List<UUID> findBusinessProcedureIdsByDownloadIdIn(Set<UUID> downloadIds) {
    log.info("Fetching download packages from database for IDs: {}", downloadIds);
    if (downloadIds == null || downloadIds.isEmpty()) {
      return List.of();
    }
    return downloadPackageRepository.findBusinessProcedureIdsByExternalIdIn(downloadIds);
  }

  public GdprDownloadPackage getDownloadPackage(UUID downloadId) {
    log.info("Fetching download package from database by downloadId: {}", downloadId);
    Optional<GdprDownloadPackage> pkg = downloadPackageRepository.findByExternalId(downloadId);
    String identificationDataHash =
        pkg.orElseThrow(() -> new NotFoundException("GdprDownloadPackage not found."))
            .getIdentificationDataHash();
    if (!validatePermissionToAccessGdprDownload(identificationDataHash)) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "User is not allowed to access this download package");
    }
    return pkg.get();
  }

  private boolean validatePermissionToAccessGdprDownload(String identificationDatHash) {
    return getIdentificationDataOfCurrentUser().verify(identificationDatHash);
  }

  public Procedure<?, ?, ?, ?> getBusinessProcedureFromDb(UUID id) {
    return procedureRepository
        .findByExternalId(id)
        .orElseThrow(() -> new NotFoundException("BusinessProcedure not found."));
  }

  public List<UUID> getFileStateIdsAndValidateLink(UUID gdprProcedureId, UUID businessProcedureId) {
    List<UUID> fileStateIdsToSearch = getAndValidateFileStateIds(gdprProcedureId);
    List<UUID> businessProcedureIds =
        fileStateIdsToSearch.isEmpty()
            ? List.of()
            : procedureRepository.findIdsByFileStateIds(fileStateIdsToSearch);

    if (!businessProcedureIds.contains(businessProcedureId)) {
      throw new BadRequestException(
          "The requested business procedure does not have any fileState of the given GDPR procedure");
    }
    return fileStateIdsToSearch;
  }

  public Optional<ProcedureT> getBusinessProcedure(UUID businessProcedureId, UUID gdprProcedureId) {
    List<UUID> fileStateIds = getAndValidateFileStateIds(gdprProcedureId);
    if (fileStateIds.isEmpty()) {
      return Optional.empty();
    }
    return procedureRepository.getByExternalIdAndFileStateIds(businessProcedureId, fileStateIds);
  }

  public boolean validationTaskAlreadyExists(AddGdprValidationTaskRequest request) {
    Optional<GdprValidationTask> existingTask = findValidationTask(request.gdprProcedureId());
    if (existingTask.isPresent()) {
      log.info(
          "A GdprValidationTask already exists for GdprProcedure with id {}",
          existingTask.get().getGdprProcedureId());
      return true;
    }
    return false;
  }

  public void searchBusinessProceduresAndUpdateValidationTask(
      List<UUID> fileStateIds, GdprValidationTask validationTask) {
    if (fileStateIds.isEmpty()) {
      validationTask.setStatus(CLOSED);
      return;
    }
    List<UUID> businessProcedureIds = procedureRepository.findIdsByFileStateIds(fileStateIds);
    if (businessProcedureIds.isEmpty()) {
      validationTask.setStatus(CLOSED);
    }
  }

  public GdprValidationTask add(GdprValidationTask validationTask) {
    Instant now = clock.instant();
    validationTask.setCreatedAt(now);
    validationTask.setModifiedAt(now);

    GdprValidationTask saved = validationTaskRepository.save(validationTask);
    writeAuditLog("Prüfauftrag hinzufügen", mapAuditLog(validationTask));
    return saved;
  }

  public void sendDownloadId(UUID gdprProcedureId, UUID downloadId) {
    baseGdprProcedureApi.addDownloads(
        gdprProcedureId, new AddGdprDownloadsRequest(Set.of(downloadId)));
  }

  public GdprDownloadPackage createAndSaveDownloadPackage(
      UUID businessProcedureId, String identificationDataHash, byte[] zip) {
    GdprDownloadPackage downloadPackage = new GdprDownloadPackage();
    downloadPackage.setBusinessProcedureId(businessProcedureId);
    downloadPackage.setIdentificationDataHash(identificationDataHash);
    downloadPackage.setContent(zip);
    return downloadPackageRepository.save(downloadPackage);
  }

  public String getIdentificationDataHash(UUID gdprProcedureId) {
    return getIdentificationData(gdprProcedureId).hash();
  }

  public List<GdprDownloadPackageInfo> getDownloadPackagesInfo(UUID gdprProcedureId) {
    validatePermissionToAccessGdprProcedure(gdprProcedureId);
    Set<UUID> downloadIdsFromBase = fetchDownloadIdsFromBase(gdprProcedureId).downloadIds();
    if (downloadIdsFromBase.isEmpty()) {
      return List.of();
    }
    return downloadPackageRepository.findInfoByExternalIdIn(downloadIdsFromBase);
  }

  public GetGdprDownloadsResponse fetchDownloadIdsFromBase(UUID gdprProcedureId) {
    log.info("Fetching download IDs for GdprProcedureId: {}", gdprProcedureId);
    return baseGdprProcedureApi.getDownloads(gdprProcedureId);
  }

  public List<UUID> getAndValidateFileStateIds(UUID gdprProcedureId) {
    GetGdprProcedureFileStateIdsResponse fileStateResponse =
        baseGdprProcedureApi.getFileStateIds(gdprProcedureId);
    boolean hasFacilityFileStates = !fileStateResponse.facilityFileStateIds().isEmpty();
    boolean hasPersonFileStates = !fileStateResponse.personFileStateIds().isEmpty();

    if (!hasFacilityFileStates && !hasPersonFileStates) {
      return List.of();
    } else if (hasFacilityFileStates && hasPersonFileStates) {
      throw new IllegalStateException(
          "The GDPR procedure has BOTH facility and person file states associated with it");
    }

    return hasFacilityFileStates
        ? fileStateResponse.facilityFileStateIds()
        : fileStateResponse.personFileStateIds();
  }

  public GdprIdentificationDataDto getGdprIdentificationData(UUID gdprId) {
    try {
      return baseGdprProcedureApi.getGdprProcedure(gdprId).identificationData();
    } catch (HttpClientErrorException.Forbidden forbidden) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, forbidden.getMessage());
    }
  }

  public OpenTaskSummary getOpenGdprValidationTaskSummary() {
    OpenTaskSummaryRawData summaryRawData = validationTaskRepository.getOpenTaskSummary();
    return toOpenTaskSummary(summaryRawData);
  }

  private static OpenTaskSummary toOpenTaskSummary(OpenTaskSummaryRawData summaryRawData) {
    LocalDate earliestDueDate = toDueDate(summaryRawData.getOldestStartDate());
    return new OpenTaskSummary(summaryRawData.getCount(), earliestDueDate);
  }

  public static LocalDate toDueDate(Instant startedAt) {
    if (startedAt == null) {
      return null;
    }
    LocalDate startDate = startedAt.atOffset(ZoneOffset.UTC).toLocalDate();
    return startDate.plusDays(30);
  }

  public List<BusinessProcedureWithInclusionStatusDto> getBusinessProceduresWithInclusionStatus(
      UUID gdprId, GdprValidationTaskType type, List<UUID> fileStateIds) {
    if (fileStateIds.isEmpty()) {
      return List.of();
    }
    List<ProcedureT> procedures = procedureRepository.findByFileStateIds(fileStateIds);
    List<ProcedureDto> enrichedProcedures = enrichingMapper.enrichAndMapProcedures(procedures);
    return switch (type) {
      case RIGHT_OF_ACCESS -> enrichWithInclusionStatusForAccess(enrichedProcedures, gdprId);
      case RIGHT_TO_ERASURE -> enrichAllWithStatusUndecided(enrichedProcedures);
    };
  }

  private List<BusinessProcedureWithInclusionStatusDto> enrichWithInclusionStatusForAccess(
      List<ProcedureDto> enrichedProcedures, UUID gdprId) {
    GetGdprDownloadsResponse downloadIdsFromBase = fetchDownloadIdsFromBase(gdprId);
    List<UUID> knownProcedureIds =
        findBusinessProcedureIdsByDownloadIdIn(downloadIdsFromBase.downloadIds());

    return enrichedProcedures.stream()
        .map(
            eP ->
                new BusinessProcedureWithInclusionStatusDto(
                    eP, getInclusionStatusFromList(eP.procedureId(), knownProcedureIds)))
        .toList();
  }

  private static BusinessProcedureInclusionStatusDto getInclusionStatusFromList(
      UUID id, List<UUID> includedIds) {
    return includedIds.contains(id)
        ? BusinessProcedureInclusionStatusDto.INCLUDED
        : BusinessProcedureInclusionStatusDto.UNDECIDED;
  }

  private List<BusinessProcedureWithInclusionStatusDto> enrichAllWithStatusUndecided(
      List<ProcedureDto> enrichedProcedures) {
    return enrichedProcedures.stream()
        .map(
            eP ->
                new BusinessProcedureWithInclusionStatusDto(
                    eP, BusinessProcedureInclusionStatusDto.UNDECIDED))
        .toList();
  }

  public void closeTask(UUID gdprProcedureId) {
    GdprValidationTask task = getTaskForUpdate(gdprProcedureId);
    if (CLOSED != task.getStatus()) {
      log.info("Closing GdprProcedure with gdprProcedureId: {}", gdprProcedureId);
      task.setStatus(CLOSED);
      task.setClosedAt(clock.instant());
      writeAuditLog("Schließen Prüfauftrag", mapAuditLog(task));
    }
  }

  private GdprValidationTask getTaskForUpdate(UUID gdprProcedureId) {
    return validationTaskRepository
        .findByExternalIdForUpdate(gdprProcedureId)
        .orElseThrow(() -> new NotFoundException("GdprValidationTask not found."));
  }

  public Page<GdprValidationTask> findAll(
      GdprValidationTaskStatus status, PaginationUtil.PageSpec pageSpec) {
    Specification<GdprValidationTask> specification = Specification.allOf(hasStatus(status));

    Sort sortOrder =
        Sort.by(
            pageSpec.order().getDirection() == Sort.Direction.ASC
                ? Sort.Order.desc(GdprValidationTask_.STATUS)
                : Sort.Order.asc(GdprValidationTask_.STATUS),
            pageSpec.order());

    return validationTaskRepository.findAll(
        specification, PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize(), sortOrder));
  }

  private static Specification<GdprValidationTask> hasStatus(GdprValidationTaskStatus status) {
    if (status == null) {
      return (root, query, builder) -> builder.and();
    }
    return (root, query, cb) -> cb.equal(root.get(GdprValidationTask_.status), status);
  }

  public void writeAuditLog(String operationName, Map<String, String> attributes) {
    attributes = new LinkedHashMap<>(attributes);
    attributes.put(
        "durch Benutzer", CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"));
    auditLogger.log(AUDITLOG_CATEGORY, operationName, attributes);
  }

  public Map<String, String> mapAuditLog(GdprValidationTask task) {
    return Map.of("Prüfauftrag ID", task.getGdprProcedureId().toString());
  }

  public boolean findDownloadPackageByGdprIdAndProcedureId(
      UUID gdprProcedureId, UUID businessProcedureId) {
    GetGdprDownloadsResponse downloadIdsFromBase = fetchDownloadIdsFromBase(gdprProcedureId);
    return downloadPackageRepository.existsByBusinessProcedureIdAndExternalIdIn(
        businessProcedureId, downloadIdsFromBase.downloadIds());
  }

  public void deleteValidationTask(UUID gdprProcedureId) {
    validationTaskRepository.deleteByGdprProcedureId(gdprProcedureId);
  }

  public void deleteDownloadPackages(Collection<UUID> downloadIds) {
    downloadPackageRepository.deleteAllByExternalIdIn(downloadIds);
  }

  private void validatePermissionToAccessGdprProcedure(UUID gdprProcedureId) {
    IdentificationData procedureIdentificationData = getIdentificationData(gdprProcedureId);
    IdentificationData userIdentificationData = getIdentificationDataOfCurrentUser();
    if (!procedureIdentificationData.equals(userIdentificationData)) {
      log.info(
          "User {} tried to access procedure of {}",
          userIdentificationData,
          procedureIdentificationData);
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "User is not allowed to access this procedure");
    }
  }

  private IdentificationData getIdentificationData(UUID gdprProcedureId) {
    GdprIdentificationDataDto identificationData = getGdprIdentificationData(gdprProcedureId);
    return switch (identificationData) {
      case null -> throw new IllegalStateException("Identification data null");
      case GdprPersonDto p -> getIdentificationData(p);
      case GdprFacilityDto f -> getIdentificationData(f);
      default ->
          throw new IllegalStateException(
              "Unexpected type of IdentificationData: " + identificationData.getClass());
    };
  }

  private IdentificationData getIdentificationData(GdprPersonDto p) {
    if (StringUtils.isEmpty(p.bpk2())) {
      return IdentificationData.standardEmployee();
    } else {
      return IdentificationData.bundIdUser(p.bpk2());
    }
  }

  private IdentificationData getIdentificationData(GdprFacilityDto f) {
    if (StringUtils.isEmpty(f.dataTransmitterPseudonymId())) {
      return IdentificationData.standardEmployee();
    } else {
      return IdentificationData.mukUser(f.dataTransmitterPseudonymId());
    }
  }

  private IdentificationData getIdentificationDataOfCurrentUser() {
    if (CurrentUserHelper.isEmployee()) {
      return IdentificationData.standardEmployee();
    }
    Assert.isTrue(
        !CurrentUserHelper.currentUserHasRole(MUK_USER)
            || !CurrentUserHelper.currentUserHasRole(BUND_ID_USER),
        "User has BUND_ID and MUK roles");
    if (CurrentUserHelper.currentUserHasRole(BUND_ID_USER)) {
      Optional<String> bpk2Gracefully = CurrentUserHelper.getBundIdGracefully();
      if (bpk2Gracefully.isEmpty()) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN, "Bund-id user does not have a bpk2");
      }
      return IdentificationData.bundIdUser(bpk2Gracefully.get());
    }
    if (CurrentUserHelper.currentUserHasRole(MUK_USER)) {
      Optional<String> mukIdGracefully = CurrentUserHelper.getMukIdGracefully();
      if (mukIdGracefully.isEmpty()) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN, "Muk user does not have a dataTransmitterPseudonymId");
      }
      return IdentificationData.mukUser(mukIdGracefully.get());
    }
    throw new ResponseStatusException(
        HttpStatus.FORBIDDEN, "User is neither employee nor Bund-id user nor Muk-user");
  }

  private record IdentificationData(IdentificationDataType type, String id) {
    private static final PasswordEncoder argon2 = new Argon2PasswordEncoder(16, 32, 1, 7 * 1024, 5);

    static IdentificationData standardEmployee() {
      return new IdentificationData(IdentificationDataType.STANDARD_EMPLOYEE, "");
    }

    static IdentificationData bundIdUser(String id) {
      return new IdentificationData(IdentificationDataType.BUND_ID_USER, id);
    }

    static IdentificationData mukUser(String id) {
      return new IdentificationData(IdentificationDataType.MUK_USER, id);
    }

    String hash() {
      return argon2.encode(string());
    }

    boolean verify(String hash) {
      return argon2.matches(string(), hash);
    }

    private String string() {
      return type.encodedName + id;
    }

    private enum IdentificationDataType {
      STANDARD_EMPLOYEE("STANDARD_EMPLOYEE"),
      BUND_ID_USER("BUND_ID_USER"),
      MUK_USER("MUK_USER"),
      ;

      // never change the values of encodedName, their hashes are stored in the database
      private final String encodedName;

      IdentificationDataType(String encodedName) {
        this.encodedName = encodedName;
      }
    }
  }
}
