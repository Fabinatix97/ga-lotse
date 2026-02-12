/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.document;

public record CertificateData(
    String firstName,
    String lastName,
    String dateOfBirth,
    String instructionDate,
    String street,
    String houseNumber,
    String postalCode,
    String city) {}
