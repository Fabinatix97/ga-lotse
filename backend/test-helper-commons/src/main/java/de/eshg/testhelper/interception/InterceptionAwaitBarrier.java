/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.interception;

record InterceptionAwaitBarrier(long barrierId, TestHelperInterceptionRequestFilter filter)
    implements Interception {}
