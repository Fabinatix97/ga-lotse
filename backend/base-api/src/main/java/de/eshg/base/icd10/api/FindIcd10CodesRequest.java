/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.icd10.api;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record FindIcd10CodesRequest(@NotEmpty List<String> codes) {}
