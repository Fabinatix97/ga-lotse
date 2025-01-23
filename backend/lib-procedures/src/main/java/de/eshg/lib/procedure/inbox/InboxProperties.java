/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.inbox;

import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties("de.eshg.lib.procedure.inbox")
public class InboxProperties {

  @Positive private int maxImageSideLength = 5_000;

  public int getMaxImageSideLength() {
    return maxImageSideLength;
  }

  public void setMaxImageSideLength(int maxImageSideLength) {
    this.maxImageSideLength = maxImageSideLength;
  }
}
