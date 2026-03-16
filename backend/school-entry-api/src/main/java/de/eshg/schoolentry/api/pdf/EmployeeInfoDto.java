/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.pdf;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "EmployeeInfo")
public record EmployeeInfoDto(
    String firstName,
    String lastName,
    String email,
    String phoneNumber,
    String salutation,
    String title) {}
