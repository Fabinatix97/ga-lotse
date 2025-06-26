/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.pdf;

/** Data for the inspection report "inspection-report.ftlx". */
public record RepAddress(
    String name,
    String street,
    String addressAddition,
    String zipCode,
    String city,
    String phoneNumber,
    String mobilePhoneNumber,
    String url,
    String email) {}
