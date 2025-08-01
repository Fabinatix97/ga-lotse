/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.config;

import de.eshg.config.api.DocumentDetailsDto;
import de.eshg.config.api.MultiLangDocumentDto;
import de.eshg.config.domain.Document;
import de.eshg.officialmedicalservice.config.api.GetOmsConfigResponse;
import de.eshg.officialmedicalservice.config.api.OmsConfigDto;
import de.eshg.officialmedicalservice.config.persistence.entity.OmsConfiguration;
import java.nio.charset.StandardCharsets;
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
        extractLandingContent(omsConfiguration);

    DocumentDetailsDto concernsDocumentDetailsDto =
        new DocumentDetailsDto(
            OmsConfigService.CONCERNS_FILENAME, omsConfiguration.getConcerns().getContent().length);

    return new GetOmsConfigResponse(
        new OmsConfigDto(
            concernsDocumentDetailsDto,
            landingContentMultiLangDocumentDto,
            omsConfiguration.getKeycloakUserCleanupJobOverdueDuration(),
            omsConfiguration.getMedicalOpinionCutOffDateLeadTime(),
            omsConfiguration.isCitizenPortalAnamnesisEnabled()));
  }

  private MultiLangDocumentDto extractLandingContent(OmsConfiguration omsConfiguration) {
    DocumentDetailsDto landingContentDeDocumentDetailsDto =
        new DocumentDetailsDto(
            omsConfigService.getLandingContentFileNames().de(),
            omsConfiguration.getLandingContent().getDeFileSizeBytes());

    Integer enFileSizeBytes = omsConfiguration.getLandingContent().getEnFileSizeBytes();
    DocumentDetailsDto landingContentEnDocumentDetailsDto =
        (enFileSizeBytes != null
            ? new DocumentDetailsDto(
                omsConfigService.getLandingContentFileNames().en(), enFileSizeBytes)
            : null);
    return new MultiLangDocumentDto(
        landingContentDeDocumentDetailsDto, landingContentEnDocumentDetailsDto);
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
