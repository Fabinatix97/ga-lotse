/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.persistence;

import java.util.UUID;

public record FacilityCentralFileState(UUID centralFileStateId, UUID originalCentralFileStateId) {}
