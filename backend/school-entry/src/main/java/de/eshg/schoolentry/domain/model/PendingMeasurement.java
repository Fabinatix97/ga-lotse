/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = "correlation_id"))
@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
public class PendingMeasurement extends BaseEntity {

  private String correlationId;
  private String equipmentSelector;
  private String equipmentName;
  private String firstNameAlias;
  private String lastNameAlias;

  public String getCorrelationId() {
    return correlationId;
  }

  public void setCorrelationId(String correlationId) {
    this.correlationId = correlationId;
  }

  public String getEquipmentSelector() {
    return equipmentSelector;
  }

  public void setEquipmentSelector(String equipmentSelector) {
    this.equipmentSelector = equipmentSelector;
  }

  public String getEquipmentName() {
    return equipmentName;
  }

  public void setEquipmentName(String equipmentName) {
    this.equipmentName = equipmentName;
  }

  public String getFirstNameAlias() {
    return firstNameAlias;
  }

  public void setFirstNameAlias(String firstNameAlias) {
    this.firstNameAlias = firstNameAlias;
  }

  public String getLastNameAlias() {
    return lastNameAlias;
  }

  public void setLastNameAlias(String lastNameAlias) {
    this.lastNameAlias = lastNameAlias;
  }
}
