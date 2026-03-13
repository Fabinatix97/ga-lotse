/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.config;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.config.api.DocumentDetailsDto;
import de.eshg.config.api.MultiLangDocumentDto;
import de.eshg.config.domain.Document;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.config.i18n.MultiLangFileName;
import de.eshg.officialmedicalservice.config.api.GetOmsConfigResponse;
import de.eshg.officialmedicalservice.config.api.OmsConfigDto;
import de.eshg.officialmedicalservice.config.persistence.entity.OmsConfiguration;
import de.eshg.rest.service.i18n.Language;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class OmsConfigMapper {

  private final OmsConfigService omsConfigService;

  public OmsConfigMapper(OmsConfigService omsConfigService) {
    this.omsConfigService = omsConfigService;
  }

  public GetOmsConfigResponse toInterfaceType(OmsConfiguration omsConfiguration) {
    MultiLangDocumentDto landingContentMultiLangDocumentDto =
        mapToDto(
            omsConfiguration.getLandingContent(), omsConfigService.getLandingContentFileNames());
    MultiLangDocumentDto selectConcernInfobox =
        mapToDto(
            omsConfiguration.getSelectConcernInfobox(),
            omsConfigService.getSelectConcernInfoboxFileNames());

    DocumentDetailsDto concernsDocumentDetailsDto =
        new DocumentDetailsDto(
            OmsConfigService.CONCERNS_FILENAME, omsConfiguration.getConcerns().getContent().length);

    return new GetOmsConfigResponse(
        new OmsConfigDto(
            concernsDocumentDetailsDto,
            landingContentMultiLangDocumentDto,
            selectConcernInfobox,
            omsConfiguration.getKeycloakUserCleanupJobOverdueDuration(),
            omsConfiguration.getMedicalOpinionCutOffDateLeadTime(),
            omsConfiguration.isCitizenPortalAnamnesisEnabled()));
  }

  private MultiLangDocumentDto mapToDto(MultiLangDocument document, MultiLangFileName fileNames) {
    if (document == null) {
      return null;
    }

    return new MultiLangDocumentDto(
        Arrays.stream(Language.values())
            .collect(StreamUtil.toLinkedHashMap(l -> l, l -> mapToDto(l, document, fileNames))));
  }

  private DocumentDetailsDto mapToDto(
      Language language, MultiLangDocument document, MultiLangFileName fileNames) {
    final var fileSizeInBytes = document.getFileSizeBytes(language);
    return (fileSizeInBytes != null
        ? new DocumentDetailsDto(fileNames.getFileName(language), fileSizeInBytes)
        : null);
  }

  public static ResponseEntity<Resource> documentToEntity(
      Document document, String filename, MediaType mediaType) {
    byte[] content = document.getContent();
    ContentDisposition contentDisposition =
        ContentDisposition.attachment().filename(filename, StandardCharsets.UTF_8).build();
    return ResponseEntity.ok()
        .headers(httpHeaders -> httpHeaders.setContentDisposition(contentDisposition))
        .contentType(mediaType)
        .body(new ByteArrayResource(content));
  }
}
