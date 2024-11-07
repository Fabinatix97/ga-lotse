/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.anamnesis;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(name = "DaycareAndSchoolInfo")
public record DaycareAndSchoolInfoDto(
    Boolean wasInDaycare, LocalDate inDaycareSince, String daycareName, String schoolName) {
  public DaycareAndSchoolInfoDto() {
    this(null, null, null, null);
  }
}
