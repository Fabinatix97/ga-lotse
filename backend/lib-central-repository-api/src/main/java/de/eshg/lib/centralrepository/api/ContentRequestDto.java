/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.centralrepository.api;

import java.sql.Blob;

public record ContentRequestDto(String contentType, String jsonContent, Blob blobContent) {}
