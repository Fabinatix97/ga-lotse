/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import java.lang.reflect.Method;
import java.util.Optional;
import java.util.stream.Collectors;
import org.junit.jupiter.api.extension.AfterEachCallback;
import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestInstances;

public class ValidationFilenameExtension implements BeforeEachCallback, AfterEachCallback {

  private Method testMethod;
  private TestInstances testInstances;

  @Override
  public void beforeEach(ExtensionContext context) {
    this.testInstances = context.getRequiredTestInstances();
    this.testMethod = context.getTestMethod().orElse(null);
  }

  @Override
  public void afterEach(ExtensionContext context) {
    this.testInstances = null;
    this.testMethod = null;
  }

  public String getTestName() {
    return "%s/%s".formatted(getTestClassPath(), getTestMethodName());
  }

  private String getTestClassPath() {
    return testInstances.getAllInstances().stream()
        .map(Object::getClass)
        .map(Class::getSimpleName)
        .collect(Collectors.joining("/"));
  }

  private String getTestMethodName() {
    return Optional.ofNullable(testMethod).orElseThrow().getName();
  }
}
