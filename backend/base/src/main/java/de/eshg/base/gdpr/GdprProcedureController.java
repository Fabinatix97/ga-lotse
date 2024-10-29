/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import static de.eshg.base.gdpr.GdprPocedureMapper.*;

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
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.validation.ValidationUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;
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

  public GdprProcedureController(
      GdprProcedureService service,
      PersonService personService,
      FacilityService facilityService,
      PersonRepository personRepository,
      FacilityRepository facilityRepository,
      GdprRightToObjectLetterGenerator rightToObjectLetterGenerator,
      BaseFeatureToggle baseFeatureToggle) {
    this.service = service;
    this.personService = personService;
    this.facilityService = facilityService;
    this.personRepository = personRepository;
    this.facilityRepository = facilityRepository;
    this.rightToObjectLetterGenerator = rightToObjectLetterGenerator;
    this.baseFeatureToggle = baseFeatureToggle;
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

  private GdprProcedure getGdprProcedureFromDb(UUID id) {
    return service.findByExternalId(id).orElseThrow(notFound(id));
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
              personService.fuzzySearch(
                  person.firstName(), person.lastName(), person.dateOfBirth());
        }
      }
      case GdprFacilityDto facility -> {
        if (procedure.centralFileId() != null) {
          linkedFacilities =
              List.of(facilityService.getReferenceFacility(procedure.centralFileId()));
        } else if (procedure.status() == GdprProcedureStatusDto.DRAFT) {
          facilityMatches = facilityService.searchReferenceFacilities(facility.name());
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
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    GdprProcedure procedure = service.getGdprProcedureForUpdate(id);
    ValidationUtil.validateVersion(request.version(), procedure);
    procedure.setMatterOfConcern(request.concern());
  }

  @Override
  @Transactional
  public void changeStatus(UUID id, GdprProcedureChangeStatusRequest request) {
    baseFeatureToggle.assertNewFeatureIsEnabled(BaseFeature.GDPR);
    GdprProcedure procedure = service.getGdprProcedureForUpdate(id);

    if (procedure.getType() != GdprProcedureType.RIGHT_TO_OBJECT) {
      throw new BadRequestException(
          "Changing the status of GDPR procedures with type '"
              + procedure.getType()
              + "' is not supported yet.");
    }

    ValidationUtil.validateVersion(request.version(), procedure);

    if (procedure.getStatus() == GdprProcedureStatus.DRAFT) {
      if (request.newStatus() != GdprProcedureStatusDto.IN_PROGRESS) {
        throw badStatusTransition(request.newStatus(), procedure.getStatus());
      }

      if (procedure.getMatterOfConcern() == null) {
        throw new BadRequestException("Cannot start procedure without valid matter of concern.");
      }

      procedure.setStatus(GdprProcedureStatus.IN_PROGRESS);
    } else {
      throw badStatusTransition(request.newStatus(), procedure.getStatus());
    }
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
