/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.pdf.coverletter;

import de.eshg.base.department.GetDepartmentInfoResponse;

public final class DepartmentInfoMapper {

  private DepartmentInfoMapper() {}

  public static DepartmentInfo toDepartmentInfo(GetDepartmentInfoResponse response) {
    return new DepartmentInfo(
        response.name(),
        response.abbreviation(),
        response.street(),
        response.houseNumber(),
        response.postalCode(),
        response.city(),
        response.phoneNumber(),
        response.homepage(),
        response.email());
  }
}
