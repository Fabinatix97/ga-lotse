/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.geo;

import de.eshg.inspection.geo.api.NominatimResponseItem;
import java.util.List;

public interface NominatimApi {

  List<NominatimResponseItem> fetch(String country, String city, String postalcode, String street);
}
