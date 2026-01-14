/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis.persistence;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotNull;

@MappedSuperclass
public class TeisEntity {
  @Id
  @Column(nullable = false, unique = true)
  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String zid;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Boolean aktiv;

  public @NotNull String getZid() {
    return zid;
  }

  public void setZid(@NotNull String zid) {
    this.zid = zid;
  }

  public @NotNull Boolean getAktiv() {
    return aktiv;
  }

  public void setAktiv(@NotNull Boolean aktiv) {
    this.aktiv = aktiv;
  }
}
