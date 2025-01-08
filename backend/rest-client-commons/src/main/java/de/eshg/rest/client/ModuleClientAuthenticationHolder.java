/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.client;

import org.springframework.util.Assert;

public final class ModuleClientAuthenticationHolder {

  private ModuleClientAuthenticationHolder() {}

  private static final ThreadLocal<ModuleClientAuthentication>
      moduleClientAuthenticationThreadLocal = new ThreadLocal<>();

  public static ModuleClientAuthentication getModuleClientAuthentication() {
    return moduleClientAuthenticationThreadLocal.get();
  }

  public static void setModuleClientAuthentication(
      ModuleClientAuthentication moduleClientAuthentication) {
    Assert.isNull(
        moduleClientAuthenticationThreadLocal.get(),
        "Authentication cannot be set when already existent");
    moduleClientAuthenticationThreadLocal.set(moduleClientAuthentication);
  }

  public static void clearModuleClientAuthentication() {
    moduleClientAuthenticationThreadLocal.remove();
  }
}
