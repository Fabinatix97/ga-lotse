/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.client;

import java.util.UUID;

public record ModuleClientAuthentication(UUID userId, String accessToken) {}
