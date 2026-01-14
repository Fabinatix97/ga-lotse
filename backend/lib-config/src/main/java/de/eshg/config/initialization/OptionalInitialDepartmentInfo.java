/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.initialization;

import de.eshg.config.spring.DepartmentInfoPropertyBinding;
import de.eshg.lib.common.CountryCode;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = DepartmentInfoPropertyBinding.DEFAULT_PROPERTY_PREFIX)
public record OptionalInitialDepartmentInfo(
    boolean useDepartmentInfoFromBaseModule,
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
    Double longitude)
    implements InitialDepartmentInfo {}
