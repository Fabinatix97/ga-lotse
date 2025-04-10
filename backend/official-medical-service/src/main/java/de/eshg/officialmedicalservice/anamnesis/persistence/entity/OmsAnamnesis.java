/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.anamnesis.persistence.entity;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class OmsAnamnesis extends BaseEntity {
  @MapsId
  @OneToOne(optional = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private OmsProcedure procedure;

  @Column
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private byte[] content;

  public OmsProcedure getProcedure() {
    return procedure;
  }

  public void setProcedure(OmsProcedure procedure) {
    this.procedure = procedure;
  }

  public byte[] getContent() {
    return content;
  }

  public void setContent(byte[] content) {
    this.content = content;
  }
}
