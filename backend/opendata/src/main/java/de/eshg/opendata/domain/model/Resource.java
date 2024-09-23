/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.domain.model;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Transient;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Resource extends BaseEntity {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String ressourceName;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToMany(mappedBy = "resource")
  @OrderBy
  private final List<Version> versions = new ArrayList<>();

  @Transient
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Version latestVersion;

  public Version getLatestVersion() {
    return latestVersion;
  }

  public String getRessourceName() {
    return ressourceName;
  }

  public void setRessourceName(String ressourceName) {
    this.ressourceName = ressourceName;
  }

  public List<Version> getVersions() {
    return versions;
  }

  public void addVersion(Version version) {
    this.versions.add(version);
    setLatestVersion(version);
  }

  public void setLatestVersion(Version latestVersion) {
    this.latestVersion = latestVersion;
  }
}
