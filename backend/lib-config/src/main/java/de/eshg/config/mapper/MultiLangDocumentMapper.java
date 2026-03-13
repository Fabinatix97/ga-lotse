/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.mapper;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.api.DocumentDetailsDto;
import de.eshg.config.api.MultiLangDocumentDto;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.config.i18n.MultiLangFileName;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.i18n.Language;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.springframework.web.multipart.MultipartFile;

public class MultiLangDocumentMapper {

  public static MultiLangDocumentDto mapToDto(
      MultiLangDocument multiLangDocument, MultiLangFileName multiLangFileName) {
    if (multiLangDocument == null) {
      return null;
    }
    return new MultiLangDocumentDto(
        Arrays.stream(Language.values())
            .collect(
                StreamUtil.toLinkedHashMap(
                    l -> l,
                    l ->
                        mapToDto(
                            multiLangFileName.getFileName(l),
                            multiLangDocument.getFileSizeBytes(l)))));
  }

  private static DocumentDetailsDto mapToDto(String fileName, Integer fileSize) {
    if (fileSize == null) {
      return null;
    }

    return new DocumentDetailsDto(fileName, fileSize);
  }

  public static Map<Language, MultipartFile> mapMultipartFilesToDomain(
      List<MultipartFile> multipartFiles) {
    if (multipartFiles == null) {
      return Collections.emptyMap();
    }

    return multipartFiles.stream()
        .collect(
            StreamUtil.toLinkedHashMap(
                (file) -> {
                  final var language =
                      file.getOriginalFilename()
                          .substring(0, file.getOriginalFilename().indexOf('.'));
                  if (!Language.LANGUAGE_TO_LANGUAGE_TAG.containsValue(language)) {
                    throw new BadRequestException("Invalid file name");
                  }

                  return Language.LANGUAGE_TAG_TO_LANGUAGE.get(language);
                },
                (file) -> file));
  }

  public static MultiLangDocument mapToDomain(Map<Language, MultipartFile> multipartFiles)
      throws IOException {
    if (!multipartFiles.containsKey(Language.GERMAN)) {
      return null;
    }

    MultiLangDocument multiLangDocument = new MultiLangDocument();
    for (var entry : multipartFiles.entrySet()) {
      multiLangDocument.update(entry.getKey(), entry.getValue().getBytes());
    }
    return multiLangDocument;
  }

  public static ConfigurationStatus mapToConfigurationStatus(
      MultiLangDocument... multiLangDocuments) {
    if (Arrays.stream(multiLangDocuments)
        .filter(Objects::nonNull)
        .anyMatch(doc -> !doc.isComplete())) {
      return ConfigurationStatus.PARTIALLY_COMPLETE;
    } else {
      return ConfigurationStatus.COMPLETE;
    }
  }
}
