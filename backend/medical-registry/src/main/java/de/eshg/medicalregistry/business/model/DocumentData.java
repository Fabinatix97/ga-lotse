/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.business.model;

import de.eshg.lib.procedure.domain.model.Image;
import jakarta.annotation.Nullable;

public record DocumentData(
    String description, @Nullable MedicalRegistryKeyDocumentType keyDocumentType, Image file) {}
