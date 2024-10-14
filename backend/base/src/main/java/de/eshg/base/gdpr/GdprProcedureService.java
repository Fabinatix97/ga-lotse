/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import de.eshg.base.gdpr.persistence.GdprDownload;
import de.eshg.base.gdpr.persistence.GdprProcedure;
import de.eshg.base.gdpr.persistence.GdprProcedureStatus;
import de.eshg.base.gdpr.persistence.GdprProcedureType;
import de.eshg.base.gdpr.persistence.GdprProcedure_;
import de.eshg.base.gdpr.persistence.repository.GdprProcedureRepository;
import de.eshg.base.util.PaginationUtil;
import de.eshg.rest.service.error.AlreadyExistsException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.validation.ValidationUtil;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Supplier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class GdprProcedureService {
  private static final Logger log = LoggerFactory.getLogger(GdprProcedureService.class);
  private final GdprProcedureRepository repository;
  private final GdprDownloadRepository downloadRepository;

  private static Specification<GdprProcedure> hasType(GdprProcedureType type) {
    if (type == null) {
      return (root, query, builder) -> builder.and();
    }
    return (root, query, cb) -> cb.equal(root.get(GdprProcedure_.type), type);
  }

  public GdprProcedureService(
      GdprProcedureRepository procedureRepository, GdprDownloadRepository downloadRepository) {
    this.repository = procedureRepository;
    this.downloadRepository = downloadRepository;
  }

  public GdprProcedure add(GdprProcedure procedure) {
    procedure.setStatus(GdprProcedureStatus.DRAFT);
    return repository.save(procedure);
  }

  public Optional<GdprProcedure> findByExternalId(UUID id) {
    return repository.findByExternalId(id);
  }

  public Page<GdprProcedure> findAll(
      GdprProcedureType gdprProcedureType, PaginationUtil.PageSpec pageSpec) {
    Specification<GdprProcedure> specification = Specification.allOf(hasType(gdprProcedureType));

    return repository.findAll(
        specification,
        PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize(), Sort.by(pageSpec.order())));
  }

  public GdprProcedure addCentralFileIdToGdprProcedure(
      UUID centralFileId, UUID gdprProcedureId, long version) {
    GdprProcedure storedGdprProcedure = getGdprProcedureForUpdate(gdprProcedureId);
    ValidationUtil.validateVersion(version, storedGdprProcedure);

    storedGdprProcedure.setCentralFileId(centralFileId);

    return getGdprProcedure(gdprProcedureId);
  }

  private GdprProcedure getGdprProcedure(UUID gdprProcedureId) {
    return repository.findByExternalId(gdprProcedureId).orElseThrow(notFound(gdprProcedureId));
  }

  public GdprProcedure getGdprProcedureForUpdate(UUID gdprProcedureId) {
    return repository
        .findByExternalIdForUpdate(gdprProcedureId)
        .orElseThrow(notFound(gdprProcedureId));
  }

  private static Supplier<NotFoundException> notFound(UUID id) {
    return () -> new NotFoundException("GdprProcedure with id '%s' not found.".formatted(id));
  }

  public void addGdprDownloads(UUID id, @NotNull Set<UUID> downloadIdsToAdd) {
    log.info("Adding downloadIds={} to GdprProcedure(id={})", downloadIdsToAdd, id);
    GdprProcedure procedure = getGdprProcedureForUpdate(id);
    List<UUID> existingDownloads = downloadRepository.findExistingDownloadIds(downloadIdsToAdd);

    if (!existingDownloads.isEmpty()) {
      throw new AlreadyExistsException(
          "Download ids %s already exist.".formatted(existingDownloads));
    }

    for (UUID uuid : downloadIdsToAdd) {
      GdprDownload download = new GdprDownload();
      download.setDownloadId(uuid);
      procedure.addDownload(download);
    }

    log.info("Added downloadIds={} to GdprProcedure(id={})", downloadIdsToAdd, id);
  }
}
