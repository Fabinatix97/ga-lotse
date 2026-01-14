/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility;

import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.inspection.config.InspectionPropertiesConfigService;
import de.eshg.inspection.config.persistence.FacilityFileNumberMethod;
import de.eshg.inspection.facility.api.GetPendingFacilitiesFilterOptionsDto;
import de.eshg.inspection.inspection.persistence.Inspection;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class FacilityFileNumberService {
  private final FacilityClient facilityClient;
  private final InspectionPropertiesConfigService inspectionPropertiesConfigService;

  public FacilityFileNumberService(
      FacilityClient facilityClient,
      InspectionPropertiesConfigService inspectionPropertiesConfigService) {
    this.facilityClient = facilityClient;
    this.inspectionPropertiesConfigService = inspectionPropertiesConfigService;
  }

  public String getFileNumber(GetFacilityFileStateResponse baseFacility) {
    return facilityClient
        .getFacilityFileNumber(baseFacility.id(), getCurrentFileNumberMethod())
        .fileNumber();
  }

  public String getFileNumber(Inspection inspection) {
    return facilityClient
        .getFacilityFileNumber(inspection.getCentralFileStateId(), getCurrentFileNumberMethod())
        .fileNumber();
  }

  public String getFileNumber(AddFacilityFileStateResponse baseFacility) {
    return facilityClient
        .getFacilityFileNumber(baseFacility.id(), getCurrentFileNumberMethod())
        .fileNumber();
  }

  public List<GetFacilityFileStateResponse> getFileStates(
      GetPendingFacilitiesFilterOptionsDto filterOptions) {
    return facilityClient
        .getFacilityFileStatesByFileNumber(filterOptions.fileNumber(), getCurrentFileNumberMethod())
        .facilityFileStates();
  }

  public String getFileNumber(GetFacilityFileStateResponse baseFacility, Integer fileNumberSuffix) {
    String fileNumber = getFileNumber(baseFacility);
    if (fileNumber != null && fileNumberSuffix != null) {
      fileNumber += "-" + fileNumberSuffix;
    }
    return fileNumber;
  }

  public FacilityFileNumberMethod getCurrentFileNumberMethod() {
    return inspectionPropertiesConfigService.getConfiguration().getFacilityFileNumberMethod();
  }
}
