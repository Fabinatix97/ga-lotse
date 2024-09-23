/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.scheme;

import static de.eshg.lib.common.SensitivityLevel.PROTECTED;
import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class StatisticsScheme extends BaseEntityWithExternalId {

  @DataSensitivity(PROTECTED)
  @CreatedDate
  @Column(nullable = false)
  private Instant createdAt;

  @DataSensitivity(PUBLIC)
  @Column(nullable = false)
  private String name;

  @DataSensitivity(PROTECTED)
  @Column
  private Instant lastUsageAt;

  @DataSensitivity(PUBLIC)
  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = DataSource_.STATISTICS_SCHEME,
      orphanRemoval = true)
  @OrderColumn
  private final List<DataSource> dataSources = new ArrayList<>();

  public Instant getCreatedAt() {
    return createdAt;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Instant getLastUsageAt() {
    return lastUsageAt;
  }

  public void setLastUsageAt(Instant lastUsageAt) {
    this.lastUsageAt = lastUsageAt;
  }

  public List<DataSource> getDataSources() {
    return dataSources;
  }

  public void addDataSources(List<DataSource> dataSources) {
    dataSources.forEach(dataSource -> dataSource.setStatisticsScheme(this));
    this.dataSources.addAll(dataSources);
  }
}
