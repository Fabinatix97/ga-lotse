/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.label;

import de.eshg.base.label.api.AddLabelRequest;
import de.eshg.base.label.api.GetLabelsResponse;
import de.eshg.base.label.api.LabelDto;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PutExchange;

@HttpExchange(url = LabelApi.BASE_URL)
public interface LabelApi {

  String BASE_URL = BaseUrls.Base.LABEL_API;

  @PutExchange
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Idempotently add a label, returning existing label if one with the same name exists")
  LabelDto addLabel(@RequestBody @Valid AddLabelRequest request);

  @GetExchange("/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get a label")
  LabelDto getLabel(@Parameter(description = "The Id of the label.") @PathVariable("id") UUID id);

  @GetExchange
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Search labels. Filter results by the optional parameter 'name'. Results are sorted in ascending order")
  GetLabelsResponse getLabels(
      @Parameter(description = "The name of the label which shall be searched for.")
          @RequestParam(name = "name", required = false)
          String name);
}
