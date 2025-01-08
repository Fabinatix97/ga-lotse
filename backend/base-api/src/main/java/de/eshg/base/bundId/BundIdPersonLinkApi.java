/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.bundId;

import de.eshg.base.bundId.api.AddBundIdPersonLinkRequest;
import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(url = BundIdPersonLinkApi.BASE_URL)
public interface BundIdPersonLinkApi {

  String BASE_URL = BaseUrls.Base.BUNDID_PERSON_LINK_API;

  @PostExchange
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Establish a link between a BundId user and a person")
  void createBundIdPersonLink(@RequestBody @Valid AddBundIdPersonLinkRequest request);

  @GetExchange(BaseUrls.Base.BUNDID_SELF_USER_PERSON)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary = "Get the reference person linked to the BUNDID user which is currently active")
  GetReferencePersonResponse getReferencePersonLinkedToBundIdSelfUser();
}
