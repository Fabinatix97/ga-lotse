/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence;

import java.time.LocalDate;

public record PersonKeyAttributes(String firstName, String lastName, LocalDate dateOfBirth) {}
