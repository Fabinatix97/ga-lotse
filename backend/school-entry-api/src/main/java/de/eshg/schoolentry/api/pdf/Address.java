/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.pdf;

import java.util.List;

public record Address(
    String name,
    String street,
    String zipCode,
    String city,
    List<String> phoneNumber,
    String url,
    String addressAddition,
    List<String> email) {}
