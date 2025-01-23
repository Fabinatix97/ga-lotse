/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.icd10.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record FindIcd10CodesResponse(@NotNull @Valid List<Icd10CodeDto> existingCodes) {}
