/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import java.time.Instant;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

@Entity
@Audited
public class ImageMetaData extends MetaData {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(optional = false)
  @MapsId
  @NotAudited
  private Image image;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Instant createdDate;

  public void setImage(Image image) {
    this.image = image;
  }

  public Instant getCreatedDate() {
    return createdDate;
  }

  public void setCreatedDate(Instant createdDate) {
    this.createdDate = createdDate;
  }

  @Override
  public ImageMetaData copy() {
    ImageMetaData copy = new ImageMetaData();
    copy(copy);
    copy.createdDate = createdDate;
    return copy;
  }
}
