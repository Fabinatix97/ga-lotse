/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.util.UUID;

@Entity
@DataSensitivity(PUBLIC)
public class AttributeSelection extends BaseEntity {

  @Column(nullable = false)
  private String businessModuleName;

  @Column(nullable = false)
  private UUID dataSourceId;

  @Column(nullable = false)
  private String businessModuleAttributeCode;

  @Column private String baseModuleAttributeCode;

  @Column(nullable = false)
  private String searchKey;

  public String getBusinessModuleName() {
    return businessModuleName;
  }

  public void setBusinessModuleName(String businessModuleName) {
    this.businessModuleName = businessModuleName;
  }

  public UUID getDataSourceId() {
    return dataSourceId;
  }

  public void setDataSourceId(UUID dataSourceId) {
    this.dataSourceId = dataSourceId;
  }

  public String getBusinessModuleAttributeCode() {
    return businessModuleAttributeCode;
  }

  public void setBusinessModuleAttributeCode(String businessModuleAttributeCode) {
    this.businessModuleAttributeCode = businessModuleAttributeCode;
  }

  public String getBaseModuleAttributeCode() {
    return baseModuleAttributeCode;
  }

  public void setBaseModuleAttributeCode(String baseModuleAttributeCode) {
    this.baseModuleAttributeCode = baseModuleAttributeCode;
  }

  public void setSearchKey(String searchKey) {
    this.searchKey = searchKey;
  }

  public String getSearchKey() {
    return searchKey;
  }
}
