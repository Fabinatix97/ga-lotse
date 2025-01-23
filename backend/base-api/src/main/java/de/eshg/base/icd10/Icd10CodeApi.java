/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.icd10;

import de.eshg.base.icd10.api.FindIcd10CodesRequest;
import de.eshg.base.icd10.api.FindIcd10CodesResponse;
import de.eshg.base.icd10.api.SearchIcd10CodesResponse;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(Icd10CodeApi.BASE_URL)
public interface Icd10CodeApi {

  String BASE_URL = BaseUrls.Base.ICD_10_CODES_API;

  @GetExchange
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Search in the ICD-10 catalogue.")
  SearchIcd10CodesResponse searchIcd10Codes(
      @RequestParam(name = "searchString", required = false, defaultValue = "")
          @Schema(
              description =
                  "Search for a string within the ICD-10 codes, groups and their title. The search supports a fuzzy search mechanism.")
          String searchString,
      @RequestParam(name = "codes", required = false, defaultValue = "") List<String> codes);

  @PostExchange
  FindIcd10CodesResponse findAllIcd10Codes(@Valid @RequestBody FindIcd10CodesRequest request);
}
