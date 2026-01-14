/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.interception;

record InterceptionAwaitBarrier(long barrierId, TestHelperInterceptionRequestFilter filter)
    implements Interception {}
