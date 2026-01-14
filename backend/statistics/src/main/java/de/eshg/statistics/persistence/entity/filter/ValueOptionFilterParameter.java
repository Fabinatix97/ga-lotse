/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.filter;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.AbstractFilterParameter;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import java.util.ArrayList;
import java.util.List;

@DataSensitivity(PUBLIC)
@Entity
@DiscriminatorValue("VALUE_OPTION_FILTER")
public class ValueOptionFilterParameter extends AbstractFilterParameter {
  @ElementCollection
  @CollectionTable(
      name = "value_option_filter_to_search_values",
      joinColumns = @JoinColumn(name = "id"))
  @Column(name = "search_value", nullable = false)
  private List<String> searchValues = new ArrayList<>();

  @Column(nullable = false)
  private boolean searchForNull;

  public List<String> getSearchValues() {
    return searchValues;
  }

  public void addSearchValues(List<String> searchValues) {
    this.searchValues.addAll(searchValues);
  }

  public boolean isSearchForNull() {
    return searchForNull;
  }

  public void setSearchForNull(boolean searchForNull) {
    this.searchForNull = searchForNull;
  }
}
