/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.schoolinfoletter;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "SchoolInfoLetterParentsWish")
public record SchoolInfoLetterParentsWishDto(
    String note, @NotNull boolean referredToFurtherConsultationFromSchool) {}
