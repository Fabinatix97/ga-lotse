/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.department;

import de.eshg.base.config.DepartmentConfiguration;
import de.eshg.base.config.DepartmentConfigurationService;
import de.eshg.file.common.CustomMediaTypes;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Department")
public class DepartmentController implements DepartmentApi {
  private final DepartmentConfigurationService departmentConfigurationService;

  public DepartmentController(DepartmentConfigurationService departmentConfiguration) {
    this.departmentConfigurationService = departmentConfiguration;
  }

  @Override
  public GetDepartmentInfoResponse getDepartmentInfo() {
    return mapToResponse(departmentConfigurationService.getDepartmentConfiguration());
  }

  @Override
  public ResponseEntity<Resource> getDepartmentLogo() {
    // svg may contain JavaScript. Make sure the image comes from a trustworthy source.
    return ResponseEntity.ok()
        .contentType(CustomMediaTypes.IMAGE_SVG_XML)
        .body(
            new ByteArrayResource(
                departmentConfigurationService.getDepartmentConfiguration().getLogo()));
  }

  @Override
  public ResponseEntity<byte[]> getSecurityTxt() {
    byte[] securityTxt =
        departmentConfigurationService.getDepartmentConfiguration().getSecurityTxt();
    return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body(securityTxt);
  }

  @Override
  public ResponseEntity<byte[]> getSecurityTxtPublicKey() {
    byte[] securityTxt =
        departmentConfigurationService.getDepartmentConfiguration().getSecurityTxtPublicKey();
    return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body(securityTxt);
  }

  private GetDepartmentInfoResponse mapToResponse(DepartmentConfiguration departmentConfiguration) {
    return new GetDepartmentInfoResponse(
        departmentConfiguration.getName(),
        departmentConfiguration.getAbbreviation(),
        departmentConfiguration.getStreet(),
        departmentConfiguration.getHouseNumber(),
        departmentConfiguration.getPostalCode(),
        departmentConfiguration.getCity(),
        departmentConfiguration.getCountry(),
        departmentConfiguration.getPhoneNumber(),
        departmentConfiguration.getHomepage(),
        departmentConfiguration.getEmail(),
        mapLocationToApi(departmentConfiguration));
  }

  private static LocationDto mapLocationToApi(DepartmentConfiguration departmentConfiguration) {
    return new LocationDto(
        departmentConfiguration.getLatitude(), departmentConfiguration.getLongitude());
  }
}
