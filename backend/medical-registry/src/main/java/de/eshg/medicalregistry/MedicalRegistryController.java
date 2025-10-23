/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import static de.eshg.medicalregistry.business.model.MedicalRegistryKeyDocumentType.IDENTIFICATION_DOCUMENT;
import static de.eshg.medicalregistry.business.model.MedicalRegistryKeyDocumentType.PROFESSIONAL_LICENSE_CERTIFICATE;
import static de.eshg.medicalregistry.business.model.MedicalRegistryKeyDocumentType.WORK_PERMIT;
import static de.eshg.rest.service.security.config.BaseUrls.MedicalRegistry.CITIZEN_PORTAL_ENDPOINT;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.api.commons.InlineParameterObject;
import de.eshg.base.centralfile.api.facility.FacilityDetails;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.PersonDetails;
import de.eshg.base.user.UserApi;
import de.eshg.file.common.FileType;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.Image;
import de.eshg.lib.procedure.domain.model.ProcedureFileType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.procedure.file.MultipartFileParser;
import de.eshg.lib.procedure.procedures.ProcedureSearchService;
import de.eshg.medicalregistry.api.ConfirmProcedureRequest;
import de.eshg.medicalregistry.api.CreateProcedureRequest;
import de.eshg.medicalregistry.api.DeleteProcedureRequest;
import de.eshg.medicalregistry.api.GetMedicalRegistryEntries;
import de.eshg.medicalregistry.api.GetMedicalRegistryProceduresFilterOptions;
import de.eshg.medicalregistry.api.GetMedicalRegistryProceduresPaginationOptions;
import de.eshg.medicalregistry.api.GetProcedureResponse;
import de.eshg.medicalregistry.api.MedicalRegistryEntryDto;
import de.eshg.medicalregistry.api.ProcedureReferenceDto;
import de.eshg.medicalregistry.business.model.DocumentData;
import de.eshg.medicalregistry.business.model.MedicalRegistryKeyDocumentType;
import de.eshg.medicalregistry.config.MedicalRegistryProperties;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import de.eshg.medicalregistry.domain.model.TypeOfChange;
import de.eshg.medicalregistry.featuretoggle.MedicalRegistryFeature;
import de.eshg.medicalregistry.featuretoggle.MedicalRegistryFeatureToggle;
import de.eshg.medicalregistry.mapper.ConfirmInfoMapper;
import de.eshg.medicalregistry.mapper.EntryMapper;
import de.eshg.medicalregistry.mapper.ProcedureMapper;
import de.eshg.persistence.IntentionalWritingTransaction;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(MedicalRegistryController.BASE_URL)
@Tag(name = "MedicalRegistry")
public class MedicalRegistryController {

  static final String BASE_URL = BaseUrls.MedicalRegistry.MEDICAL_REGISTRY_CONTROLLER;

  static final int MAX_OTHER_RELEVANT_DOCUMENTS = 3;

  private static final String REQUEST_PARAM_NAME_PROCEDURE = "procedure";
  private static final String REQUEST_PARAM_NAME_PROFESSIONAL_LICENSE_CERTIFICATE =
      "professionalLicenseCertificate";
  private static final String REQUEST_PARAM_NAME_IDENTIFICATION_DOCUMENT = "identificationDocument";
  private static final String REQUEST_PARAM_NAME_WORK_PERMIT = "workPermit";
  private static final String REQUEST_PARAM_NAME_OTHER_RELEVANT_DOCUMENTS =
      "otherRelevantDocuments";
  protected static final EnumSet<ProcedureStatus> RELEVANT_STATUS =
      EnumSet.of(ProcedureStatus.DRAFT, ProcedureStatus.OPEN);

  private final MedicalRegistryService medicalRegistryService;
  private final PersonService personService;
  private final FacilityService facilityService;
  private final MedicalRegistryFeatureToggle featureToggle;
  private final MedicalRegistryGuard medicalRegistryGuard;
  private final Validator validator;
  private final AuditLogger auditLogger;
  private final UserApi userApi;
  private final ProcedureSearchService<MedicalRegistryProcedure> searchService;
  private final MedicalRegistryProperties medicalRegistryProperties;

  public MedicalRegistryController(
      MedicalRegistryService medicalRegistryService,
      PersonService personService,
      FacilityService facilityService,
      MedicalRegistryFeatureToggle featureToggle,
      MedicalRegistryGuard medicalRegistryGuard,
      Validator validator,
      AuditLogger auditLogger,
      UserApi userApi,
      ProcedureSearchService<MedicalRegistryProcedure> searchService,
      MedicalRegistryProperties medicalRegistryProperties) {
    this.medicalRegistryService = medicalRegistryService;
    this.personService = personService;
    this.facilityService = facilityService;
    this.featureToggle = featureToggle;
    this.medicalRegistryGuard = medicalRegistryGuard;
    this.validator = validator;
    this.auditLogger = auditLogger;
    this.userApi = userApi;
    this.searchService = searchService;
    this.medicalRegistryProperties = medicalRegistryProperties;
  }

  @PostMapping("/{procedureId}/confirm")
  @Transactional
  public UUID confirmProcedure(
      @PathVariable("procedureId") UUID procedureId,
      @RequestBody @Valid ConfirmProcedureRequest confirmProcedureRequest) {
    MedicalRegistryEntryChange sourceMedicalRegistryChange =
        Validator.validateIsMedicalRegistryEntryChange(
            medicalRegistryService
                .findProcedureByExternalIdForUpdate(procedureId, confirmProcedureRequest.version())
                .orElseThrow(MedicalRegistryController::notFoundException));

    Validator.validateIsDraft(sourceMedicalRegistryChange);

    if (confirmProcedureRequest.practiceReferenceFacility() != null) {
      Validator.validateHasPractice(sourceMedicalRegistryChange);
    }

    MedicalRegistryEntry mergeTarget =
        findAndValidateMergeTargetByReferenceIfPresent(confirmProcedureRequest);
    Validator.validateIsHasCompleteInformationForInitialConfirm(
        sourceMedicalRegistryChange, mergeTarget);

    Validator.validateEmployeeChangesCorrespondToDraftChanges(
        sourceMedicalRegistryChange, confirmProcedureRequest.employeeChanges());

    auditLogProcedureConfirmation(
        procedureId, confirmProcedureRequest, sourceMedicalRegistryChange.getTypeOfChange());

    return medicalRegistryService
        .confirmProcedure(
            sourceMedicalRegistryChange,
            confirmProcedureRequest.professionalReferencePerson(),
            confirmProcedureRequest.practiceReferenceFacility(),
            confirmProcedureRequest.employeeChanges(),
            mergeTarget)
        .getExternalId();
  }

  @GetMapping("/{procedureId}/confirm-info")
  @Transactional(readOnly = true)
  public GetConfirmInfoResponse getConfirmInfo(@PathVariable("procedureId") UUID procedureId) {
    MedicalRegistryEntryChange change =
        Validator.validateIsMedicalRegistryEntryChange(
            medicalRegistryService
                .findProcedureByExternalId(procedureId)
                .orElseThrow(MedicalRegistryController::notFoundException));

    Validator.validateIsDraft(change);

    return ConfirmInfoMapper.mapToConfirmInfoResponse(
        change.getVersion(), medicalRegistryService.getConfirmInfo(change));
  }

  private void auditLogProcedureConfirmation(
      UUID procedureId,
      ConfirmProcedureRequest confirmProcedureRequest,
      TypeOfChange typeOfChange) {

    Map<String, String> additionalData =
        Map.of(
            "Benutzer",
            userApi.getSelfUser().userId().toString(),
            "ID des Draft-Vorgangs",
            procedureId.toString(),
            "ID des Ziel-Vorgangs",
            Optional.ofNullable(confirmProcedureRequest.target())
                .map(ProcedureReferenceDto::id)
                .map(UUID::toString)
                .orElse("-"),
            "Art der Änderung",
            typeOfChange.name());

    auditLogger.log("Vorgangsbearbeitung", "Eintrag erstellen / ändern", additionalData);
  }

  private MedicalRegistryEntry findAndValidateMergeTargetByReferenceIfPresent(
      ConfirmProcedureRequest confirmProcedureRequest) {
    if (confirmProcedureRequest.target() == null) {
      return null;
    }

    ProcedureReferenceDto targetReference = confirmProcedureRequest.target();
    MedicalRegistryEntry mergeTarget =
        medicalRegistryService
            .findProcedureByExternalIdForUpdate(targetReference.id(), targetReference.version())
            .map(Validator::validateIsMedicalRegistryEntry)
            .orElseThrow(() -> new BadRequestException(makeProcedureNotFoundMessage()));

    validator.validateMergeTarget(
        mergeTarget,
        confirmProcedureRequest.professionalReferencePerson(),
        confirmProcedureRequest.employeeChanges());

    return mergeTarget;
  }

  @PostMapping(path = CITIZEN_PORTAL_ENDPOINT, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public UUID createProcedureFromCitizenPortal(
      @RequestPart(name = REQUEST_PARAM_NAME_PROCEDURE) @Valid CreateProcedureRequest request,
      @RequestPart(name = REQUEST_PARAM_NAME_PROFESSIONAL_LICENSE_CERTIFICATE, required = false)
          MultipartFile professionalLicenseCertificate,
      @RequestPart(name = REQUEST_PARAM_NAME_IDENTIFICATION_DOCUMENT)
          MultipartFile identificationDocument,
      @RequestPart(name = REQUEST_PARAM_NAME_WORK_PERMIT, required = false)
          MultipartFile workPermit,
      @RequestPart(name = REQUEST_PARAM_NAME_OTHER_RELEVANT_DOCUMENTS, required = false)
          @Size(max = MAX_OTHER_RELEVANT_DOCUMENTS)
          List<MultipartFile> otherRelevantDocuments) {

    featureToggle.assertNewFeatureIsEnabled(MedicalRegistryFeature.CITIZEN_PORTAL_ENABLED);

    medicalRegistryGuard.guard();

    return createProcedureCommon(
        request,
        professionalLicenseCertificate,
        identificationDocument,
        workPermit,
        otherRelevantDocuments,
        TriggerType.CITIZEN,
        ProcedureType.MEDICAL_REGISTRY_CITIZEN_DRAFT);
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public UUID createProcedure(
      @RequestPart(name = REQUEST_PARAM_NAME_PROCEDURE) @Valid CreateProcedureRequest request,
      @RequestPart(name = REQUEST_PARAM_NAME_PROFESSIONAL_LICENSE_CERTIFICATE, required = false)
          MultipartFile professionalLicenseCertificate,
      @RequestPart(name = REQUEST_PARAM_NAME_IDENTIFICATION_DOCUMENT)
          MultipartFile identificationDocument,
      @RequestPart(name = REQUEST_PARAM_NAME_WORK_PERMIT, required = false)
          MultipartFile workPermit,
      @RequestPart(name = REQUEST_PARAM_NAME_OTHER_RELEVANT_DOCUMENTS, required = false)
          @Size(max = MAX_OTHER_RELEVANT_DOCUMENTS)
          List<MultipartFile> otherRelevantDocuments) {

    return createProcedureCommon(
        request,
        professionalLicenseCertificate,
        identificationDocument,
        workPermit,
        otherRelevantDocuments,
        TriggerType.EMPLOYEE,
        ProcedureType.MEDICAL_REGISTRY_EMPLOYEE_DRAFT);
  }

  private UUID createProcedureCommon(
      CreateProcedureRequest request,
      MultipartFile professionalLicenseCertificate,
      MultipartFile identificationDocument,
      MultipartFile workPermit,
      List<MultipartFile> otherRelevantDocuments,
      TriggerType triggerType,
      ProcedureType procedureType) {

    List<DocumentData> providedDocuments =
        getProvidedDocuments(
            professionalLicenseCertificate,
            identificationDocument,
            workPermit,
            otherRelevantDocuments);

    MedicalRegistryEntryChange procedure =
        medicalRegistryService.createProcedure(
            request, providedDocuments, triggerType, procedureType);

    return procedure.getExternalId();
  }

  private List<DocumentData> getProvidedDocuments(
      MultipartFile professionalLicenseCertificate,
      MultipartFile identificationDocument,
      MultipartFile workPermit,
      List<MultipartFile> otherRelevantDocuments) {

    List<DocumentData> providedDocuments = new ArrayList<>();

    addIfProvided(
        professionalLicenseCertificate,
        addJpgExtension("Berufserlaubnisurkunde"),
        "Upload Berufserlaubnisurkunde",
        PROFESSIONAL_LICENSE_CERTIFICATE,
        providedDocuments);

    addIfProvided(
        identificationDocument,
        addJpgExtension("Ausweis_Pass"),
        "Upload Ausweis/Pass",
        IDENTIFICATION_DOCUMENT,
        providedDocuments);

    addIfProvided(
        workPermit,
        addJpgExtension("Arbeitserlaubnis"),
        "Upload Arbeitserlaubnis",
        WORK_PERMIT,
        providedDocuments);

    if (otherRelevantDocuments != null) {
      otherRelevantDocuments.forEach(
          otherRelevantDocument ->
              addIfProvided(
                  otherRelevantDocument,
                  otherRelevantDocument.getOriginalFilename(),
                  "Upload weiterer relevanter Dokumente",
                  null,
                  providedDocuments));
    }

    return providedDocuments;
  }

  @GetMapping("/{procedureId}")
  @Transactional
  @IntentionalWritingTransaction(reason = "Audit logging")
  @Operation(summary = "Get medical registry procedure by id.")
  public GetProcedureResponse getProcedure(@PathVariable("procedureId") UUID procedureId) {
    MedicalRegistryProcedure medicalRegistryProcedure =
        medicalRegistryService
            .findProcedureByExternalId(procedureId)
            .orElseThrow(MedicalRegistryController::notFoundException);

    Map<UUID, PersonDetails> personDetails =
        personService.findPersonDetails(medicalRegistryProcedure.getRelatedPersons()).stream()
            .collect(
                StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id, Function.identity()));

    Map<UUID, FacilityDetails> practiceDetails =
        facilityService
            .findPracticeDetails(medicalRegistryProcedure.getRelatedFacilities())
            .stream()
            .collect(
                StreamUtil.toLinkedHashMap(GetFacilityFileStateResponse::id, Function.identity()));

    auditLogProcedureDetailAccess(procedureId);

    return ProcedureMapper.mapToDto(medicalRegistryProcedure, personDetails, practiceDetails);
  }

  private void auditLogProcedureDetailAccess(UUID procedureId) {
    Map<String, String> additionalData =
        Map.of(
            "Benutzer", userApi.getSelfUser().userId().toString(),
            "ID des Vorgangs", procedureId.toString());
    auditLogger.log("Vorgangsbearbeitung", "Abfrage Vorgangs-Details", additionalData);
  }

  @DeleteMapping("/{procedureId}")
  @Transactional
  @Operation(summary = "Delete medical registry procedure by id.")
  public void deleteProcedure(
      @PathVariable("procedureId") UUID procedureId,
      @Valid @RequestBody DeleteProcedureRequest request) {
    MedicalRegistryProcedure medicalRegistryProcedure =
        medicalRegistryService
            .findProcedureByExternalIdForUpdate(procedureId, request.version())
            .orElseThrow(MedicalRegistryController::notFoundException);
    MedicalRegistryEntryChange medicalRegistryEntryChange =
        Validator.validateIsMedicalRegistryEntryChange(medicalRegistryProcedure);

    Validator.validateIsDraft(medicalRegistryEntryChange);

    medicalRegistryService.deleteProcedure(medicalRegistryEntryChange);
  }

  @GetMapping
  @Transactional(readOnly = true)
  @Operation(
      summary =
          "Get paginated and optionally filtered medical registry procedures. Filtering is optional")
  public GetMedicalRegistryEntries getProcedureOverview(
      @Valid @ParameterObject @InlineParameterObject
          GetMedicalRegistryProceduresPaginationOptions paginationOptions,
      @Valid @ParameterObject @InlineParameterObject
          GetMedicalRegistryProceduresFilterOptions filterOptions) {

    return medicalRegistryService.getProceduresOverview(paginationOptions, filterOptions);
  }

  @GetMapping("/search")
  @Transactional(readOnly = true)
  @Operation(
      summary = "Search medical registry entries for request parameter",
      description =
          """
        Searches for matches in person and facility.
        As well as lifetime doctor number, establishment number and institution identifier.
        """)
  public GetMedicalRegistryEntries searchProcedures(@RequestParam("query") String query) {
    ProcedureSearchService.Result<MedicalRegistryProcedure> searchResult =
        searchService.searchProcedures(query, RELEVANT_STATUS);

    List<MedicalRegistryEntryDto> entryDtos =
        searchResult.procedures().stream()
            .map(procedure -> EntryMapper.mapToDto(procedure, searchResult.personFileStatesById()))
            .toList();
    return new GetMedicalRegistryEntries(1, searchResult.procedures().size(), entryDtos);
  }

  private void addIfProvided(
      MultipartFile multipartFile,
      String filename,
      String description,
      MedicalRegistryKeyDocumentType keyDocumentType,
      List<DocumentData> providedDocuments) {
    if (multipartFile != null) {
      providedDocuments.add(
          new DocumentData(
              description, keyDocumentType, rename(validateAndParseFile(multipartFile), filename)));
    }
  }

  private static Image rename(Image image, String filename) {
    image.setFileName(filename);
    return image;
  }

  private Image validateAndParseFile(MultipartFile multipartFile) {
    try {
      if (MultipartFileParser.validateAndParseFile(
                  multipartFile, medicalRegistryProperties.getMaxImageSideLength())
              instanceof Image image
          && ProcedureFileType.JPEG == image.getFileType()) {
        return image;
      } else {
        throw new BadRequestException(
            ErrorCode.INVALID_FILE,
            String.format(
                "The file type of %s is not %s.", multipartFile.getName(), ProcedureFileType.JPEG));
      }
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  private static String addJpgExtension(String filename) {
    return String.format("%s.%s", filename, FileType.JPEG.getDefaultFileExtension().getValue());
  }

  private static NotFoundException notFoundException() {
    return new NotFoundException(makeProcedureNotFoundMessage());
  }

  private static String makeProcedureNotFoundMessage() {
    return "%s with given UUID not found".formatted(MedicalRegistryProcedure.class.getSimpleName());
  }
}
