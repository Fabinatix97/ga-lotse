/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.config;

import de.eshg.config.mapper.MultiLangDocumentMapper;
import de.eshg.opendata.api.OpenDataConfigDto;
import de.eshg.opendata.api.UpdateOpenDataConfigRequest;
import de.eshg.rest.service.i18n.Language;
import java.io.IOException;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;

final class OpenDataConfigMapper {

  private OpenDataConfigMapper() {}

  static OpenDataConfigDto mapToDto(OpenDataConfiguration openDataConfiguration) {
    if (!openDataConfiguration.isInitialized()) {
      return null;
    }

    return new OpenDataConfigDto(
        openDataConfiguration.getAuthor(),
        MultiLangDocumentMapper.mapToDto(
            openDataConfiguration.getTermsOfUse(),
            OpenDataConfigService.TERMS_OF_USE_CONFIG_FILENAME),
        openDataConfiguration.getFallbackLicenseUrl());
  }

  public static OpenDataConfiguration mapToDomain(
      UpdateOpenDataConfigRequest updateOpenDataConfigRequest,
      Map<Language, MultipartFile> termsOfUse)
      throws IOException {
    OpenDataConfiguration openDataConfiguration = new OpenDataConfiguration();
    openDataConfiguration.setAuthor(updateOpenDataConfigRequest.author());
    openDataConfiguration.setFallbackLicenseUrl(updateOpenDataConfigRequest.fallbackLicenseUrl());
    openDataConfiguration.setTermsOfUse(MultiLangDocumentMapper.mapToDomain(termsOfUse));
    return openDataConfiguration;
  }
}
