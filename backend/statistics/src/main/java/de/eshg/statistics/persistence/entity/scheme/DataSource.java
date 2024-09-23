/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.scheme;

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
import java.util.UUID;

@Entity
@DataSensitivity(PUBLIC)
@Table(indexes = @Index(columnList = "scheme_id"))
public class DataSource extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "scheme_id")
  private StatisticsScheme statisticsScheme;

  @Column(nullable = false)
  private String businessModuleName;

  @Column(nullable = false)
  private UUID externalDataSourceId;

  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = DataAttribute_.DATA_SOURCE,
      orphanRemoval = true)
  @OrderColumn
  private final List<DataAttribute> attributes = new ArrayList<>();

  void setStatisticsScheme(StatisticsScheme statisticsScheme) {
    this.statisticsScheme = statisticsScheme;
  }

  public String getBusinessModuleName() {
    return businessModuleName;
  }

  public void setBusinessModuleName(String businessModuleName) {
    this.businessModuleName = businessModuleName;
  }

  public UUID getExternalDataSourceId() {
    return externalDataSourceId;
  }

  public void setExternalDataSourceId(UUID externalDataSourceId) {
    this.externalDataSourceId = externalDataSourceId;
  }

  public List<DataAttribute> getAttributes() {
    return attributes;
  }

  public void addAttributes(List<DataAttribute> attributes) {
    attributes.forEach(attribute -> attribute.setDataSource(this));
    this.attributes.addAll(attributes);
  }
}
