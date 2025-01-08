/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;

import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.Embeddable;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Embeddable
@DataSensitivity(SENSITIVE)
public class EyeExaminationValues {

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private PercentageValue distance;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private PercentageValue distancePlus150Dpt;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private PercentageValue distanceWithGlasses;

  public PercentageValue getDistance() {
    return distance;
  }

  public void setDistance(PercentageValue distance) {
    this.distance = distance;
  }

  public PercentageValue getDistancePlus150Dpt() {
    return distancePlus150Dpt;
  }

  public void setDistancePlus150Dpt(PercentageValue distancePlus150Dpt) {
    this.distancePlus150Dpt = distancePlus150Dpt;
  }

  public PercentageValue getDistanceWithGlasses() {
    return distanceWithGlasses;
  }

  public void setDistanceWithGlasses(PercentageValue distanceWithGlasses) {
    this.distanceWithGlasses = distanceWithGlasses;
  }
}
