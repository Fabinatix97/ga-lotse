/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.domain.model;

import de.eshg.lib.common.CountryCode;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@Table(indexes = @Index(columnList = "procedure_id"))
public class Professional extends RelatedPerson<MedicalRegistryProcedure> {

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  private CountryCode nationality;

  public Professional() {
    super(PersonType.PROFESSIONAL);
  }

  public CountryCode getNationality() {
    return nationality;
  }

  public void setNationality(CountryCode nationality) {
    this.nationality = nationality;
  }
}
