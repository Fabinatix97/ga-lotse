/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.document.generator.department;

import org.springframework.http.MediaType;

public record DepartmentLogo(MediaType contentType, String contentAsBase64) {}
