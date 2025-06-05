/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

public record AdministrativeData(
    String streetNumber, String districtName, String cityDistrict, String municipalityKey) {}
