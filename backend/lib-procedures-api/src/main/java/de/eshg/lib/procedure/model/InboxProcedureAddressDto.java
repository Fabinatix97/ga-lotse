/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.api.commons.CanBeLogged;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "InboxProcedureAddress")
public record InboxProcedureAddressDto(
    Integer postboxNumber,
    String street,
    String houseNumber,
    String addressAddition,
    @CanBeLogged String postalCode,
    @CanBeLogged String city,
    @CanBeLogged String country) {}
