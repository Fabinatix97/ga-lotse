/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.centralrepository.service;

import de.eshg.centralrepository.mapper.VersionedEntryMapper;
import de.eshg.centralrepository.persistence.entity.IdVersionPK;
import de.eshg.centralrepository.persistence.entity.VersionedEntryContent;
import de.eshg.centralrepository.persistence.entity.VersionedEntryMetadata;
import de.eshg.centralrepository.persistence.repository.VersionedEntryContentRepository;
import de.eshg.centralrepository.persistence.repository.VersionedEntryMetadataRepository;
import de.eshg.lib.centralrepository.api.ContentRequestDto;
import de.eshg.lib.centralrepository.api.MetadataRequestDto;
import de.eshg.lib.centralrepository.api.MetadataResponseDto;
import de.eshg.lib.centralrepository.api.VersionFilterType;
import de.eshg.lib.servicedirectory.ServiceDirectoryApi;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class VersionedEntryService {
  private static final Logger log = LoggerFactory.getLogger(VersionedEntryService.class);

  private final VersionedEntryMetadataRepository metadataRepo;

  private final VersionedEntryContentRepository contentRepo;

  private final ServiceDirectoryApi serviceDirectoryApi;

  private final Clock clock;

  public VersionedEntryService(
      VersionedEntryMetadataRepository metadataRepo,
      VersionedEntryContentRepository contentRepo,
      ServiceDirectoryApi serviceDirectoryApi,
      Clock clock) {
    this.metadataRepo = metadataRepo;
    this.contentRepo = contentRepo;
    this.serviceDirectoryApi = serviceDirectoryApi;
    this.clock = clock;
  }

  @Transactional(readOnly = true)
  public void transferContentTo(IdVersionPK pk, OutputStream outputStream) {
    VersionedEntryContent content = contentRepo.findFirstByMetadataPk(pk);

    try {
      if (content.getContentJson() != null) {
        try (OutputStreamWriter writer =
            new OutputStreamWriter(outputStream, StandardCharsets.UTF_8)) {
          writer.write(content.getContentJson());
        }
      } else {
        Blob blob = content.getContentBinary();
        blob.getBinaryStream().transferTo(outputStream);
      }
    } catch (SQLException | IOException e) {
      throw new IllegalStateException(e);
    }
  }

  @Transactional(readOnly = true)
  public MetadataResponseDto getMetadata(String moduleName, String objectName, IdVersionPK pk) {
    return VersionedEntryMapper.mapToApi(getMetadataDomain(moduleName, objectName, pk));
  }

  @Transactional(readOnly = true)
  public String getContentType(String moduleName, String objectName, IdVersionPK pk) {
    return getMetadataDomain(moduleName, objectName, pk).getContentType();
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

  @Transactional(readOnly = true)
  public List<MetadataResponseDto> getMetadataOfVersions(
      String moduleName,
      String objectName,
      VersionFilterType versions,
      String tags,
      String category,
      boolean deleted) {
    List<VersionedEntryMetadata> result;

    if (VersionFilterType.NEWEST.equals(versions)) {
      result = metadataRepo.findOnlyNewestBy(moduleName, objectName, category, tags, deleted);
    } else {
      result = metadataRepo.findAllBy(moduleName, objectName, category, tags, deleted);
    }

    return VersionedEntryMapper.mapToApi(result);
  }

  @Transactional(readOnly = true)
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

  @Transactional
  public MetadataResponseDto createEntry(
      String moduleName,
      String objectName,
      MetadataRequestDto metaDataRequestDto,
      ContentRequestDto contentRequestDto) {
    IdVersionPK idVersionPK = new IdVersionPK(metadataRepo.getNextPkId(), 1);
    VersionedEntryMetadata metadata = VersionedEntryMapper.mapToDomain(metaDataRequestDto);

    metadata.setPk(idVersionPK);
    metadata.setModuleName(moduleName);
    metadata.setObjectName(objectName);
    setCreatedFields(metadata);

    VersionedEntryContent content = createContent(contentRequestDto, metadata);
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
      ContentRequestDto contentRequestDto, VersionedEntryMetadata metadata) {
    VersionedEntryContent content = new VersionedEntryContent();
    content.setMetadata(metadata);

    metadata.setContentType(contentRequestDto.contentType());
    if (MediaType.APPLICATION_JSON_VALUE.equals(contentRequestDto.contentType())) {
      content.setContentJson(contentRequestDto.jsonContent());
    } else {
      content.setContentBinary(contentRequestDto.blobContent());
    }
    return content;
  }

  @Transactional
  public MetadataResponseDto createNewVersionOfEntry(
      String moduleName,
      String objectName,
      Long id,
      Integer basedOnVersion,
      MetadataRequestDto metaDataRequestDto,
      ContentRequestDto contentRequestDto) {
    // verify non-deleted basedOnVersion with the specified module and object name exists
    getMetadataDomain(moduleName, objectName, new IdVersionPK(id, basedOnVersion));

    // verify that basedOnVersion is the newest non-deleted one
    IdVersionPK newPk = getNextVersionAndVerifyIsLegalBase(id, basedOnVersion);

    VersionedEntryMetadata newMetadata = new VersionedEntryMetadata();
    setCreatedFields(newMetadata);
    newMetadata.setPk(newPk);
    newMetadata.setModuleName(moduleName);
    newMetadata.setObjectName(objectName);
    newMetadata.setContentType(contentRequestDto.contentType());
    VersionedEntryMapper.setDomainFromApi(newMetadata, metaDataRequestDto);

    VersionedEntryContent newContent = createContent(contentRequestDto, newMetadata);
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

  @Transactional
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

  @Transactional
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

  @Transactional
  public void setOneVersionOfAnEntryAsDeleted(
      String moduleName, String objectName, Long id, Integer version) {
    setAsDeleted(moduleName, objectName, id, version);
  }
}
