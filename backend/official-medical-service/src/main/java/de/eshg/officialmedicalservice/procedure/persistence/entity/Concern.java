/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.persistence.entity;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;

@Entity
public class Concern extends BaseEntity {

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String nameDe;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String nameEn;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String descriptionDe;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String descriptionEn;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private boolean highPriority;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String categoryNameDe;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String categoryNameEn;

  public @NotNull String getNameDe() {
    return nameDe;
  }

  public void setNameDe(@NotNull String nameDe) {
    this.nameDe = nameDe;
  }

  public @NotNull String getNameEn() {
    return nameEn;
  }

  public void setNameEn(@NotNull String nameEn) {
    this.nameEn = nameEn;
  }

  public @NotNull String getDescriptionDe() {
    return descriptionDe;
  }

  public void setDescriptionDe(@NotNull String descriptionDe) {
    this.descriptionDe = descriptionDe;
  }

  public @NotNull String getDescriptionEn() {
    return descriptionEn;
  }

  public void setDescriptionEn(@NotNull String descriptionEn) {
    this.descriptionEn = descriptionEn;
  }

  @NotNull
  public boolean isHighPriority() {
    return highPriority;
  }

  public void setHighPriority(@NotNull boolean highPriority) {
    this.highPriority = highPriority;
  }

  public @NotNull String getCategoryNameDe() {
    return categoryNameDe;
  }

  public void setCategoryNameDe(@NotNull String categoryNameDe) {
    this.categoryNameDe = categoryNameDe;
  }

  public @NotNull String getCategoryNameEn() {
    return categoryNameEn;
  }

  public void setCategoryNameEn(@NotNull String categoryNameEn) {
    this.categoryNameEn = categoryNameEn;
  }
}
