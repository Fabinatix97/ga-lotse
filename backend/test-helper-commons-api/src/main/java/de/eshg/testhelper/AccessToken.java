/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import java.time.Instant;

public record AccessToken(String jwt, Instant expiresAt) {}
