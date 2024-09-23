/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.support;

import java.util.List;

public record ResultPage<T>(int totalPages, long totalElements, List<T> elements) {}
