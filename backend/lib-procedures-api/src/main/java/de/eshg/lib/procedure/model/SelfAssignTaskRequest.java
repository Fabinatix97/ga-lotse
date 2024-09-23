/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.api.commons.CanBeLogged;
import jakarta.validation.constraints.Future;
import java.time.Instant;

public record SelfAssignTaskRequest(@CanBeLogged @Future Instant dueAt) {}
