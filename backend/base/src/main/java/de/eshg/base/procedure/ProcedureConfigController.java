/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.procedure;

import de.eshg.lib.procedure.model.ManualProgressEntryTypeDto;
import de.eshg.rest.service.security.config.BaseUrls.Base;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.EnumSet;
import java.util.Objects;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@RestController
@Tag(name = "ProcedureConfig")
@HttpExchange(Base.PROCEDURE_CONFIG_API)
public class ProcedureConfigController {

  private final Set<ManualProgressEntryTypeDto> supportedManualProgressEntryTypes;

  public ProcedureConfigController(
      @Value("${eshg.procedure.supported-manual-progress-entry-types:#{null}}")
          Set<ManualProgressEntryTypeDto> supportedManualProgressEntryTypes) {
    this.supportedManualProgressEntryTypes = supportedManualProgressEntryTypes;
  }

  @GetExchange
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get lib procedure configuration")
  public GetProcedureConfigResponse getProcedureConfig() {
    return new GetProcedureConfigResponse(
        Objects.requireNonNullElseGet(
            supportedManualProgressEntryTypes,
            () -> EnumSet.allOf(ManualProgressEntryTypeDto.class)));
  }
}
