/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.testhelper;

import de.eshg.libservicedirectoryadminapi.api.impex.ExportResponse;
import de.eshg.libservicedirectoryadminapi.api.impex.ImportRequest;
import de.eshg.libservicedirectoryadminapi.api.staging.CommitResponseDto;
import de.eshg.libservicedirectoryadminapi.api.testhelper.OrgUnitPopulationRequest;
import de.eshg.libservicedirectoryadminapi.api.testhelper.OrgUnitPopulationResponse;
import de.eshg.libservicedirectoryadminapi.api.testhelper.ServiceDirectoryTestHelperApi;
import de.eshg.servicedirectory.ServiceDirectoryAdminService;
import de.eshg.servicedirectory.ServiceDirectoryReadService;
import de.eshg.servicedirectory.common.AdminNameHolder;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperController;
import java.util.Optional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ConditionalOnTestHelperEnabled
public class ServiceDirectoryTestHelperController extends TestHelperController
    implements ServiceDirectoryTestHelperApi {

  public static final String TEST_HELPER = "test-helper";

  private final ServiceDirectoryTestHelperService serviceDirectoryTestHelperService;
  private final ServiceDirectoryAdminService serviceDirectoryAdminService;
  private final ServiceDirectoryReadService serviceDirectoryReadService;

  public ServiceDirectoryTestHelperController(
      ServiceDirectoryTestHelperService testHelperService,
      ServiceDirectoryAdminService serviceDirectoryAdminService,
      ServiceDirectoryReadService serviceDirectoryReadService) {
    super(testHelperService);
    this.serviceDirectoryTestHelperService = testHelperService;
    this.serviceDirectoryAdminService = serviceDirectoryAdminService;
    this.serviceDirectoryReadService = serviceDirectoryReadService;
  }

  public CommitResponseDto commitStaged() {
    AdminNameHolder.setAdminName(TEST_HELPER);
    return serviceDirectoryTestHelperService.commitAllStaged();
  }

  @Override
  public OrgUnitPopulationResponse populateOrgUnits(OrgUnitPopulationRequest request) {
    AdminNameHolder.setAdminName(TEST_HELPER);

    return serviceDirectoryTestHelperService.populateOrgUnits(
        request.numberOfEntitiesToPopulate(),
        Optional.ofNullable(request.generateCertificates()).orElse(false));
  }

  @Override
  public ExportResponse getExport(boolean withCertificates) {
    AdminNameHolder.setAdminName(TEST_HELPER);

    return serviceDirectoryReadService.getAllForExport(withCertificates);
  }

  @Override
  public void postImport(ImportRequest toBeImported) {
    AdminNameHolder.setAdminName(TEST_HELPER);

    serviceDirectoryAdminService.importIntoEmptyDatabase(toBeImported);
  }
}
