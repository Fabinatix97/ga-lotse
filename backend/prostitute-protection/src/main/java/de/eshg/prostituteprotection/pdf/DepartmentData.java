/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.pdf;

import org.springframework.http.MediaType;

public record DepartmentData(
    String name,
    String street,
    String zipCode,
    String city,
    String url,
    String email,
    MediaType contentType,
    String contentAsBase64) {}
