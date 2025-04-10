/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.texttemplate;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class TextTemplate extends BaseEntityWithExternalId {

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String name;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private TextTemplateContext context;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String content;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public TextTemplateContext getContext() {
    return context;
  }

  public void setContext(TextTemplateContext context) {
    this.context = context;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }
}
