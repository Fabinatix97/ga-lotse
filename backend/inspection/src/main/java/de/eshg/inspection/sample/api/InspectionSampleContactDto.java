/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.api;

import de.eshg.base.contact.api.ContactDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = InspectionSampleContactDto.SCHEMA_NAME)
public record InspectionSampleContactDto(@NotNull @Valid ContactDto contact)
    implements InspectionSampleActorDto {
  public static final String SCHEMA_NAME = "InspectionSampleContact";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
