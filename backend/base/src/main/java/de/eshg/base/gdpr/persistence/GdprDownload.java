/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.persistence;

import de.eshg.domain.model.SequencedBaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(indexes = @Index(columnList = GdprDownload.GDPR_PROCEDURE_ID))
public class GdprDownload extends SequencedBaseEntity {
  static final String GDPR_PROCEDURE_ID = "gdpr_procedure_id";

  @Column(nullable = false, unique = true)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID downloadId;

  @ManyToOne(optional = false)
  @JoinColumn(name = GDPR_PROCEDURE_ID)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private GdprProcedure gdprProcedure;

  public UUID getDownloadId() {
    return downloadId;
  }

  public void setDownloadId(UUID downloadId) {
    this.downloadId = downloadId;
  }

  public GdprProcedure getGdprProcedure() {
    return gdprProcedure;
  }

  public void setGdprProcedure(GdprProcedure gdprProcedure) {
    this.gdprProcedure = gdprProcedure;
  }
}
