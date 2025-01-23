/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.business.model;

import de.eshg.lib.procedure.domain.model.Image;
import jakarta.annotation.Nullable;

public record DocumentData(
    String description, @Nullable MedicalRegistryKeyDocumentType keyDocumentType, Image file) {}
