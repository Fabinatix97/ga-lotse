/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.evaluationtemplate;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@DataSensitivity(PUBLIC)
@Table(indexes = @Index(columnList = "data_source_id"))
public class DataAttribute extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "data_source_id")
  private DataSource dataSource;

  @Column(nullable = false)
  private String code;

  @Column(nullable = false)
  private String name;

  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = BaseDataAttribute_.DATA_ATTRIBUTE,
      orphanRemoval = true)
  @OrderColumn
  private final List<BaseDataAttribute> baseAttributes = new ArrayList<>();

  void setDataSource(DataSource dataSource) {
    this.dataSource = dataSource;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<BaseDataAttribute> getBaseAttributes() {
    return baseAttributes;
  }

  public void addBaseAttributes(List<BaseDataAttribute> baseAttributes) {
    baseAttributes.forEach(attribute -> attribute.setDataAttribute(this));
    this.baseAttributes.addAll(baseAttributes);
  }
}
