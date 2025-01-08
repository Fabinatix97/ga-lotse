/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "InboxProcedureAddress")
public record InboxProcedureAddressDto(
    Integer postboxNumber,
    String street,
    String houseNumber,
    String addressAddition,
    String postalCode,
    String city,
    String country) {}
