/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure.persistence.entity;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class Concern extends BaseEntity {

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String nameDe;

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String nameEn;

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

  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private AppointmentType appointmentType;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private boolean visibleInOnlinePortal;

  public @NotNull String getNameDe() {
    return nameDe;
  }

  public void setNameDe(@NotNull String nameDe) {
    this.nameDe = nameDe;
  }

  public String getNameEn() {
    return nameEn;
  }

  public void setNameEn(String nameEn) {
    this.nameEn = nameEn;
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

  public AppointmentType getAppointmentType() {
    return appointmentType;
  }

  public void setAppointmentType(AppointmentType appointmentType) {
    this.appointmentType = appointmentType;
  }

  public boolean isVisibleInOnlinePortal() {
    return visibleInOnlinePortal;
  }

  public void setVisibleInOnlinePortal(boolean visibleInOnlinePortal) {
    this.visibleInOnlinePortal = visibleInOnlinePortal;
  }
}
