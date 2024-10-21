/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.pdf.identification;

public record Department(
    String name,
    String abbreviation,
    String street,
    String houseNumber,
    String postalCode,
    String city,
    String phoneNumber,
    String homepage,
    String email) {}
