/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.config;

import de.eshg.lib.common.CountryCode;

public record DepartmentInfoProperties(
    String name,
    String abbreviation,
    String street,
    String houseNumber,
    String postalCode,
    String city,
    CountryCode country,
    String phoneNumber,
    String homepage,
    String email,
    Double latitude,
    Double longitude) {}
