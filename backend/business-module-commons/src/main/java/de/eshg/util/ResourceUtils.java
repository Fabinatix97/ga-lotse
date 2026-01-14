/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.util;

import org.springframework.core.io.Resource;
import org.springframework.util.Assert;

public final class ResourceUtils {

  private ResourceUtils() {}

  public static void assertIsReadable(Resource resource, String resourceName) {
    if (resource != null) {
      Assert.isTrue(
          resource.isReadable(), "%s file must exist and be readable.".formatted(resourceName));
    }
  }
}
