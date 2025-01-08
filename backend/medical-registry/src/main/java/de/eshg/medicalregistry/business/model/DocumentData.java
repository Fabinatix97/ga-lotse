/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.business.model;

import jakarta.annotation.Nullable;
import org.springframework.web.multipart.MultipartFile;

public record DocumentData(
    String fileName,
    String description,
    @Nullable MedicalRegistryKeyDocumentType keyDocumentType,
    MultipartFile file) {}
