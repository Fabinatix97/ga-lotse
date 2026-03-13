/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence.entity;

import java.util.UUID;

public record PairUUIDFacility(UUID id, Facility facility) {}
