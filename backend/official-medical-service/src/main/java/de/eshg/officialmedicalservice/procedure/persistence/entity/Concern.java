/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure.persistence.entity;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.rest.service.i18n.Language;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
public class Concern extends BaseEntity {

  @Column(nullable = false)
  @NotNull
  private String nameDe;

  @Column private String nameEn;

  @Column private String nameEs;

  @Column private String nameTr;

  @Column private String nameRu;

  @Column private String nameAr;

  @Column private String nameFr;

  @Column private String nameIt;

  @Column private String namePl;

  @Column private String nameRo;

  @Column private String nameUk;

  @Column private String nameHr;

  @Column private String nameFa;

  @Column private String namePrs;

  @Column(nullable = false)
  @NotNull
  private boolean highPriority;

  @Column(nullable = false)
  @NotNull
  private String categoryNameDe;

  @Column(nullable = false)
  @NotNull
  private String categoryNameEn;

  @Column private String categoryNameEs;

  @Column private String categoryNameTr;

  @Column private String categoryNameRu;

  @Column private String categoryNameAr;

  @Column private String categoryNameFr;

  @Column private String categoryNameIt;

  @Column private String categoryNamePl;

  @Column private String categoryNameRo;

  @Column private String categoryNameUk;

  @Column private String categoryNameHr;

  @Column private String categoryNameFa;

  @Column private String categoryNamePrs;

  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private AppointmentType appointmentType;

  @Column(nullable = false)
  @NotNull
  private boolean visibleInOnlinePortal;

  public String getName(Language language) {
    return switch (language) {
      case GERMAN -> nameDe;
      case ENGLISH -> nameEn;
      case SPANISH -> nameEs;
      case TURKISH -> nameTr;
      case RUSSIAN -> nameRu;
      case ARABIC -> nameAr;
      case FRENCH -> nameFr;
      case ITALIAN -> nameIt;
      case POLISH -> namePl;
      case ROMANIAN -> nameRo;
      case UKRAINIAN -> nameUk;
      case CROATIAN -> nameHr;
      case FARSI -> nameFa;
      case DARI -> namePrs;
    };
  }

  public void setName(Language language, String name) {
    switch (language) {
      case GERMAN -> nameDe = name;
      case ENGLISH -> nameEn = name;
      case SPANISH -> nameEs = name;
      case TURKISH -> nameTr = name;
      case RUSSIAN -> nameRu = name;
      case ARABIC -> nameAr = name;
      case FRENCH -> nameFr = name;
      case ITALIAN -> nameIt = name;
      case POLISH -> namePl = name;
      case ROMANIAN -> nameRo = name;
      case UKRAINIAN -> nameUk = name;
      case CROATIAN -> nameHr = name;
      case FARSI -> nameFa = name;
      case DARI -> namePrs = name;
    }
  }

  public String getCategoryName(Language language) {
    return switch (language) {
      case GERMAN -> categoryNameDe;
      case ENGLISH -> categoryNameEn;
      case SPANISH -> categoryNameEs;
      case TURKISH -> categoryNameTr;
      case RUSSIAN -> categoryNameRu;
      case ARABIC -> categoryNameAr;
      case FRENCH -> categoryNameFr;
      case ITALIAN -> categoryNameIt;
      case POLISH -> categoryNamePl;
      case ROMANIAN -> categoryNameRo;
      case UKRAINIAN -> categoryNameUk;
      case CROATIAN -> categoryNameHr;
      case FARSI -> categoryNameFa;
      case DARI -> categoryNamePrs;
    };
  }

  public void setCategoryName(Language language, String categoryName) {
    switch (language) {
      case GERMAN -> categoryNameDe = categoryName;
      case ENGLISH -> categoryNameEn = categoryName;
      case SPANISH -> categoryNameEs = categoryName;
      case TURKISH -> categoryNameTr = categoryName;
      case RUSSIAN -> categoryNameRu = categoryName;
      case ARABIC -> categoryNameAr = categoryName;
      case FRENCH -> categoryNameFr = categoryName;
      case ITALIAN -> categoryNameIt = categoryName;
      case POLISH -> categoryNamePl = categoryName;
      case ROMANIAN -> categoryNameRo = categoryName;
      case UKRAINIAN -> categoryNameUk = categoryName;
      case CROATIAN -> categoryNameHr = categoryName;
      case FARSI -> categoryNameFa = categoryName;
      case DARI -> categoryNamePrs = categoryName;
    }
  }

  @NotNull
  public boolean isHighPriority() {
    return highPriority;
  }

  public void setHighPriority(@NotNull boolean highPriority) {
    this.highPriority = highPriority;
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
