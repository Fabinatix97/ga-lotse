/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.config;

import de.eshg.config.mapper.MultiLangDocumentMapper;
import de.eshg.opendata.api.OpenDataConfigDto;
import de.eshg.opendata.api.UpdateOpenDataConfigRequest;
import java.io.IOException;
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
      MultipartFile termsOfUseDe,
      MultipartFile termsOfUseEn)
      throws IOException {
    OpenDataConfiguration openDataConfiguration = new OpenDataConfiguration();
    openDataConfiguration.setAuthor(updateOpenDataConfigRequest.author());
    openDataConfiguration.setFallbackLicenseUrl(updateOpenDataConfigRequest.fallbackLicenseUrl());
    openDataConfiguration.setTermsOfUse(
        MultiLangDocumentMapper.mapToDomain(termsOfUseDe, termsOfUseEn));
    return openDataConfiguration;
  }
}
