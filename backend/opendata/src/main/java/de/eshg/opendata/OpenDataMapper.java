/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata;

import de.eshg.file.common.FileType;
import de.eshg.opendata.api.ResourceDto;
import de.eshg.opendata.api.VersionDto;
import de.eshg.opendata.domain.model.OpenDataFileType;
import de.eshg.opendata.domain.model.Resource;
import de.eshg.opendata.domain.model.Version;
import de.eshg.rest.service.error.BadRequestException;
import java.util.LinkedHashSet;
import java.util.List;

class OpenDataMapper {

  private OpenDataMapper() {}

  static ResourceDto toInterfaceType(Resource resource) {
    return new ResourceDto(resource.getResourceName(), toInterfaceType(resource.getVersions()));
  }

  private static VersionDto toInterfaceType(Version version) {
    return new VersionDto(
        version.getVersionName(),
        version.getVersion(),
        version.getExternalId(),
        version.getMajor(),
        version.getMinor(),
        version.getPublicationDate(),
        version.getStatisticStartDate(),
        version.getStatisticEndDate(),
        new LinkedHashSet<>(version.getSources()),
        version.getAuthor(),
        version.getDescription(),
        version.getFileType(),
        version.getFileName(),
        version.getFileSize(),
        version.getLicence());
  }

  static ResourceDto toInterfaceWithVersions(Resource resource, List<Version> version) {
    return new ResourceDto(resource.getResourceName(), toInterfaceType(version));
  }

  private static List<VersionDto> toInterfaceType(List<Version> versions) {
    return versions.stream().map(OpenDataMapper::toInterfaceType).toList();
  }

  public static OpenDataFileType mapToOpenDataFileType(FileType fileType) {
    return switch (fileType) {
      case PDF -> OpenDataFileType.PDF;
      case CSV -> OpenDataFileType.CSV;
      default -> throw new BadRequestException("File type not permitted");
    };
  }
}
