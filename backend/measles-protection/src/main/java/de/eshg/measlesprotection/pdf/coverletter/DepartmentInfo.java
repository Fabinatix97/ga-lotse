/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.pdf.coverletter;

public record DepartmentInfo(
    String name,
    String abbreviation,
    String street,
    String houseNumber,
    String postalCode,
    String city,
    String phoneNumber,
    String homepage,
    String email) {}
