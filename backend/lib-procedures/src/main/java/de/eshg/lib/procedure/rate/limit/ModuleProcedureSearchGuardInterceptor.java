/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.rate.limit;

import org.springframework.web.servlet.HandlerInterceptor;

public interface ModuleProcedureSearchGuardInterceptor extends HandlerInterceptor {
  String getApiPath();

  String getMethod();
}
