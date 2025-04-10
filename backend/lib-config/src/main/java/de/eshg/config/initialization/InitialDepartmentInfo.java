/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.initialization;

import de.eshg.lib.common.CountryCode;

public interface InitialDepartmentInfo {

  String name();

  String abbreviation();

  String street();

  String houseNumber();

  String postalCode();

  String city();

  CountryCode country();

  String phoneNumber();

  String homepage();

  String email();

  Double latitude();

  Double longitude();
}
