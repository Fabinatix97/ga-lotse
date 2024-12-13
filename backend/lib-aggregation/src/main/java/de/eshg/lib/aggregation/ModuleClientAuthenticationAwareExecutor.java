/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.aggregation;

import de.eshg.rest.client.ModuleClientAuthentication;
import de.eshg.rest.client.ModuleClientAuthenticationHolder;
import java.util.concurrent.Executor;

public class ModuleClientAuthenticationAwareExecutor implements Executor {

  private final Executor delegate;

  public ModuleClientAuthenticationAwareExecutor(Executor delegate) {
    this.delegate = delegate;
  }

  @Override
  public final void execute(Runnable task) {
    this.delegate.execute(wrap(task));
  }

  private static Runnable wrap(Runnable task) {
    ModuleClientAuthentication moduleClientAuthentication =
        ModuleClientAuthenticationHolder.getModuleClientAuthentication();
    return () -> {
      try {
        ModuleClientAuthenticationHolder.setModuleClientAuthentication(moduleClientAuthentication);
        task.run();
      } finally {
        ModuleClientAuthenticationHolder.clearModuleClientAuthentication();
      }
    };
  }
}
