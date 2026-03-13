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
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(InfectionBriefingConfigController.BASE_URL)
@Tag(name = "InfectionBriefingConfig")
public class InfectionBriefingConfigController {

  public static final String BASE_URL =
      BaseUrls.InfectionBriefing.CONFIG_CONTROLLER + "/infection-briefing";
  public static final MultiLangFileName LANDING_CONTENT_FILE_NAME =
      new MultiLangFileName(
          Map.ofEntries(
              Map.entry(Language.GERMAN, "Online-Portal-Information.md"),
              Map.entry(Language.ENGLISH, "online-portal-information.md"),
              Map.entry(Language.SPANISH, "información-del-portal-en-línea.md"),
              Map.entry(Language.TURKISH, "çevrimiçi-portal-bilgisi.md"),
              Map.entry(Language.RUSSIAN, "информация-онлайн-портала.md"),
              Map.entry(Language.ARABIC, "معلومات-البوابة-الإلكترونية.md"),
              Map.entry(Language.FRENCH, "information-du-portail-en-ligne.md"),
              Map.entry(Language.ITALIAN, "informazioni-del-portale-online.md"),
              Map.entry(Language.POLISH, "informacje-o-portalu-online.md"),
              Map.entry(Language.ROMANIAN, "informații-despre-portalul-online.md"),
              Map.entry(Language.UKRAINIAN, "інформація-онлайн-порталу.md"),
              Map.entry(Language.CROATIAN, "informacije-o-online-portalu.md"),
              Map.entry(Language.FARSI, "اطلاعات-پورتال-آنلاین.md"),
              Map.entry(Language.DARI, "اطلاعات-پورتال-آنلاین.md")));
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
      @RequestParam(value = "files", required = false) List<MultipartFile> landingContent) {
    InfectionBriefingConfig config =
        infectionBriefingConfigService.updateConfig(
            MultiLangDocumentMapper.mapMultipartFilesToDomain(landingContent));

    MultiLangFileName multiLangFileName = infectionBriefingConfigService.getMultiLangFileName();
    MultiLangDocumentDto landingContentMultiLangDocument =
        MultiLangDocumentMapper.mapToDto(config.getLandingContent(), multiLangFileName);

    return new GetInfectionBriefingConfigResponse(
        new InfectionBriefingConfigDto(landingContentMultiLangDocument));
  }

  @GetMapping("/{lang}")
  @Operation(
      summary =
          "Download the current content of the citizen portal landing page "
              + "(markdown file, one language)")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> downloadLandingPage(@PathVariable("lang") Language lang) {
    return infectionBriefingConfigService.downloadLandingPage(lang);
  }
}
