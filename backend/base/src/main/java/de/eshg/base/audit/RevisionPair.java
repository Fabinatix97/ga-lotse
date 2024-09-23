/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.audit;

import de.eshg.mapper.RevisionEntryWithChange;

public record RevisionPair<T>(
    RevisionEntryWithChange<T> before, RevisionEntryWithChange<T> after) {}
