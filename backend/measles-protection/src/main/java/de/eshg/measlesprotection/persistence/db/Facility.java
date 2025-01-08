/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.db;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.RelatedFacility;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@Table(indexes = @Index(columnList = "procedure_id", unique = true))
public class Facility extends RelatedFacility<MeaslesProtectionProcedure> {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private MPFacilityType mpFacilityType;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String otherFacilityTypeInformation;

  public void setOtherFacilityTypeInformation(String otherFacilityTypeInformation) {
    this.otherFacilityTypeInformation = otherFacilityTypeInformation;
  }

  public String getOtherFacilityTypeInformation() {
    return otherFacilityTypeInformation;
  }

  public MPFacilityType getMpFacilityType() {
    return mpFacilityType;
  }

  public void setMpFacilityType(MPFacilityType facilityType) {
    this.mpFacilityType = facilityType;
  }
}
