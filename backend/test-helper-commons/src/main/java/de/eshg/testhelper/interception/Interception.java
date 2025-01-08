/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.interception;

public sealed interface Interception
    permits InterceptionAwaitBarrier, InterceptionOverwriteResponse {

  TestHelperInterceptionRequestFilter filter();
}
