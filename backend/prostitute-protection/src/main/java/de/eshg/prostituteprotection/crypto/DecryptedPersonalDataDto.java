/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.crypto;

import java.time.LocalDate;

public record DecryptedPersonalDataDto(String firstName, String lastName, LocalDate dateOfBirth) {}
