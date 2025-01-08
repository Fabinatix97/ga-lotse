/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.citizenpublic;

import de.eshg.lib.common.CountryCode;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "de.eshg.travel-medicine.department-info")
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
