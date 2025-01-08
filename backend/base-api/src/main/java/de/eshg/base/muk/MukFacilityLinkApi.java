/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.muk;

import de.eshg.base.centralfile.api.facility.GetReferenceFacilityResponse;
import de.eshg.base.muk.Api.AddMukFacilityLinkRequest;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(url = MukFacilityLinkApi.BASE_URL)
public interface MukFacilityLinkApi {

  String BASE_URL = BaseUrls.Base.MUK_FACILITY_LINK_API;

  @PostExchange()
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Establish a link between a MUK user and a facility")
  void createMukFacilityLink(@RequestBody @Valid AddMukFacilityLinkRequest request);

  @GetExchange(BaseUrls.Base.MUK_SELF_USER_FACILITY)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary = "Get the reference facility linked to the MUK user which is currently active")
  GetReferenceFacilityResponse getReferenceFacilityLinkedToMukSelfUser();
}
