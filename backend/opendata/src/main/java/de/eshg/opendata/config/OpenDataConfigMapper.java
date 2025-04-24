/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.config;

import de.eshg.config.api.DocumentDto;
import de.eshg.opendata.TermsOfUseHelper;
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
        new DocumentDto(
            TermsOfUseHelper.TERMS_OF_USE_FILENAME,
            openDataConfiguration.getTermsOfUseFileSizeBytes()),
        openDataConfiguration.getFallbackLicenseUrl());
  }

  public static OpenDataConfiguration mapToDomain(
      UpdateOpenDataConfigRequest updateOpenDataConfigRequest, MultipartFile termsOfUse)
      throws IOException {
    OpenDataConfiguration openDataConfiguration = new OpenDataConfiguration();
    openDataConfiguration.setAuthor(updateOpenDataConfigRequest.author());
    openDataConfiguration.setFallbackLicenseUrl(updateOpenDataConfigRequest.fallbackLicenseUrl());
    openDataConfiguration.setTermsOfUse(termsOfUse.getBytes());
    return openDataConfiguration;
  }
}
