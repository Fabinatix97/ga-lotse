/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.testhelper;

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

  public BaseTestHelperResetAction(
      UserControllerRateLimiter userControllerRateLimiter,
      Icd10CodeTestHelper icd10CodeTestHelper) {
    this.userControllerRateLimiter = userControllerRateLimiter;
    this.icd10CodeTestHelper = icd10CodeTestHelper;
  }

  @Override
  public void reset() {
    this.userControllerRateLimiter.reset();
    this.icd10CodeTestHelper.repopulateIcd10CodesIfNecessary();
  }
}
