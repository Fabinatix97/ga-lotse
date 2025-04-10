/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.model.synapse;

import java.io.Serializable;
import java.time.Instant;

public record SynapseTokenData(String accessToken, Instant expiresAt, String refreshToken)
    implements Serializable {}
