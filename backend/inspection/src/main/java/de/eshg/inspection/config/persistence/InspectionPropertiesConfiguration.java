/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.config.persistence;

import de.eshg.config.domain.Initializable;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class InspectionPropertiesConfiguration extends BaseEntity
    implements Initializable, InspectionPropertiesConfigurationProvider {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private boolean initialized = false;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private FacilityFileNumberMethod facilityFileNumberMethod;

  @Override
  public boolean isInitialized() {
    return initialized;
  }

  @Override
  public void setInitialized(boolean initialized) {
    this.initialized = initialized;
  }

  public FacilityFileNumberMethod getFacilityFileNumberMethod() {
    return facilityFileNumberMethod;
  }

  public void setFacilityFileNumberMethod(FacilityFileNumberMethod facilityFileNumberMethod) {
    this.facilityFileNumberMethod = facilityFileNumberMethod;
  }
}
