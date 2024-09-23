/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;
import java.util.ArrayList;
import java.util.List;

@DataSensitivity(PUBLIC)
@Entity
public class FilterTemplate extends BaseEntityWithExternalId {
  @Column(nullable = false, unique = true)
  private String name;

  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = AbstractFilterParameter_.FILTER_TEMPLATE,
      orphanRemoval = true)
  @OrderColumn
  private final List<AbstractFilterParameter> filters = new ArrayList<>();

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<AbstractFilterParameter> getFilters() {
    return filters;
  }

  public void addFilters(List<AbstractFilterParameter> filters) {
    filters.forEach(filter -> filter.setFilterTemplate(this));
    this.filters.addAll(filters);
  }
}
