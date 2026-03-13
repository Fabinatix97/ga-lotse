/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.facility;

import jakarta.validation.Valid;
import java.util.Map;
import java.util.UUID;

public record GetCFSIdByRefIdResponse(@Valid Map<UUID, UUID> cfsIdByRefId) {}
