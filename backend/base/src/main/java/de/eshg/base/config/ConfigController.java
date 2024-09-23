/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.base.config.api.Configuration;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.unit.DataSize;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Config")
public class ConfigController implements ConfigApi {

  @Value("${spring.servlet.multipart.max-file-size}")
  private DataSize maxFileSize;

  @Override
  public Configuration getConfig() {
    return new Configuration(maxFileSize.toBytes());
  }
}
