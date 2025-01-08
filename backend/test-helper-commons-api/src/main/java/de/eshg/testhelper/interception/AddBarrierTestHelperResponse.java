/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.interception;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AddBarrierTestHelperResponse(@NotNull @Min(1) long barrierId) {}
