/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.centralrepository.mapper;

import de.eshg.centralrepository.persistence.entity.VersionedEntryMetadata;
import de.eshg.lib.centralrepository.api.MetadataRequestDto;
import de.eshg.lib.centralrepository.api.MetadataResponseDto;
import java.util.List;

public class VersionedEntryMapper {

  private VersionedEntryMapper() {}

  public static List<MetadataResponseDto> mapToApi(List<VersionedEntryMetadata> metadataList) {
    return metadataList.stream().map(VersionedEntryMapper::mapToApi).toList();
  }

  public static MetadataResponseDto mapToApi(VersionedEntryMetadata entity) {
    return new MetadataResponseDto(
        entity.getPk().id(),
        entity.getPk().version(),
        entity.getModuleName(),
        entity.getObjectName(),
        entity.getCategory(),
        entity.getName(),
        entity.getTags(),
        entity.getDescription(),
        entity.getChangeLog(),
        entity.getContact(),
        entity.getCreatedBy(),
        entity.getCreatedAt(),
        entity.getDeletedBy(),
        entity.getDeletedAt(),
        entity.getContentType());
  }

  public static VersionedEntryMetadata mapToDomain(MetadataRequestDto dto) {
    VersionedEntryMetadata result = new VersionedEntryMetadata();
    setDomainFromApi(result, dto);
    return result;
  }

  public static void setDomainFromApi(VersionedEntryMetadata result, MetadataRequestDto dto) {
    result.setCategory(dto.category());
    result.setName(dto.name());
    result.setTags(dto.tags());
    result.setDescription(dto.description());
    result.setChangeLog(dto.changeLog());
    result.setContact(dto.contact());
  }
}
