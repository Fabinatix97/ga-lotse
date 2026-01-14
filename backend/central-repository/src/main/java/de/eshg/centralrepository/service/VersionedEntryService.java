/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.centralrepository.service;

import de.eshg.centralrepository.mapper.VersionedEntryMapper;
import de.eshg.centralrepository.persistence.entity.IdVersionPK;
import de.eshg.centralrepository.persistence.entity.VersionedEntryContent;
import de.eshg.centralrepository.persistence.entity.VersionedEntryMetadata;
import de.eshg.centralrepository.persistence.repository.VersionedEntryContentRepository;
import de.eshg.centralrepository.persistence.repository.VersionedEntryMetadataRepository;
import de.eshg.lib.centralrepository.api.MetadataRequestDto;
import de.eshg.lib.centralrepository.api.MetadataResponseDto;
import de.eshg.lib.centralrepository.api.VersionFilterType;
import de.eshg.lib.servicedirectory.ServiceDirectoryApi;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.engine.jdbc.BlobProxy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class VersionedEntryService {
  private static final Logger log = LoggerFactory.getLogger(VersionedEntryService.class);

  private final VersionedEntryMetadataRepository metadataRepo;
  private final VersionedEntryContentRepository contentRepo;
  private final ServiceDirectoryApi serviceDirectoryApi;
  private final PlatformTransactionManager transactionManager;
  private final Clock clock;

  public VersionedEntryService(
      VersionedEntryMetadataRepository metadataRepo,
      VersionedEntryContentRepository contentRepo,
      ServiceDirectoryApi serviceDirectoryApi,
      PlatformTransactionManager transactionManager,
      Clock clock) {
    this.metadataRepo = metadataRepo;
    this.contentRepo = contentRepo;
    this.serviceDirectoryApi = serviceDirectoryApi;
    this.transactionManager = transactionManager;
    this.clock = clock;
  }

  public record GetContentResponse(long contentLength, String contentType, Resource resource) {}

  public GetContentResponse getContent(String moduleName, String objectName, IdVersionPK pk) {
    VersionedEntryMetadata metadataDomain = getMetadataDomain(moduleName, objectName, pk);
    String contentType = metadataDomain.getContentType();
    VersionedEntryContent content = contentRepo.findFirstByMetadataPk(pk);

    if (content.getContentJson() != null) {
      byte[] bytes = content.getContentJson().getBytes(StandardCharsets.UTF_8);
      int contentLength = bytes.length;
      ByteArrayResource resource = new ByteArrayResource(bytes);
      return new GetContentResponse(contentLength, contentType, resource);
    } else if (content.getContentBinary() != null) {
      Blob blob = content.getContentBinary();
      long contentLength = content.getContentBinaryLength();
      BlobInputStreamResource resource = new BlobInputStreamResource(transactionManager, blob);
      return new GetContentResponse(contentLength, contentType, resource);
    } else {
      throw new IllegalStateException("both contentJson and contentBinary are null");
    }
  }

  public MetadataResponseDto getMetadata(String moduleName, String objectName, IdVersionPK pk) {
    return VersionedEntryMapper.mapToApi(getMetadataDomain(moduleName, objectName, pk));
  }

  private VersionedEntryMetadata getMetadataDomain(
      String moduleName, String objectName, IdVersionPK pk) {
    VersionedEntryMetadata metadata = metadataRepo.findFirstByPk(pk);
    verifyMetadata(metadata, moduleName, objectName);
    return metadata;
  }

  private static void verifyMetadata(
      VersionedEntryMetadata metadata, String moduleName, String objectName) {
    if (metadata == null) {
      throw new NotFoundException("there is no entry with this id and version");
    }

    List<String> reasons = new ArrayList<>();
    if (!metadata.getModuleName().equals(moduleName)) {
      reasons.add("the moduleName does not match");
    }
    if (!metadata.getObjectName().equals(objectName)) {
      reasons.add("the objectName does not match");
    }
    if (metadata.isDeleted()) {
      reasons.add("it was already set as deleted");
    }

    if (!reasons.isEmpty()) {
      throw new BadRequestException("there is an entry but " + String.join(" and ", reasons));
    }
  }

  public List<MetadataResponseDto> getMetadataOfVersions(
      String moduleName,
      String objectName,
      VersionFilterType versions,
      String tags,
      String category,
      boolean deleted) {
    if (objectName.equals("*")) {
      objectName = null; // null values will be ignored in the query
    }

    List<VersionedEntryMetadata> result;

    if (VersionFilterType.NEWEST.equals(versions)) {
      result = metadataRepo.findOnlyNewestBy(moduleName, objectName, category, tags, deleted);
    } else {
      result = metadataRepo.findAllBy(moduleName, objectName, category, tags, deleted);
    }

    return VersionedEntryMapper.mapToApi(result);
  }

  public List<MetadataResponseDto> getMetadataOfVersionsWithId(
      String moduleName, String objectName, Long id, VersionFilterType versions, boolean deleted) {
    List<VersionedEntryMetadata> result;

    if (VersionFilterType.NEWEST.equals(versions)) {
      VersionedEntryMetadata r =
          metadataRepo.findFirstByDeletedAndModuleNameAndObjectNameAndPkIdOrderByPkVersionDesc(
              deleted, moduleName, objectName, id);
      result = r == null ? List.of() : List.of(r);
    } else {
      result =
          metadataRepo.findAllByDeletedAndModuleNameAndObjectNameAndPkId(
              deleted, moduleName, objectName, id);
    }

    return VersionedEntryMapper.mapToApi(result);
  }

  public MetadataResponseDto createEntry(
      String moduleName,
      String objectName,
      MetadataRequestDto metaDataRequestDto,
      String mediaType,
      long size,
      InputStreamResource file)
      throws IOException {
    IdVersionPK idVersionPK = new IdVersionPK(metadataRepo.getNextPkId(), 1);
    VersionedEntryMetadata metadata = VersionedEntryMapper.mapToDomain(metaDataRequestDto);

    metadata.setPk(idVersionPK);
    metadata.setModuleName(moduleName);
    metadata.setObjectName(objectName);
    setCreatedFields(metadata);

    VersionedEntryContent content = createContent(file, mediaType, size, metadata);
    VersionedEntryContent savedEntry = contentRepo.save(content);
    return VersionedEntryMapper.mapToApi(savedEntry.getMetadata());
  }

  private void setCreatedFields(VersionedEntryMetadata versionedEntryMetadata) {
    versionedEntryMetadata.setCreatedAt(Instant.now(clock));
    versionedEntryMetadata.setCreatedBy(getNaturalId());
  }

  private String getNaturalId() {
    String commonName = SecurityContextHolder.getContext().getAuthentication().getName();

    return getNaturalIdByCommonName(commonName);
  }

  private String getNaturalIdByCommonName(String commonName) {
    try {
      return serviceDirectoryApi.getNaturalIdByCommonName(commonName);
    } catch (HttpClientErrorException.NotFound e) {
      log.warn("could not find actor with common name: {}", commonName);
      return "unknown CN: " + commonName;
    }
  }

  private static VersionedEntryContent createContent(
      InputStreamResource file, String mediaType, long size, VersionedEntryMetadata metadata)
      throws IOException {
    VersionedEntryContent content = new VersionedEntryContent();
    content.setMetadata(metadata);

    metadata.setContentType(mediaType);

    if (MediaType.APPLICATION_JSON_VALUE.equals(mediaType)) {
      String json = new String(file.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
      content.setContentJson(json);
    } else {
      Blob blob = BlobProxy.generateProxy(file.getInputStream(), size);
      content.setContentBinary(blob);
    }
    return content;
  }

  public MetadataResponseDto createNewVersionOfEntry(
      String moduleName,
      String objectName,
      Long id,
      Integer basedOnVersion,
      MetadataRequestDto metaDataRequestDto,
      String mediaType,
      long size,
      InputStreamResource file)
      throws IOException {
    // verify non-deleted basedOnVersion with the specified module and object name exists
    getMetadataDomain(moduleName, objectName, new IdVersionPK(id, basedOnVersion));

    // verify that basedOnVersion is the newest non-deleted one
    IdVersionPK newPk = getNextVersionAndVerifyIsLegalBase(id, basedOnVersion);

    VersionedEntryMetadata newMetadata = new VersionedEntryMetadata();
    setCreatedFields(newMetadata);
    newMetadata.setPk(newPk);
    newMetadata.setModuleName(moduleName);
    newMetadata.setObjectName(objectName);
    newMetadata.setContentType(mediaType);
    VersionedEntryMapper.setDomainFromApi(newMetadata, metaDataRequestDto);

    VersionedEntryContent newContent = createContent(file, mediaType, size, newMetadata);
    VersionedEntryContent newContentFromDb = contentRepo.save(newContent);
    return VersionedEntryMapper.mapToApi(newContentFromDb.getMetadata());
  }

  private IdVersionPK getNextVersionAndVerifyIsLegalBase(Long id, int basedOnVersion) {
    int newestDeletedVersion = metadataRepo.getLastPkVersionDeleted(id);
    int newestNonDeletedVersion = metadataRepo.getLastPkVersionNotDeleted(id);

    if (newestNonDeletedVersion != basedOnVersion) {
      throw new DataIntegrityViolationException("a newer version for that entry already exists.");
    } else if (newestDeletedVersion > basedOnVersion) {
      return new IdVersionPK(id, newestDeletedVersion + 1);
    }

    return new IdVersionPK(id, basedOnVersion + 1);
  }

  public MetadataResponseDto createNewVersionOnlyChangingMetadataOfEntry(
      String moduleName,
      String objectName,
      Long id,
      Integer basedOnVersion,
      MetadataRequestDto metaDataRequestDto) {
    // verify non-deleted basedOnVersion with the specified module and object name exists
    VersionedEntryContent baseContent =
        getContentDomain(moduleName, objectName, new IdVersionPK(id, basedOnVersion));

    // verify that base is the newest non-deleted one
    IdVersionPK newPk = getNextVersionAndVerifyIsLegalBase(id, basedOnVersion);

    VersionedEntryMetadata newMetadata = new VersionedEntryMetadata();
    setCreatedFields(newMetadata);
    newMetadata.setPk(newPk);
    newMetadata.setModuleName(moduleName);
    newMetadata.setObjectName(objectName);
    newMetadata.setContentType(baseContent.getMetadata().getContentType());
    VersionedEntryMapper.setDomainFromApi(newMetadata, metaDataRequestDto);

    VersionedEntryContent newContent = createContent(baseContent, newMetadata);
    VersionedEntryContent newContentFromDb = contentRepo.save(newContent);
    return VersionedEntryMapper.mapToApi(newContentFromDb.getMetadata());
  }

  private static VersionedEntryContent createContent(
      VersionedEntryContent baseContent, VersionedEntryMetadata newMetaData) {
    VersionedEntryContent newContent = new VersionedEntryContent();
    newContent.setMetadata(newMetaData);
    if (baseContent.getContentJson() != null) {
      newContent.setContentJson(baseContent.getContentJson());
    } else {
      newContent.setContentBinary(baseContent.getContentBinary());
    }
    return newContent;
  }

  private VersionedEntryContent getContentDomain(
      String moduleName, String objectName, IdVersionPK pk) {
    VersionedEntryContent content = contentRepo.findFirstByMetadataPk(pk);
    verifyMetadata(content.getMetadata(), moduleName, objectName);
    return content;
  }

  public void setEntryAsDeleted(String moduleName, String objectName, Long id) {
    setAsDeleted(moduleName, objectName, id, null);
  }

  private void setAsDeleted(String moduleName, String objectName, Long id, Integer version) {
    int numDeleted =
        metadataRepo.setAsDeletedByPk(
            moduleName, objectName, id, version, Instant.now(clock), getNaturalId());

    if (numDeleted == 0) {
      throw new BadRequestException(
          "nothing deleted - names didn't match or was already set as deleted");
    }
  }

  public void setOneVersionOfAnEntryAsDeleted(
      String moduleName, String objectName, Long id, Integer version) {
    setAsDeleted(moduleName, objectName, id, version);
  }
}
