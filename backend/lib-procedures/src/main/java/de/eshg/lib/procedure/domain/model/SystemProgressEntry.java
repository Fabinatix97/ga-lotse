/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedBy;

@Entity
public class SystemProgressEntry extends ProgressEntry {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private String systemProgressEntryType;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private TriggerType triggerType;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @CreatedBy
  private UUID triggeredBy;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String changeDescription;

  public String getSystemProgressEntryType() {
    return systemProgressEntryType;
  }

  public void setSystemProgressEntryType(String systemProgressEntryType) {
    this.systemProgressEntryType = systemProgressEntryType;
  }

  public TriggerType getTriggerType() {
    return triggerType;
  }

  public void setTriggerType(TriggerType triggerType) {
    this.triggerType = triggerType;
  }

  public UUID getTriggeredBy() {
    return triggeredBy;
  }

  public void setTriggeredBy(UUID triggeredBy) {
    this.triggeredBy = triggeredBy;
  }

  public String getChangeDescription() {
    return changeDescription;
  }

  public void setChangeDescription(String changeDescription) {
    this.changeDescription = changeDescription;
  }
}
