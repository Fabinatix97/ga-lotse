/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.base.department.LocationDto;
import de.eshg.config.EshgConfigurationService;
import de.eshg.departmentinfo.domain.AbstractDepartmentInfo;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;

public abstract class AbstractDepartmentInfoService<T extends AbstractDepartmentInfo>
    extends EshgConfigurationService<T> {

  public AbstractDepartmentInfoService(
      EntityManager entityManager, TransactionHelper transactionHelper, Class<T> configClass) {
    super(entityManager, transactionHelper, configClass);
  }

  @Transactional(readOnly = true)
  public GetDepartmentInfoResponse getDepartmentInfo() {
    T departmentInfo = getConfig();
    return new GetDepartmentInfoResponse(
        departmentInfo.getName(),
        departmentInfo.getAbbreviation(),
        departmentInfo.getStreet(),
        departmentInfo.getHouseNumber(),
        departmentInfo.getPostalCode(),
        departmentInfo.getCity(),
        departmentInfo.getCountry(),
        departmentInfo.getPhoneNumber(),
        departmentInfo.getHomepage(),
        departmentInfo.getEmail(),
        new LocationDto(departmentInfo.getLatitude(), departmentInfo.getLongitude()));
  }
}
