/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.medicalhistory.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class MedicalHistory extends GloballyUniqueEntityBase {

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  @NotNull
  @Column
  private String content;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  @Column
  private boolean isCompletelyAnswered;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  @Column
  private boolean citizenHasAnswered;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  @Column
  private String note;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  @Column
  @CreatedDate
  private Instant createdAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  @Column
  @LastModifiedDate
  private Instant modifiedAt;

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public boolean isCompletelyAnswered() {
    return isCompletelyAnswered;
  }

  public void setCompletelyAnswered(boolean completelyAnswered) {
    isCompletelyAnswered = completelyAnswered;
  }

  public boolean isCitizenHasAnswered() {
    return citizenHasAnswered;
  }

  public void setCitizenHasAnswered(boolean citizenHasAnswered) {
    this.citizenHasAnswered = citizenHasAnswered;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public void setModifiedAt(Instant modifiedAt) {
    this.modifiedAt = modifiedAt;
  }
}
