/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.scheme;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

  @ElementCollection
  @CollectionTable(
      name = "attribute_to_base_attributes",
      joinColumns = @JoinColumn(name = "id"),
      foreignKey = @ForeignKey(name = "fk_attribute_to_base_attributes"))
  @OrderColumn
  @Column(name = "base_attribute_code", nullable = false)
  private List<String> baseAttributeCodes = new ArrayList<>();

  void setDataSource(DataSource dataSource) {
    this.dataSource = dataSource;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public List<String> getBaseAttributeCodes() {
    return baseAttributeCodes;
  }

  public void addBaseAttributeCodes(List<String> baseAttributeCodes) {
    this.baseAttributeCodes.addAll(baseAttributeCodes);
  }
}
