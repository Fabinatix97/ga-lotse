/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.facility;

import java.util.Set;
import java.util.UUID;

public record GetCFSIdByRefIdRequest(Set<UUID> fileStateIds) {}
