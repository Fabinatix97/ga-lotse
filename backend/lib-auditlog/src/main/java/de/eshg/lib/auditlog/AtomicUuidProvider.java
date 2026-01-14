/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog;

import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
@ConditionalOnTestHelperEnabled
public class AtomicUuidProvider implements UuidProvider {

  private final AtomicLong atomicLong = new AtomicLong();

  @Override
  public UUID nextUuid() {
    return new UUID(0, atomicLong.getAndIncrement());
  }

  public void reset() {
    atomicLong.set(0);
  }
}
