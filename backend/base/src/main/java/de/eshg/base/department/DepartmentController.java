/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.department;

import de.base.rest.CustomMediaTypes;
import de.eshg.base.CountryCodeDto;
import de.eshg.base.util.CountryCode;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Department")
public class DepartmentController implements DepartmentApi {
  private final DepartmentConfiguration departmentConfiguration;

  public DepartmentController(DepartmentConfiguration departmentConfiguration) {
    this.departmentConfiguration = departmentConfiguration;
  }

  @Override
  public GetDepartmentInfoResponse getDepartmentInfo() {
    return mapToResponse(departmentConfiguration);
  }

  @Override
  public ResponseEntity<Resource> getDepartmentLogo() {
    // svg may contain JavaScript. Make sure the image comes from a trustworthy source.
    return ResponseEntity.ok()
        .contentType(CustomMediaTypes.IMAGE_SVG_XML)
        .body(departmentConfiguration.logo());
  }

  @Override
  public ResponseEntity<byte[]> getSecurityTxt() {
    try {
      byte[] securityTxt = departmentConfiguration.securityTxt().getContentAsByteArray();
      return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body(securityTxt);
    } catch (IOException e) {
      throw new RuntimeException("Could not read security txt file.", e);
    }
  }

  @Override
  public ResponseEntity<byte[]> getSecurityTxtPublicKey() {
    try {
      byte[] securityTxt = departmentConfiguration.securityTxtPublicKey().getContentAsByteArray();
      return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body(securityTxt);
    } catch (IOException e) {
      throw new RuntimeException("Could not read security txt public key file.", e);
    }
  }

  private GetDepartmentInfoResponse mapToResponse(DepartmentConfiguration departmentConfig) {
    return new GetDepartmentInfoResponse(
        departmentConfig.name(),
        departmentConfig.abbreviation(),
        departmentConfig.street(),
        departmentConfig.houseNumber(),
        departmentConfig.postalCode(),
        departmentConfig.city(),
        mapCountryCodeToApi(departmentConfig.country()),
        departmentConfig.phoneNumber(),
        departmentConfig.homepage(),
        departmentConfig.email(),
        mapLocationToApi(departmentConfig));
  }

  private static LocationDto mapLocationToApi(DepartmentConfiguration departmentConfig) {
    return new LocationDto(departmentConfig.latitude(), departmentConfig.longitude());
  }

  private static CountryCodeDto mapCountryCodeToApi(CountryCode country) {
    return CountryCodeDto.valueOf(country.name());
  }
}
