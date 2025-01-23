/*
 * Copyright 2025 cronn GmbH
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
public non-sealed class SystemProgressEntry extends ProgressEntry
    implements KeyDocumentAware, FileAware {

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

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String keyDocumentType;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Integer keyDocumentVersion;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(unique = true)
  private UUID previousFileStateId;

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

  public UUID getPreviousFileStateId() {
    return previousFileStateId;
  }

  public void setPreviousFileStateId(UUID previousFileStateId) {
    this.previousFileStateId = previousFileStateId;
  }

  @Override
  public String getKeyDocumentType() {
    return keyDocumentType;
  }

  @Override
  public void setKeyDocumentType(String keyDocumentType) {
    this.keyDocumentType = keyDocumentType;
  }

  @Override
  public Integer getKeyDocumentVersion() {
    return keyDocumentVersion;
  }

  @Override
  public void setKeyDocumentVersion(Integer keyDocumentVersion) {
    this.keyDocumentVersion = keyDocumentVersion;
  }

  @Override
  public boolean supportsUpload(ProcedureFileType fileType) {
    return true;
  }
}
