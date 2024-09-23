/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import static de.eshg.schoolentry.domain.model.Icd10Group.TABLE_NAME;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

@Entity
@Table(name = TABLE_NAME)
@DataSensitivity(SensitivityLevel.PUBLIC)
public class Icd10Group {

  public static final String TABLE_NAME = "icd10group";

  @Id private String groupStart;

  @SuppressWarnings("unused" /* Required by Hibernate to make batched inserts possible */)
  @Version
  @Column(nullable = false)
  private Long version;

  @Column(nullable = false, unique = true)
  private String groupEnd;

  @Column(nullable = false, unique = true)
  private String title;

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getGroupStart() {
    return groupStart;
  }

  public void setGroupStart(String groupStart) {
    this.groupStart = groupStart;
  }

  public String getGroupEnd() {
    return groupEnd;
  }

  public void setGroupEnd(String groupEnd) {
    this.groupEnd = groupEnd;
  }
}
