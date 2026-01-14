/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.testhelper;

import de.eshg.libservicedirectoryadminapi.api.impex.ExportResponse;
import de.eshg.libservicedirectoryadminapi.api.impex.ImportRequest;
import de.eshg.libservicedirectoryadminapi.api.staging.CommitResponseDto;
import de.eshg.testhelper.TestHelperApi;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(TestHelperApi.BASE_URL)
public interface ServiceDirectoryTestHelperApi extends TestHelperApi {

  @Operation(operationId = "testHelperCommitStaged")
  @PostExchange("/commit-staged")
  CommitResponseDto commitStaged();

  @PostExchange("/population/org-units")
  OrgUnitPopulationResponse populateOrgUnits(@Valid @RequestBody OrgUnitPopulationRequest request);

  @Operation(operationId = "testHelperExport")
  @GetExchange(value = "/export")
  ExportResponse getExport(@RequestParam(defaultValue = "false") boolean withCertificates);

  @Operation(operationId = "testHelperImport")
  @PostExchange(value = "/import", accept = "application/json")
  void postImport(@Valid @RequestBody ImportRequest toBeImported);
}
