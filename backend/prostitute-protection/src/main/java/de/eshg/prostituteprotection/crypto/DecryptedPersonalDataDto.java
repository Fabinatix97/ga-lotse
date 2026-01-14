/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.crypto;

import java.time.LocalDate;

public record DecryptedPersonalDataDto(String firstName, String lastName, LocalDate dateOfBirth) {}
