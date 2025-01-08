/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.citizenpublic;

import de.eshg.lib.common.CountryCode;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "de.eshg.official-medical-service.department-info")
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
