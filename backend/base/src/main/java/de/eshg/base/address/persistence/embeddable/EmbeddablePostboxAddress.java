/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.address.persistence.embeddable;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class EmbeddablePostboxAddress extends EmbeddableAddress {

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PROTECTED)
  private String postbox;

  public String getPostbox() {
    return postbox;
  }

  public void setPostbox(String postbox) {
    this.postbox = postbox;
  }
}
