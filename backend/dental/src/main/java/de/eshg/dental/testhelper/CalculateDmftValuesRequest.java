/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.testhelper;

import de.eshg.dental.api.ToothDiagnosisDto;
import de.eshg.dental.api.ToothDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record CalculateDmftValuesRequest(
    @Valid @NotNull Map<ToothDto, ToothDiagnosisDto> toothDiagnoses) {}
