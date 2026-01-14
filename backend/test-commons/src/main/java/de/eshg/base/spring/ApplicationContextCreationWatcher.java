/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.spring;

import java.util.concurrent.atomic.AtomicInteger;
import org.opentest4j.AssertionFailedError;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ApplicationContextCreationWatcher {

  // Note: This needs to be static since multiple Spring contexts will create multiple instances of
  // this component.
  private static final AtomicInteger numberOfApplicationContexts = new AtomicInteger();

  ApplicationContextCreationWatcher(
      @Value("${eshg.test.spring.max-allowed-contexts:1}") int maxNumberOfAllowedContexts) {
    int currentNumberOfContexts = numberOfApplicationContexts.get();
    if (currentNumberOfContexts >= maxNumberOfAllowedContexts) {
      throw new AssertionFailedError(
          "tried to create another Spring application context; only "
              + maxNumberOfAllowedContexts
              + " are allowed, but there are already "
              + currentNumberOfContexts
              + " contexts alive - please check if that is really intended. "
              + "This could mean that you either forgot to extend AbstractSpringBootTest or that "
              + "you accidentally modified the context in a concrete test class. Read on spring context caching at "
              + "https://rieckpil.de/improve-build-times-with-context-caching-from-spring-test.");
    }

    numberOfApplicationContexts.incrementAndGet();
  }
}
