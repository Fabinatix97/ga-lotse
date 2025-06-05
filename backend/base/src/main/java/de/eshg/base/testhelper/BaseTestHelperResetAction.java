/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.testhelper;

import de.eshg.base.config.DepartmentConfigurationService;
import de.eshg.base.street.MunicipalityDirectory;
import de.eshg.base.street.StreetDirectoryService;
import de.eshg.base.user.UserControllerRateLimiter;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperServiceResetAction;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@ConditionalOnTestHelperEnabled
@Component
@Order(50)
public class BaseTestHelperResetAction implements TestHelperServiceResetAction {
  private final UserControllerRateLimiter userControllerRateLimiter;
  private final Icd10CodeTestHelper icd10CodeTestHelper;
  private final DepartmentConfigurationService departmentConfigurationService;
  private final StreetDirectoryService streetDirectoryService;
  private final MunicipalityDirectory municipalityDirectory;

  public BaseTestHelperResetAction(
      UserControllerRateLimiter userControllerRateLimiter,
      Icd10CodeTestHelper icd10CodeTestHelper,
      DepartmentConfigurationService departmentConfigurationService,
      StreetDirectoryService streetDirectoryService,
      MunicipalityDirectory municipalityDirectory) {
    this.userControllerRateLimiter = userControllerRateLimiter;
    this.icd10CodeTestHelper = icd10CodeTestHelper;
    this.departmentConfigurationService = departmentConfigurationService;
    this.streetDirectoryService = streetDirectoryService;
    this.municipalityDirectory = municipalityDirectory;
  }

  @Override
  public void reset() {
    userControllerRateLimiter.reset();
    icd10CodeTestHelper.repopulateIcd10CodesIfNecessary();
    departmentConfigurationService.init();
    streetDirectoryService.init();
    municipalityDirectory.init();
  }
}
