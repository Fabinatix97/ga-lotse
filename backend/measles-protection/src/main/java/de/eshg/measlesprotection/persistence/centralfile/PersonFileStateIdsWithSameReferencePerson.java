/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.centralfile;

import java.util.List;
import java.util.UUID;

public record PersonFileStateIdsWithSameReferencePerson(List<UUID> fileStateIds) {}
