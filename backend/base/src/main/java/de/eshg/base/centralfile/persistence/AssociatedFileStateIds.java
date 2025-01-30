/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence;

import java.util.UUID;

public record AssociatedFileStateIds(UUID fileStateId, UUID[] associatedFileStateIds) {}
