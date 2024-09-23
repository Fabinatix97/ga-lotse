/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.population;

import java.util.List;

public record ListWithTotalNumber<R>(List<R> entities, long totalNumberOfElements) {}
