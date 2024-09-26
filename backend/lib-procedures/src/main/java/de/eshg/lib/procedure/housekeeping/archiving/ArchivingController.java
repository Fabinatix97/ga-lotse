/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.housekeeping.archiving;

import static de.eshg.domain.model.BaseEntity_.ID;
import static de.eshg.lib.procedure.MapperHelper.mapEnumSet;
import static de.eshg.lib.procedure.domain.model.Procedure_.CLOSED_AT;
import static de.eshg.lib.procedure.domain.model.Procedure_.EXPORTED_AT;
import static de.eshg.lib.procedure.domain.model.Procedure_.PROCEDURE_TYPE;
import static de.eshg.lib.procedure.domain.model.Procedure_.archivingRelevance;
import static de.eshg.lib.procedure.domain.model.Procedure_.closedAt;
import static de.eshg.lib.procedure.domain.model.Procedure_.exportedAt;
import static de.eshg.lib.procedure.domain.model.Procedure_.procedureType;
import static java.time.format.DateTimeFormatter.ISO_LOCAL_DATE;
import static java.time.temporal.ChronoField.HOUR_OF_DAY;
import static java.time.temporal.ChronoField.MINUTE_OF_HOUR;
import static java.time.temporal.ChronoField.SECOND_OF_MINUTE;
import static org.springframework.data.domain.PageRequest.ofSize;
import static org.springframework.data.jpa.domain.Specification.where;
import static org.springframework.http.HttpHeaders.CONTENT_DISPOSITION;

import de.base.rest.CustomMediaTypes;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.util.CollectionUtils;
import de.eshg.domain.model.EntityWithExternalId;
import de.eshg.domain.model.SequencedBaseEntityWithExternalId_;
import de.eshg.lib.procedure.api.ArchivingApi;
import de.eshg.lib.procedure.domain.model.ArchivingRelevance;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.Task;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.procedure.domain.serialization.SerializationService;
import de.eshg.lib.procedure.domain.specification.ArchivableProceduresSpecification;
import de.eshg.lib.procedure.mapping.ProcedureLibraryEnrichingMapper;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.lib.procedure.model.ArchivingDetailsDto;
import de.eshg.lib.procedure.model.ArchivingRelevanceDto;
import de.eshg.lib.procedure.model.BulkUpdateProceduresArchivingRelevanceRequest;
import de.eshg.lib.procedure.model.BulkUpdateProceduresArchivingRelevanceResponse;
import de.eshg.lib.procedure.model.ExportArchivingRelevantProceduresRequest;
import de.eshg.lib.procedure.model.GetArchivableProceduresFilterOptions;
import de.eshg.lib.procedure.model.GetArchivableProceduresResponse;
import de.eshg.lib.procedure.model.GetArchivableProceduresSortByDto;
import de.eshg.lib.procedure.model.GetArchivableProceduresSortOptions;
import de.eshg.lib.procedure.model.GetArchivableProceduresSortOrderDto;
import de.eshg.lib.procedure.model.GetArchivingConfigurationResponse;
import de.eshg.lib.procedure.model.GetProceduresPaginationOptions;
import de.eshg.lib.procedure.model.GetRelevantArchivableProceduresFilterOptions;
import de.eshg.lib.procedure.model.GetRelevantArchivableProceduresResponse;
import de.eshg.lib.procedure.model.GetRelevantArchivableProceduresSortByDto;
import de.eshg.lib.procedure.model.GetRelevantArchivableProceduresSortOptions;
import de.eshg.lib.procedure.model.GetRelevantArchivableProceduresSortOrderDto;
import de.eshg.lib.procedure.model.ProcedureTypeDto;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ContentDisposition;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Archiving")
public class ArchivingController<
        ProcedureT extends Procedure<ProcedureT, TaskT, ?, ?>, TaskT extends Task<ProcedureT>>
    implements ArchivingApi {

  private static final DateTimeFormatter ARCHIVE_EXPORT_DATE_TIME_FORMATTER =
      new DateTimeFormatterBuilder()
          .parseCaseInsensitive()
          .append(ISO_LOCAL_DATE)
          .appendLiteral('T')
          .appendValue(HOUR_OF_DAY, 2)
          .appendLiteral('-')
          .appendValue(MINUTE_OF_HOUR, 2)
          .optionalStart()
          .appendLiteral('-')
          .appendValue(SECOND_OF_MINUTE, 2)
          .toFormatter();

  private static final String ARCHIVE_EXPORT_FILE_NAME_TEMPLATE = "Archiv-Vorgangsexport_%s.zip";
  private static final String ARCHIVE_EXPORT_ZIP_ENTRY_NAME_TEMPLATE = "Archiv-Vorgang_";
  private static final String CONTENT_DISPOSITION_NAME_ZIP = "zip";
  private final ProcedureLibraryEnrichingMapper<ProcedureT, TaskT> enrichingMapper;
  private final ProcedureRepository<ProcedureT> procedureRepository;
  private final ArchivableProceduresSpecification<ProcedureT> archivableProceduresSpecification;
  private final ArchivingProperties archivingProperties;
  private final SerializationService serializationService;
  private final Clock clock;

  public ArchivingController(
      ProcedureLibraryEnrichingMapper<ProcedureT, TaskT> enrichingMapper,
      ProcedureRepository<ProcedureT> procedureRepository,
      ArchivableProceduresSpecification<ProcedureT> archivableProceduresSpecification,
      ArchivingProperties archivingProperties,
      SerializationService serializationService,
      Clock clock) {
    this.enrichingMapper = enrichingMapper;
    this.procedureRepository = procedureRepository;
    this.archivableProceduresSpecification = archivableProceduresSpecification;
    this.archivingProperties = archivingProperties;
    this.serializationService = serializationService;
    this.clock = clock;
  }

  @Override
  @Transactional(readOnly = true)
  public GetArchivableProceduresResponse getArchivableProcedures(
      GetArchivableProceduresFilterOptions filterOptions,
      GetArchivableProceduresSortOptions sortOptions,
      GetProceduresPaginationOptions paginationOptions) {

    Page<ProcedureT> procedurePage =
        procedureRepository.findAll(
            where(archivableProceduresSpecification)
                .and(archivableProceduresSpecification.procedureHasArchivingRelevanceDefault())
                .and(procedureTypes(filterOptions.procedureType()))
                .and(closedAtDay(filterOptions.closedAtDay()))
                .and(defaultArchivingRelevance(filterOptions.defaultArchivingRelevance())),
            ofSize(paginationOptions.pageSize())
                .withPage(paginationOptions.pageNumber())
                .withSort(mapToSort(sortOptions)));

    return new GetArchivableProceduresResponse(
        procedurePage.getTotalPages(),
        procedurePage.getTotalElements(),
        procedurePage.stream().map(enrichingMapper::enrichAndMap).toList());
  }

  private Specification<ProcedureT> procedureTypes(Set<ProcedureTypeDto> procedureTypes) {
    if (procedureTypes == null || procedureTypes.isEmpty()) {
      return null;
    }

    Set<de.eshg.lib.procedure.domain.model.ProcedureType> types =
        mapEnumSet(procedureTypes, ProcedureMapper::toDomainType);
    return (root, query, cb) -> root.get(procedureType).in(types);
  }

  private Specification<ProcedureT> closedAtDay(LocalDate closedAtDay) {
    if (closedAtDay == null) {
      return null;
    }

    Instant startOfDay = getStartOfDay(closedAtDay);
    Instant startOfNextDay = getStartOfDay(closedAtDay.plusDays(1));

    return (procedure, query, cb) ->
        cb.and(
            cb.greaterThanOrEqualTo(procedure.get(closedAt), startOfDay),
            cb.lessThan(procedure.get(closedAt), startOfNextDay));
  }

  private Specification<ProcedureT> exported(Boolean exported) {
    if (exported == null) {
      return null;
    }

    return (procedure, query, cb) -> {
      if (exported) {
        return cb.isNotNull(procedure.get(exportedAt));
      } else {
        return cb.isNull(procedure.get(exportedAt));
      }
    };
  }

  private Specification<ProcedureT> defaultArchivingRelevance(
      Set<ArchivingRelevanceDto> archivingRelevances) {
    if (archivingRelevances == null || archivingRelevances.isEmpty()) {
      return null;
    }
    Set<de.eshg.lib.procedure.domain.model.ArchivingRelevance> relevances =
        mapEnumSet(archivingRelevances, ProcedureMapper::toDomainType);

    Set<ProcedureType> procedureTypes =
        archivingProperties.getProcedureTypesOrElseEmpty(relevances);

    return (root, query, cb) -> root.get(procedureType).in(procedureTypes);
  }

  private Instant getStartOfDay(LocalDate closedAtDay) {
    return closedAtDay.atStartOfDay(clock.getZone()).toInstant();
  }

  private Sort mapToSort(GetArchivableProceduresSortOptions sortOptions) {
    return Sort.by(
        Order.by(mapToDomainProperty(sortOptions.sortBy()))
            .with(mapToSortOrder(sortOptions.sortOrder())),
        Order.by(ID));
  }

  private Direction mapToSortOrder(GetArchivableProceduresSortOrderDto sortOrder) {
    return switch (sortOrder) {
      case ASC -> Direction.ASC;
      case DESC -> Direction.DESC;
    };
  }

  private String mapToDomainProperty(GetArchivableProceduresSortByDto sortBy) {
    return switch (sortBy) {
      case CLOSED_AT -> CLOSED_AT;
      case PROCEDURE_TYPE -> PROCEDURE_TYPE;
    };
  }

  @Override
  @Transactional
  public BulkUpdateProceduresArchivingRelevanceResponse bulkUpdateProceduresArchivingRelevance(
      BulkUpdateProceduresArchivingRelevanceRequest request) {
    List<ProcedureT> procedures =
        procedureRepository.findAll(
            where(archivableProceduresSpecification).and(externalIds(request.procedures())));

    ArchivingRelevance domainArchivingRelevance =
        ProcedureMapper.toDomainType(request.archivingRelevance());

    for (ProcedureT procedure : procedures) {
      procedure.setArchivingRelevance(domainArchivingRelevance);
    }

    Set<UUID> updatedProcedures =
        procedures.stream().map(EntityWithExternalId::getExternalId).collect(Collectors.toSet());

    Set<UUID> failedProcedures =
        CollectionUtils.difference(request.procedures(), updatedProcedures);

    return new BulkUpdateProceduresArchivingRelevanceResponse(
        updatedProcedures, failedProcedures, request.archivingRelevance());
  }

  private Specification<ProcedureT> externalIds(Set<UUID> externalIds) {
    return (root, query, cb) ->
        root.get(SequencedBaseEntityWithExternalId_.externalId).in(externalIds);
  }

  @Override
  @Transactional(readOnly = true)
  public GetRelevantArchivableProceduresResponse getRelevantArchivableProcedures(
      GetRelevantArchivableProceduresFilterOptions filterOptions,
      GetRelevantArchivableProceduresSortOptions sortOptions,
      GetProceduresPaginationOptions paginationOptions) {
    Page<ProcedureT> procedurePage =
        procedureRepository.findAll(
            where(archivingRelevanceRelevant())
                .and(closedAtDay(filterOptions.closedAtDay()))
                .and(exported(filterOptions.exported())),
            ofSize(paginationOptions.pageSize())
                .withPage(paginationOptions.pageNumber())
                .withSort(mapToSort(sortOptions)));

    int fileSizeBytes =
        procedureRepository.sumFileSizeBytesOrZero(
            procedurePage.stream()
                .map(EntityWithExternalId::getExternalId)
                .collect(Collectors.toSet()));

    return new GetRelevantArchivableProceduresResponse(
        procedurePage.getTotalPages(),
        procedurePage.getTotalElements(),
        procedurePage.stream().map(enrichingMapper::enrichAndMap).toList(),
        fileSizeBytes);
  }

  private Specification<ProcedureT> archivingRelevanceRelevant() {
    return (root, query, cb) -> cb.equal(root.get(archivingRelevance), ArchivingRelevance.RELEVANT);
  }

  private Sort mapToSort(GetRelevantArchivableProceduresSortOptions sortOptions) {
    return Sort.by(
        Order.by(mapToDomainProperty(sortOptions.sortBy()))
            .with(mapToSortOrder(sortOptions.sortOrder())),
        Order.by(ID));
  }

  private Direction mapToSortOrder(GetRelevantArchivableProceduresSortOrderDto sortOrder) {
    return switch (sortOrder) {
      case ASC -> Direction.ASC;
      case DESC -> Direction.DESC;
    };
  }

  private String mapToDomainProperty(GetRelevantArchivableProceduresSortByDto sortBy) {
    return switch (sortBy) {
      case CLOSED_AT -> CLOSED_AT;
      case EXPORTED_AT -> EXPORTED_AT;
    };
  }

  @Override
  @Transactional
  public ResponseEntity<byte[]> exportRelevantProcedures(
      ExportArchivingRelevantProceduresRequest request) {
    List<ProcedureT> procedures =
        procedureRepository.findAll(
            where(archivingRelevanceRelevant()).and(externalIds(request.procedures())),
            Sort.by(Direction.ASC, CLOSED_AT, ID));

    Instant now = Instant.now(clock);

    for (ProcedureT procedure : procedures) {
      procedure.setExportedAt(now);
    }

    return ResponseEntity.ok()
        .contentType(CustomMediaTypes.ZIP)
        .header(CONTENT_DISPOSITION, getContentDisposition(now).toString())
        .body(serializationService.toNestedZip(ARCHIVE_EXPORT_ZIP_ENTRY_NAME_TEMPLATE, procedures));
  }

  private ContentDisposition getContentDisposition(Instant now) {
    String fileName =
        ARCHIVE_EXPORT_FILE_NAME_TEMPLATE.formatted(
            LocalDateTime.ofInstant(now, clock.getZone())
                .format(ARCHIVE_EXPORT_DATE_TIME_FORMATTER));

    return ContentDisposition.attachment()
        .name(CONTENT_DISPOSITION_NAME_ZIP)
        .filename(fileName, StandardCharsets.UTF_8)
        .build();
  }

  @Override
  @Transactional(readOnly = true)
  public GetArchivingConfigurationResponse getArchivingConfiguration() {
    return new GetArchivingConfigurationResponse(
        archivingProperties.getGracePeriodMonths(), getArchivingProperties());
  }

  private Map<ProcedureTypeDto, ArchivingDetailsDto> getArchivingProperties() {
    return Arrays.stream(ProcedureType.values())
        .collect(
            StreamUtil.toLinkedHashMap(
                ProcedureMapper::toInterfaceType, this::getArchivingDetails));
  }

  private ArchivingDetailsDto getArchivingDetails(ProcedureType procedureType) {
    return new ArchivingDetailsDto(
        ProcedureMapper.toInterfaceType(
            archivingProperties.getDefaultArchivingRelevanceOrElseFallback(procedureType)),
        archivingProperties.getDefaultArchivingPeriodOrElseDefault(procedureType).getYears());
  }
}
