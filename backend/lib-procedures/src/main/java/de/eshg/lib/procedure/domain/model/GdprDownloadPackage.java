/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.util.UUID;

@Entity
public class GdprDownloadPackage extends BaseEntityWithExternalId {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  private UUID businessProcedureId;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  @Column(nullable = false)
  private byte[] content;

  public UUID getBusinessProcedureId() {
    return businessProcedureId;
  }

  public void setBusinessProcedureId(UUID businessProcedureId) {
    this.businessProcedureId = businessProcedureId;
  }

  public byte[] getContent() {
    return content;
  }

  public void setContent(byte[] content) {
    this.content = content;
  }
}
