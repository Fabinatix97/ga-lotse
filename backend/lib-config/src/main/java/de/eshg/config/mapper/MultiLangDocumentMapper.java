/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.mapper;

import de.eshg.base.department.LanguageDto;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.api.DocumentDetailsDto;
import de.eshg.config.api.MultiLangDocumentDto;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.config.i18n.MultiLangFileName;
import de.eshg.rest.service.i18n.Language;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public class MultiLangDocumentMapper {

  public static MultiLangDocumentDto mapToDto(
      MultiLangDocument multiLangDocument, MultiLangFileName multiLangFileName) {
    if (multiLangDocument == null) {
      return null;
    }
    return new MultiLangDocumentDto(
        mapToDto(multiLangFileName.de(), multiLangDocument.getDeFileSizeBytes()),
        mapToDto(multiLangFileName.en(), multiLangDocument.getEnFileSizeBytes()));
  }

  private static DocumentDetailsDto mapToDto(String fileName, Integer fileSize) {
    if (fileSize == null) {
      return null;
    }

    return new DocumentDetailsDto(fileName, fileSize);
  }

  public static Language mapToDomain(LanguageDto languageDto) {
    return switch (languageDto) {
      case GERMAN -> Language.GERMAN;
      case ENGLISH -> Language.ENGLISH;
    };
  }

  public static MultiLangDocument mapToDomain(MultipartFile de, MultipartFile en)
      throws IOException {
    if (de == null) {
      return null;
    }

    MultiLangDocument multiLangDocument = new MultiLangDocument();
    multiLangDocument.updateDe(de.getBytes());
    if (en != null) {
      multiLangDocument.updateEn(en.getBytes());
    }
    return multiLangDocument;
  }

  public static ConfigurationStatus mapToConfigurationStatus(MultiLangDocument multiLangDocument) {
    if (multiLangDocument.getEn() == null) {
      return ConfigurationStatus.PARTIALLY_COMPLETE;
    } else {
      return ConfigurationStatus.COMPLETE;
    }
  }
}
