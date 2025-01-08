/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.domain.model;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Resource extends BaseEntity {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(unique = true, nullable = false)
  private String resourceName;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToMany(
      mappedBy = Version_.RESOURCE,
      cascade = {CascadeType.PERSIST},
      orphanRemoval = true)
  @OrderBy
  private final List<Version> versions = new ArrayList<>();

  public String getResourceName() {
    return resourceName;
  }

  public void setResourceName(String resourceName) {
    this.resourceName = resourceName;
  }

  public List<Version> getVersions() {
    return versions;
  }

  public void addVersion(Version version) {
    if (version == null) {
      return;
    }
    this.versions.addFirst(version);
    version.setResource(this);
  }
}
