/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.config;

import java.util.concurrent.CountDownLatch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SelfSignedCertificateLatch {
  private static final Logger logger = LoggerFactory.getLogger(SelfSignedCertificateLatch.class);

  private CountDownLatch latch = new CountDownLatch(1);

  public SelfSignedCertificateLatch(boolean selfSignedEnabled) {
    if (!selfSignedEnabled) {
      latch.countDown();
    }
  }

  public void notifyCertificatePublished() {
    latch.countDown();
  }

  public void await() throws InterruptedException {
    if (latch.getCount() > 0) {
      logger.info("waiting for self signed certificate to be published...");
      latch.await();
      logger.info("finished waiting for self signed certificate to be published.");
    }
  }
}
