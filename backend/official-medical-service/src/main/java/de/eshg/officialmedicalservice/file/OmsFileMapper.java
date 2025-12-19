/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.file;

import de.eshg.officialmedicalservice.file.api.OmsFileDto;
import de.eshg.officialmedicalservice.file.persistence.entity.OmsFile;
import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class OmsFileMapper {

  public List<OmsFileDto> toInterfaceType(List<OmsFile> files) {
    if (files == null) {
      return Collections.emptyList();
    }
    return files.stream()
        .sorted((file1, file2) -> file1.getFileName().compareToIgnoreCase(file2.getFileName()))
        .map(this::toInterfaceType)
        .toList();
  }

  public OmsFileDto toInterfaceType(OmsFile file) {
    if (file == null) {
      return null;
    }
    return new OmsFileDto(
        file.getExternalId(),
        file.getFileName(),
        file.getFileType(),
        file.getContent().length,
        file.getCreatedDate());
  }
}
