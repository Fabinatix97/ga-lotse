/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.document.generator.department;

import de.eshg.base.department.DepartmentApi;
import de.eshg.base.department.GetDepartmentInfoResponse;
import java.io.IOException;
import java.util.Base64;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
public class DepartmentClient {

  private final DepartmentApi departmentApi;
  private GetDepartmentInfoResponse cachedDepartmentInfo;
  private DepartmentLogo cachedDepartmentLogo;

  public DepartmentClient(DepartmentApi departmentApi) {
    this.departmentApi = departmentApi;
  }

  public GetDepartmentInfoResponse getDepartmentInfo() {
    if (cachedDepartmentInfo == null) {
      cachedDepartmentInfo = departmentApi.getDepartmentInfo();
    }
    return cachedDepartmentInfo;
  }

  public DepartmentLogo getDepartmentLogo() {
    if (cachedDepartmentLogo == null) {
      cachedDepartmentLogo = fetchDepartmentLogo();
    }
    return cachedDepartmentLogo;
  }

  public DepartmentLogo fetchDepartmentLogo() {
    ResponseEntity<Resource> departmentLogoResponse = departmentApi.getDepartmentLogo();
    Assert.isTrue(
        departmentLogoResponse.getStatusCode().equals(HttpStatus.OK),
        () ->
            "Failed to fetch the department logo: Response status: "
                + departmentLogoResponse.getStatusCode());
    Resource logoData = departmentLogoResponse.getBody();
    Assert.notNull(logoData, "Failed to fetch the department logo. Response body is null");
    try {
      return new DepartmentLogo(
          departmentLogoResponse.getHeaders().getContentType(),
          Base64.getEncoder().encodeToString(logoData.getContentAsByteArray()));
    } catch (IOException e) {
      throw new RuntimeException("Failed to read department logo from response", e);
    }
  }
}
