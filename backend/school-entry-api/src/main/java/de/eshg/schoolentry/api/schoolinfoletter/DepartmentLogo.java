/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.schoolinfoletter;

import org.springframework.http.MediaType;

public record DepartmentLogo(MediaType contentType, String contentAsBase64) {}
