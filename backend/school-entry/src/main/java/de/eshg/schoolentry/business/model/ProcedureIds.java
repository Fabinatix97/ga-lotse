/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import java.util.List;
import java.util.UUID;

public record ProcedureIds(UUID childId, List<UUID> custodianIds) {}
