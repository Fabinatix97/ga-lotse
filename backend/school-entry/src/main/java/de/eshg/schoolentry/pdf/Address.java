/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf;

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
