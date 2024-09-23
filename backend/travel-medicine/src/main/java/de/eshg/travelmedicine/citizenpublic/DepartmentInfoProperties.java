/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.citizenpublic;

import de.eshg.base.CountryCodeDto;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "de.eshg.travel-medicine.department-info")
public record DepartmentInfoProperties(
    String name,
    String abbreviation,
    String street,
    String houseNumber,
    String postalCode,
    String city,
    CountryCodeDto country,
    String phoneNumber,
    String homepage,
    String email,
    Double latitude,
    Double longitude) {}
