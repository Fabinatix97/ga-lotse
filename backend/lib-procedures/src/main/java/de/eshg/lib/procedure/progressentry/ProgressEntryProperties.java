/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.progressentry;

import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties("de.eshg.lib.procedure.progressentry")
public class ProgressEntryProperties {

  @Positive int maxImageSideLength = 5_000;

  public int getMaxImageSideLength() {
    return maxImageSideLength;
  }

  public void setMaxImageSideLength(int maxImageSideLength) {
    this.maxImageSideLength = maxImageSideLength;
  }
}
