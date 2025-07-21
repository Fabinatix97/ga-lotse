/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility;

import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.inspection.facility.api.GetPendingFacilitiesFilterOptionsDto;
import de.eshg.inspection.inspection.persistence.Inspection;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class FacilityFileNumberService {
  private final FacilityFileNumberConfiguration facilityFileNumberConfiguration;
  private final FacilityClient facilityClient;

  public FacilityFileNumberService(
      FacilityFileNumberConfiguration facilityFileNumberConfiguration,
      FacilityClient facilityClient) {
    this.facilityFileNumberConfiguration = facilityFileNumberConfiguration;
    this.facilityClient = facilityClient;
  }

  public String getFileNumber(GetFacilityFileStateResponse baseFacility) {
    return facilityClient
        .getFacilityFileNumber(baseFacility.id(), facilityFileNumberConfiguration.getMethod())
        .fileNumber();
  }

  public String getFileNumber(Inspection inspection) {
    return facilityClient
        .getFacilityFileNumber(
            inspection.getCentralFileStateId(), facilityFileNumberConfiguration.getMethod())
        .fileNumber();
  }

  public String getFileNumber(AddFacilityFileStateResponse baseFacility) {
    return facilityClient
        .getFacilityFileNumber(baseFacility.id(), facilityFileNumberConfiguration.getMethod())
        .fileNumber();
  }

  public List<GetFacilityFileStateResponse> getFileStates(
      GetPendingFacilitiesFilterOptionsDto filterOptions) {
    return facilityClient
        .getFacilityFileStatesByFileNumber(
            filterOptions.fileNumber(), facilityFileNumberConfiguration.getMethod())
        .facilityFileStates();
  }

  public String getFileNumber(GetFacilityFileStateResponse baseFacility, Integer fileNumberSuffix) {
    String fileNumber = getFileNumber(baseFacility);
    if (fileNumber != null && fileNumberSuffix != null) {
      fileNumber += "-" + fileNumberSuffix;
    }
    return fileNumber;
  }
}
