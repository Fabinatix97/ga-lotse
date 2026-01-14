/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.testhelper;

import de.eshg.dental.api.ToothDiagnosisDto;
import de.eshg.dental.api.ToothDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record CalculateDecayValuesRequest(
    @Valid @NotNull Map<ToothDto, ToothDiagnosisDto> toothDiagnoses, @NotNull int age) {}
