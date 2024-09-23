/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.logging;

record RenderingOptions(boolean includeLoggerName, int loggerNameLength, boolean includeLogLevel) {}
