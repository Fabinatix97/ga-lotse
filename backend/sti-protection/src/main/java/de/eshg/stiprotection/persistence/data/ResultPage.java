/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.data;

import java.util.List;

public record ResultPage<T>(int totalPages, long totalElements, List<T> elements) {}
