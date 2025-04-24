/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.mapper;

import de.eshg.base.department.LanguageDto;
import de.eshg.config.api.DocumentDto;
import de.eshg.config.api.PrivacyDocumentDto;
import de.eshg.config.departmentinfo.PrivacyDocumentHelper;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.rest.service.i18n.Language;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public class MultiLangDocumentMapper {
  public static PrivacyDocumentDto mapToPrivacyPolicyDto(MultiLangDocument multiLangDocument) {
    return mapToPrivacyDto(
        multiLangDocument,
        PrivacyDocumentHelper.PRIVACY_POLICY_DE_PDF_FILENAME,
        PrivacyDocumentHelper.PRIVACY_POLICY_EN_PDF_FILENAME);
  }

  public static PrivacyDocumentDto mapToPrivacyNoticeDto(MultiLangDocument multiLangDocument) {
    return mapToPrivacyDto(
        multiLangDocument,
        PrivacyDocumentHelper.PRIVACY_NOTICE_DE_PDF_FILENAME,
        PrivacyDocumentHelper.PRIVACY_NOTICE_EN_PDF_FILENAME);
  }

  private static PrivacyDocumentDto mapToPrivacyDto(
      MultiLangDocument multiLangDocument, String deFilename, String enFilename) {
    if (multiLangDocument == null) {
      return null;
    }
    return new PrivacyDocumentDto(
        mapToDto(deFilename, multiLangDocument.getDeFileSizeBytes()),
        mapToDto(enFilename, multiLangDocument.getEnFileSizeBytes()));
  }

  private static DocumentDto mapToDto(String fileName, Integer fileSize) {
    if (fileSize == null) {
      return null;
    }

    return new DocumentDto(fileName, fileSize);
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
}
