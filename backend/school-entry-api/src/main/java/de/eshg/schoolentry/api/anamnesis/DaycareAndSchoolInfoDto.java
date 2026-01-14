/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
