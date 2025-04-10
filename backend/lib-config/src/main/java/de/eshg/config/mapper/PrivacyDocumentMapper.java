/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.mapper;

import de.eshg.config.api.DocumentDto;
import de.eshg.config.api.PrivacyDocumentDto;
import de.eshg.config.departmentinfo.PrivacyDocumentHelper;
import de.eshg.config.domain.PrivacyDocument;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public class PrivacyDocumentMapper {
  public static PrivacyDocumentDto mapToPrivacyPolicyDto(PrivacyDocument privacyDocument) {
    return mapToDto(
        privacyDocument,
        PrivacyDocumentHelper.PRIVACY_POLICY_DE_PDF_FILENAME,
        PrivacyDocumentHelper.PRIVACY_POLICY_EN_PDF_FILENAME);
  }

  public static PrivacyDocumentDto mapToPrivacyNoticeDto(PrivacyDocument privacyDocument) {
    return mapToDto(
        privacyDocument,
        PrivacyDocumentHelper.PRIVACY_NOTICE_DE_PDF_FILENAME,
        PrivacyDocumentHelper.PRIVACY_NOTICE_EN_PDF_FILENAME);
  }

  private static PrivacyDocumentDto mapToDto(
      PrivacyDocument privacyDocument, String deFilename, String enFilename) {
    if (privacyDocument == null) {
      return null;
    }
    return new PrivacyDocumentDto(
        mapToDto(deFilename, privacyDocument.getDeFileSizeBytes()),
        mapToDto(enFilename, privacyDocument.getEnFileSizeBytes()));
  }

  private static DocumentDto mapToDto(String fileName, Integer fileSize) {
    if (fileSize == null) {
      return null;
    }

    return new DocumentDto(fileName, fileSize);
  }

  public static PrivacyDocument mapToDomain(MultipartFile de, MultipartFile en) throws IOException {
    if (de == null) {
      return null;
    }

    PrivacyDocument privacyDocument = new PrivacyDocument();
    privacyDocument.updateDe(de.getBytes());
    if (en != null) {
      privacyDocument.updateEn(en.getBytes());
    }
    return privacyDocument;
  }
}
