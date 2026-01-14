/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth.synapse;

import java.io.Serializable;
import java.time.Instant;

public record SynapseTokenData(
    String accessToken, Instant expiresAt, String refreshToken, String deviceId)
    implements Serializable {}
