/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.centralfile;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesRequest;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesResponse;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.RelatedFacility;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class FacilityClient {

  private final FacilityApi facilityApi;

  public FacilityClient(FacilityApi facilityApi) {
    this.facilityApi = facilityApi;
  }

  public Map<UUID, AddFacilityFileStateResponse> fetchAllRelatedFacilities(
      List<MeaslesProtectionProcedure> procedures) {
    List<UUID> facilityIdsToFetch =
        procedures.stream()
            .map(Procedure::getRelatedFacilities)
            .flatMap(Collection::stream)
            .map(RelatedFacility::getCentralFileStateId)
            .toList();
    if (facilityIdsToFetch.isEmpty()) {
      return Collections.emptyMap();
    }

    GetFacilityFileStatesResponse response =
        facilityApi.getFacilityFileStates(new GetFacilityFileStatesRequest(facilityIdsToFetch));

    if (response.facilityFileStates().size() != facilityIdsToFetch.size()) {
      throw new IllegalStateException("Some facilities were not found in the central file.");
    }

    return response.facilityFileStates().stream()
        .collect(StreamUtil.toLinkedHashMap(AddFacilityFileStateResponse::id));
  }
}
