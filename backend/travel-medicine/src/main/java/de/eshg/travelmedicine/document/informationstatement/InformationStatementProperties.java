/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.informationstatement;

import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties("de.eshg.travel-medicine.document.information-statement")
public class InformationStatementProperties {

  @Positive int maxImageSideLength = 5_000;

  public int getMaxImageSideLength() {
    return maxImageSideLength;
  }

  public void setMaxImageSideLength(int maxImageSideLength) {
    this.maxImageSideLength = maxImageSideLength;
  }
}
