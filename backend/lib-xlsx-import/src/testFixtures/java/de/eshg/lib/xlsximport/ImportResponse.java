/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;

public record ImportResponse(
    ResponseEntity<byte[]> responseEntity, String statistics, Resource file) {}
