/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record ContactAddressReference(
    @Schema(description = "The reference Id of the address of a Contact.", example = "723") @NotNull
        long addressId,
    @Schema(description = "List of possible usages for an address.") @NotNull
        ContactAddressUsage usage) {}
