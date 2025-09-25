/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.centralrepository.controller;

import de.eshg.centralrepository.exception.CentralRepositoryIOException;
import de.eshg.centralrepository.persistence.entity.IdVersionPK;
import de.eshg.centralrepository.service.VersionedEntryService;
import de.eshg.centralrepository.service.VersionedEntryService.GetContentResponse;
import de.eshg.lib.centralrepository.CentralRepositoryApi;
import de.eshg.lib.centralrepository.api.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "CentralRepository")
public class CentralRepositoryController implements CentralRepositoryApi {

  private final VersionedEntryService versionedEntryService;

  public CentralRepositoryController(VersionedEntryService versionedEntryService) {
    this.versionedEntryService = versionedEntryService;
  }

  @Override
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getContentOfOneVersion(
      String moduleName, String objectName, Long id, Integer version) {
    IdVersionPK pk = new IdVersionPK(id, version);
    GetContentResponse resp = versionedEntryService.getContent(moduleName, objectName, pk);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.parseMediaType(resp.contentType()));
    headers.setContentLength(resp.contentLength());

    return new ResponseEntity<>(resp.resource(), headers, HttpStatus.OK);
  }

  @Override
  @Transactional(readOnly = true)
  public MetadataResponseDto getMetadataOfOneVersion(
      String moduleName, String objectName, Long id, Integer version) {
    IdVersionPK pk = new IdVersionPK(id, version);
    return versionedEntryService.getMetadata(moduleName, objectName, pk);
  }

  @Override
  @Transactional(readOnly = true)
  public MetadataListResponseDto getMetadataOfVersionsWithId(
      String moduleName, String objectName, Long id, VersionFilterType versions, boolean deleted) {
    return new MetadataListResponseDto(
        versionedEntryService.getMetadataOfVersionsWithId(
            moduleName, objectName, id, versions, deleted));
  }

  @Override
  @Transactional(readOnly = true)
  public MetadataListResponseDto getMetadataOfVersionsWithModuleAndObjectName(
      String moduleName,
      String objectName,
      VersionFilterType versions,
      Boolean deleted,
      String tags,
      String category) {
    return new MetadataListResponseDto(
        versionedEntryService.getMetadataOfVersions(
            moduleName, objectName, versions, tags, category, deleted != null && deleted));
  }

  @Override
  @Transactional
  public MetadataResponseDto createEntry(
      String moduleName,
      String objectName,
      MetadataRequestDto metadata,
      String mediaType,
      long contentLength,
      InputStreamResource file) {
    try {
      return versionedEntryService.createEntry(
          moduleName, objectName, metadata, mediaType, contentLength, file);
    } catch (IOException e) {
      throw new CentralRepositoryIOException();
    }
  }

  @Override
  @Transactional
  public MetadataResponseDto createNewVersionForEntry(
      String moduleName,
      String objectName,
      Long id,
      Integer basedOnVersion,
      MetadataRequestDto metadata,
      String mediaType,
      long contentLength,
      InputStreamResource file) {
    try {
      return versionedEntryService.createNewVersionOfEntry(
          moduleName, objectName, id, basedOnVersion, metadata, mediaType, contentLength, file);
    } catch (IOException e) {
      throw new CentralRepositoryIOException();
    }
  }

  @Override
  @Transactional
  public MetadataResponseDto createNewVersionOnlyChangeMetadataForEntry(
      String moduleName,
      String objectName,
      Long id,
      Integer basedOnVersion,
      MetadataRequestDto metadata) {
    return versionedEntryService.createNewVersionOnlyChangingMetadataOfEntry(
        moduleName, objectName, id, basedOnVersion, metadata);
  }

  @Override
  @Transactional
  public void setEntryAsDeleted(String moduleName, String objectName, Long id) {
    versionedEntryService.setEntryAsDeleted(moduleName, objectName, id);
  }

  @Override
  @Transactional
  public void setOneVersionOfAnEntryAsDeleted(
      String moduleName, String objectName, Long id, Integer version) {
    versionedEntryService.setOneVersionOfAnEntryAsDeleted(moduleName, objectName, id, version);
  }
}
