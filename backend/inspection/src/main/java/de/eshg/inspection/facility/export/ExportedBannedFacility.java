/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.export;

import java.time.LocalDate;

public record ExportedBannedFacility(
    String name,
    LocalDate dateOfBanning,
    String objectType,
    String postalCode,
    String city,
    String street,
    String houseNumber,
    String phoneNumber,
    String emailAddress) {}
