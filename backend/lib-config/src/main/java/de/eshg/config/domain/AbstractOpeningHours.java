/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.domain;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.rest.service.i18n.Language;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import java.util.ArrayList;
import java.util.List;

@MappedSuperclass
@DataSensitivity(SensitivityLevel.PUBLIC)
public class AbstractOpeningHours extends BaseEntity implements Initializable {

  @Column(nullable = false)
  private List<String> de = new ArrayList<>();

  @Column(nullable = false)
  private List<String> en = new ArrayList<>();

  @Column private List<String> es = new ArrayList<>();

  @Column private List<String> tr = new ArrayList<>();

  @Column private List<String> ru = new ArrayList<>();

  @Column private List<String> ar = new ArrayList<>();

  @Column private List<String> fr = new ArrayList<>();

  @Column private List<String> it = new ArrayList<>();

  @Column private List<String> pl = new ArrayList<>();

  @Column private List<String> ro = new ArrayList<>();

  @Column private List<String> uk = new ArrayList<>();

  @Column private List<String> hr = new ArrayList<>();

  @Column private List<String> fa = new ArrayList<>();

  @Column private List<String> prs = new ArrayList<>();

  @Column(nullable = false)
  private boolean initialized = false;

  public List<String> get(Language language) {
    return switch (language) {
      case GERMAN -> de;
      case ENGLISH -> en;
      case SPANISH -> es;
      case TURKISH -> tr;
      case RUSSIAN -> ru;
      case ARABIC -> ar;
      case FRENCH -> fr;
      case ITALIAN -> it;
      case POLISH -> pl;
      case ROMANIAN -> ro;
      case UKRAINIAN -> uk;
      case CROATIAN -> hr;
      case FARSI -> fa;
      case DARI -> prs;
    };
  }

  public void set(Language lang, List<String> content) {
    switch (lang) {
      case GERMAN -> de = content;
      case ENGLISH -> en = content;
      case SPANISH -> es = content;
      case TURKISH -> tr = content;
      case RUSSIAN -> ru = content;
      case ARABIC -> ar = content;
      case FRENCH -> fr = content;
      case ITALIAN -> it = content;
      case POLISH -> pl = content;
      case ROMANIAN -> ro = content;
      case UKRAINIAN -> uk = content;
      case CROATIAN -> hr = content;
      case FARSI -> fa = content;
      case DARI -> prs = content;
    }
  }

  @Override
  public boolean isInitialized() {
    return initialized;
  }

  @Override
  public void setInitialized(boolean initialized) {
    this.initialized = initialized;
  }
}
