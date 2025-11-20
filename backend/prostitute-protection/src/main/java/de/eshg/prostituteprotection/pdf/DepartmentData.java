/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
