/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.TestInfo;

final class ValidationFilenameHelper {

  private final TestInfo testInfo;

  ValidationFilenameHelper(TestInfo testInfo) {
    this.testInfo = testInfo;
  }

  String getTestName() {
    return getTestClassName() + "/" + getTestMethod().getName();
  }

  String getTestClassName() {
    List<String> classes = ValidationFilenameHelper.classHierarchy(getTestClass());
    return String.join("/", classes);
  }

  private static List<String> classHierarchy(Class<?> aClass) {
    List<String> classHierarchy = new ArrayList<>();
    classHierarchy.add(aClass.getSimpleName());
    Class<?> enclosingClass = aClass.getEnclosingClass();
    while (enclosingClass != null) {
      classHierarchy.add(enclosingClass.getSimpleName());
      enclosingClass = enclosingClass.getEnclosingClass();
    }
    Collections.reverse(classHierarchy);
    return classHierarchy;
  }

  private Method getTestMethod() {
    return testInfo.getTestMethod().orElseThrow();
  }

  private Class<?> getTestClass() {
    return testInfo.getTestClass().orElseThrow();
  }
}
