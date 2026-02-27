/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.config.api.MultiLangDocumentDto;
import de.eshg.config.i18n.MultiLangFileName;
import de.eshg.config.mapper.MultiLangDocumentMapper;
import de.eshg.infectionbriefing.api.GetInfectionBriefingConfigResponse;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingConfig;
import de.eshg.rest.service.i18n.Language;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(InfectionBriefingConfigController.BASE_URL)
@Tag(name = "InfectionBriefingConfig")
public class InfectionBriefingConfigController {

  public static final String BASE_URL =
      BaseUrls.InfectionBriefing.CONFIG_CONTROLLER + "/infection-briefing";
  public static final String PART_LANDING_CONTENT_DE = "landingContent_de";
  public static final String PART_LANDING_CONTENT_EN = "landingContent_en";
  public static final String PART_CONFIG_REQUEST = "config-request";
  public static final MultiLangFileName LANDING_CONTENT_FILE_NAME =
      new MultiLangFileName("Online-Portal-Information.md", "online-portal-information.md");
  private static final Logger log =
      LoggerFactory.getLogger(InfectionBriefingConfigController.class);

  private final InfectionBriefingConfigService infectionBriefingConfigService;

  public InfectionBriefingConfigController(
      InfectionBriefingConfigService infectionBriefingConfigService) {
    this.infectionBriefingConfigService = infectionBriefingConfigService;
  }

  @GetMapping
  @Transactional(readOnly = true)
  public GetInfectionBriefingConfigResponse getConfig() {
    InfectionBriefingConfig config = infectionBriefingConfigService.getConfig();
    if (config.isInitialized()) {
      MultiLangDocumentDto landingContentMultiLangDocument =
          MultiLangDocumentMapper.mapToDto(config.getLandingContent(), LANDING_CONTENT_FILE_NAME);
      return new GetInfectionBriefingConfigResponse(
          new InfectionBriefingConfigDto(landingContentMultiLangDocument));
    } else {
      return new GetInfectionBriefingConfigResponse(null);
    }
  }

  @PutMapping(consumes = MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public GetInfectionBriefingConfigResponse updateConfig(
      @RequestPart(value = PART_LANDING_CONTENT_DE, required = false)
          MultipartFile landingContentDe,
      @RequestPart(value = PART_LANDING_CONTENT_EN, required = false)
          MultipartFile landingContentEn) {
    InfectionBriefingConfig config =
        infectionBriefingConfigService.updateConfig(landingContentDe, landingContentEn);

    MultiLangFileName multiLangFileName = infectionBriefingConfigService.getMultiLangFileName();
    MultiLangDocumentDto landingContentMultiLangDocument =
        MultiLangDocumentMapper.mapToDto(config.getLandingContent(), multiLangFileName);

    return new GetInfectionBriefingConfigResponse(
        new InfectionBriefingConfigDto(landingContentMultiLangDocument));
  }

  @GetMapping("/{lang}")
  @Operation(
      summary =
          "Download the current content of the citizen portal landing page (markdown file, one language)")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> downloadLandingPage(@PathVariable("lang") Language lang) {
    return infectionBriefingConfigService.downloadLandingPage(lang);
  }
}
