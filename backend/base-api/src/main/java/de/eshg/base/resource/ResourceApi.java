/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.resource;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.base.resource.api.*;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PatchExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(url = ResourceApi.BASE_URL)
public interface ResourceApi {

  String BASE_URL = BaseUrls.Base.RESOURCES_API;

  @PostExchange
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Add a new resource")
  ResourceDto addResource(@RequestBody @Valid AddResourceRequest request);

  @GetExchange("/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get a resource")
  ResourceDto getResource(
      @Parameter(description = "Id of the Resource") @PathVariable("id") UUID id);

  @GetExchange
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
           Search resources. Filter results by the optional parameters 'name', 'type' and 'label'. Sort and page the
           results by default values or by optional parameters
          """)
  GetResourcesResponse getResources(
      @InlineParameterObject @ParameterObject @Valid ResourceFilterParameters parameters);

  @PatchExchange("/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
           Update a resource. Any provided label names will be used to resolve existing labels from the database,
           use the same name where applicable
          """)
  ResourceDto updateResource(
      @Parameter(description = "Id of the Resource") @PathVariable("id") UUID id,
      @RequestBody @Valid UpdateResourceRequest request);
}
