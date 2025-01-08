/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.interception;

record InterceptionOverwriteResponse(
    InterceptionType type, TestHelperInterceptionRequestFilter filter) implements Interception {}
