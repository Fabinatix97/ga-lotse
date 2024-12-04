/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper;

import de.eshg.officialmedicalservice.procedure.EmployeeOmsProcedureService;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureRequest;
import de.eshg.officialmedicalservice.testhelper.api.PostPopulateProcedureRequest;
import de.eshg.officialmedicalservice.testhelper.api.PostPopulateProcedureResponse;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import jakarta.transaction.Transactional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnTestHelperEnabled
public class TestPopulateProcedureService {

  private final EmployeeOmsProcedureService employeeOmsProcedureService;
  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;

  public TestPopulateProcedureService(
      EmployeeOmsProcedureService employeeOmsProcedureService,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper) {
    this.employeeOmsProcedureService = employeeOmsProcedureService;
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
  }

  @Transactional
  public PostPopulateProcedureResponse populateProcedure(PostPopulateProcedureRequest request) {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> {
          // 0. create blank response data
          UUID procedureId;

          // 1. create procedure
          procedureId =
              employeeOmsProcedureService.createEmployeeProcedure(
                  new PostEmployeeOmsProcedureRequest());

          return new PostPopulateProcedureResponse(procedureId);
        });
  }
}
