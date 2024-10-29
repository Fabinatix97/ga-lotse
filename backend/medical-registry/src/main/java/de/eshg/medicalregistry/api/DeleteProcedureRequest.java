/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import jakarta.validation.constraints.NotNull;

public record DeleteProcedureRequest(@NotNull long version) {}
