/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.scheduling;

import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperServiceResetAction;
import net.javacrumbs.shedlock.support.StorageBasedLockProvider;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnTestHelperEnabled
@Order(40)
public class ShedlockResetAction implements TestHelperServiceResetAction {

  private final StorageBasedLockProvider storageBasedLockProvider;

  public ShedlockResetAction(StorageBasedLockProvider storageBasedLockProvider) {
    this.storageBasedLockProvider = storageBasedLockProvider;
  }

  @Override
  public void reset() {
    storageBasedLockProvider.clearCache();
  }
}
