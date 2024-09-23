/*
 * Copyright 2024 cronn GmbH
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
public class Pdf extends File {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(
      cascade = PERSIST,
      orphanRemoval = true,
      mappedBy = PdfMetaData_.PDF,
      fetch = FetchType.LAZY,
      optional = false)
  private PdfMetaData metaData;

  @Override
  public PdfMetaData getMetaData() {
    return metaData;
  }

  public void addMetaData(PdfMetaData metaData) {
    this.metaData = metaData;
    metaData.setPdf(this);
  }
}
