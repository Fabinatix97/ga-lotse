/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Embeddable;
import java.time.Instant;
import java.util.UUID;

@Embeddable
public record Assignment(
    @DataSensitivity(SensitivityLevel.PSEUDONYMIZED) UUID assigneeId,
    @DataSensitivity(SensitivityLevel.PSEUDONYMIZED) UUID assignedById,
    @DataSensitivity(SensitivityLevel.PUBLIC) Instant assignmentDate) {}
