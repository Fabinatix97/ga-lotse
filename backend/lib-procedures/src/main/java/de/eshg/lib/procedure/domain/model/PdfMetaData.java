/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

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
public class PdfMetaData extends MetaData {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(optional = false)
  @MapsId
  @NotAudited
  private Pdf pdf;

  @DataSensitivity(PUBLIC)
  private Instant createdDate;

  public void setPdf(Pdf pdf) {
    this.pdf = pdf;
  }

  public Instant getCreatedDate() {
    return createdDate;
  }

  public void setCreatedDate(Instant createdDate) {
    this.createdDate = createdDate;
  }
}
