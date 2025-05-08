/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.model.synapse;

import java.util.List;

public record UserDirectoryResponse(Boolean limited, List<UserDirectoryEntry> results) {}
