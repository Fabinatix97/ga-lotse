/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.icd10.persistence.entity;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

@Entity
@Table(name = Icd10Code.TABLE_NAME, indexes = @Index(columnList = "group_id"))
@DataSensitivity(SensitivityLevel.PUBLIC)
public class Icd10Code {

  public static final String TABLE_NAME = "icd10code";

  @Id private String originalCode;

  @SuppressWarnings("unused" /* Required by Hibernate to make batched inserts possible */)
  @Version
  @Column(nullable = false)
  private Long version;

  @Column(nullable = false, unique = true)
  private String code;

  @Column(nullable = false)
  private String title;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(nullable = false, name = "group_id")
  private Icd10Group group;

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getOriginalCode() {
    return originalCode;
  }

  public void setOriginalCode(String originalCode) {
    this.originalCode = originalCode;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public Icd10Group getGroup() {
    return group;
  }

  public void setGroup(Icd10Group group) {
    this.group = group;
  }
}
