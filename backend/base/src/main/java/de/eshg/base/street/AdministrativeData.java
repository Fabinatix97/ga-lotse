/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

public record AdministrativeData(
    String localDistrict,
    String districtName,
    String cityDistrict,
    String cityDistrictPrefecture,
    String arbitratorsDistrict,
    String socialTownHallName,
    String policeStation,
    String postalCode,
    String municipalityKey) {}
