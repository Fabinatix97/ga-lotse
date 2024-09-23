/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccine.api;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record InventoryVaccineWithoutRmbiVaccine(@NotNull UUID id, @NotNull String name) {}
