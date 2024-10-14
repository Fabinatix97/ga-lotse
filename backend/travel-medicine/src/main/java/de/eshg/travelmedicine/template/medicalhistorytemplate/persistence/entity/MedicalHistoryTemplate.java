/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.template.medicalhistorytemplate.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@DataSensitivity(SensitivityLevel.PUBLIC)
public class MedicalHistoryTemplate extends GloballyUniqueEntityBase {

  @NotNull @Column private String title;

  @NotNull
  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private MedicalHistoryTemplateState state;

  @NotNull @Column private String content;

  @NotNull @Column private boolean mainFlag;
  @NotNull @Column private boolean followUpFlag;
  @NotNull @Column @CreatedDate private Instant createdAt;

  @NotNull @Column @LastModifiedDate private Instant modifiedAt;

  @Column private UUID modifiedBy;

  public MedicalHistoryTemplate() {}

  public MedicalHistoryTemplate(
      String title, MedicalHistoryTemplateState state, String content, UUID modifiedBy) {
    this.title = title;
    this.state = state;
    this.content = content;
    this.mainFlag = false;
    this.followUpFlag = false;
    this.modifiedBy = modifiedBy;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public MedicalHistoryTemplateState getState() {
    return state;
  }

  public void setState(MedicalHistoryTemplateState state) {
    this.state = state;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public Boolean getMainFlag() {
    return mainFlag;
  }

  public void setMainFlag(Boolean mainFlag) {
    this.mainFlag = mainFlag;
  }

  public Boolean getFollowUpFlag() {
    return followUpFlag;
  }

  public void setFollowUpFlag(Boolean followUpFlag) {
    this.followUpFlag = followUpFlag;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public UUID getModifiedBy() {
    return modifiedBy;
  }

  public void setModifiedBy(UUID modifiedBy) {
    this.modifiedBy = modifiedBy;
  }
}
