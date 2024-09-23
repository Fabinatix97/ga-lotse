/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf;

public record Address(
    String name,
    String street,
    String zipCode,
    String city,
    String phoneNumber,
    String url,
    String addressAddition,
    String email) {}
