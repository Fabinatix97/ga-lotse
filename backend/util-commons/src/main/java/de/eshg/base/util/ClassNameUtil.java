/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import com.google.common.base.CaseFormat;

public final class ClassNameUtil {

  private ClassNameUtil() {}

  public static String getClassNameAsPropertyKey(Class<?> clazz) {
    return CaseFormat.UPPER_CAMEL.to(CaseFormat.LOWER_HYPHEN, clazz.getSimpleName());
  }
}
