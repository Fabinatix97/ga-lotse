/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.base.util.MapUtils;
import de.eshg.config.ConfigurationEndpoint;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.config.domain.AbstractDepartmentInfoConfig;
import de.eshg.config.domain.DepartmentInfo;
import de.eshg.config.mapper.DepartmentInfoMapper;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import java.util.SequencedMap;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

public abstract class AbstractDepartmentInfoConfigService<T extends AbstractDepartmentInfoConfig>
    extends EshgConfigurationService<T> {

  protected AbstractDepartmentInfoConfigService(
      EntityManager entityManager, TransactionHelper transactionHelper, Class<T> configClass) {
    super(entityManager, transactionHelper, configClass);
  }

  T getInternalConfig() {
    return getConfig();
  }

  @Override
  protected SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    return MapUtils.orderedMapOf(
        ConfigurationEndpoint.DEPARTMENT_INFO.name(), ConfigurationStatus.COMPLETE);
  }

  @Transactional(readOnly = true)
  public GetDepartmentInfoResponse getDepartmentInfo() {
    T departmentInfoConfig = getConfig();
    DepartmentInfo departmentInfo = departmentInfoConfig.getDepartmentInfo();
    Assert.state(departmentInfo != null, "Department Info is expected to be present");
    return DepartmentInfoMapper.mapToDepartmentInfoResponse(departmentInfo);
  }

  @Transactional
  public void update(DepartmentInfo departmentInfoUpdate) {
    T config = getConfig();
    updateDepartmentInfo(config, departmentInfoUpdate);
  }

  protected void updateDepartmentInfo(T config, DepartmentInfo departmentInfoUpdate) {
    config.setDepartmentInfo(
        updateDepartmentInfo(config.getDepartmentInfo(), departmentInfoUpdate));
  }

  private DepartmentInfo updateDepartmentInfo(
      DepartmentInfo persistedDepartmentInfo, DepartmentInfo departmentInfoUpdate) {
    if (departmentInfoUpdate == null || persistedDepartmentInfo == null) {
      return departmentInfoUpdate;
    }

    return applyDepartmentInfoUpdate(persistedDepartmentInfo, departmentInfoUpdate);
  }

  private DepartmentInfo applyDepartmentInfoUpdate(
      DepartmentInfo persistedDepartmentInfo, DepartmentInfo departmentInfoUpdate) {
    persistedDepartmentInfo.setName(departmentInfoUpdate.getName());
    persistedDepartmentInfo.setAbbreviation(departmentInfoUpdate.getAbbreviation());
    persistedDepartmentInfo.setStreet(departmentInfoUpdate.getStreet());
    persistedDepartmentInfo.setHouseNumber(departmentInfoUpdate.getHouseNumber());
    persistedDepartmentInfo.setPostalCode(departmentInfoUpdate.getPostalCode());
    persistedDepartmentInfo.setCity(departmentInfoUpdate.getCity());
    persistedDepartmentInfo.setCountry(departmentInfoUpdate.getCountry());
    persistedDepartmentInfo.setPhoneNumber(departmentInfoUpdate.getPhoneNumber());
    persistedDepartmentInfo.setHomepage(departmentInfoUpdate.getHomepage());
    persistedDepartmentInfo.setEmail(departmentInfoUpdate.getEmail());
    persistedDepartmentInfo.setLatitude(departmentInfoUpdate.getLatitude());
    persistedDepartmentInfo.setLongitude(departmentInfoUpdate.getLongitude());
    return persistedDepartmentInfo;
  }
}
