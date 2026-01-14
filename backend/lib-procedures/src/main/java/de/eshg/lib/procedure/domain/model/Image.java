/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import static jakarta.persistence.CascadeType.PERSIST;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;

@Entity
public class Image extends File {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(
      cascade = PERSIST,
      orphanRemoval = true,
      mappedBy = ImageMetaData_.IMAGE,
      fetch = FetchType.LAZY,
      optional = false)
  private ImageMetaData metaData;

  @Override
  public ImageMetaData getMetaData() {
    return metaData;
  }

  public void addMetaData(ImageMetaData metaData) {
    this.metaData = metaData;
    metaData.setImage(this);
  }

  @Override
  public Image copy() {
    if (getAttachedToMail() != null) {
      return (Image) copyWithMail();
    }
    Image copy = new Image();
    copy(copy);
    copy.metaData = metaData.copy();
    copy.metaData.setImage(copy);
    return copy;
  }
}
