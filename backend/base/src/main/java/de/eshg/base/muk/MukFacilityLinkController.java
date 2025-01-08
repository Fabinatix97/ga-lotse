/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.muk;

import de.eshg.base.centralfile.FacilityController;
import de.eshg.base.centralfile.api.facility.GetReferenceFacilityResponse;
import de.eshg.base.centralfile.mapper.FacilityMapper;
import de.eshg.base.centralfile.persistence.entity.Facility;
import de.eshg.base.centralfile.persistence.repository.FacilityRepository;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureToggle;
import de.eshg.base.muk.Api.AddMukFacilityLinkRequest;
import de.eshg.base.muk.persistence.MukFacilityLinkService;
import de.eshg.rest.service.error.NotFoundException;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "MukFacilityLink")
public class MukFacilityLinkController implements MukFacilityLinkApi {

  private final MukFacilityLinkService mukFacilityLinkService;
  private final BaseFeatureToggle featureToggle;
  private final FacilityRepository facilityRepository;

  public MukFacilityLinkController(
      MukFacilityLinkService mukFacilityLinkService,
      BaseFeatureToggle featureToggle,
      FacilityRepository facilityRepository) {
    this.mukFacilityLinkService = mukFacilityLinkService;
    this.featureToggle = featureToggle;
    this.facilityRepository = facilityRepository;
  }

  @Override
  @Transactional
  public void createMukFacilityLink(AddMukFacilityLinkRequest request) {
    featureToggle.assertNewFeatureIsEnabled(BaseFeature.MUK_FACILITY_LINK);

    Facility refFacility =
        facilityRepository
            .findByExternalId(request.referenceFacilityId())
            .orElseThrow(
                () -> new NotFoundException(FacilityController.FACILITY_REFERENCE_NOT_FOUND));

    mukFacilityLinkService.addMukFacilityLink(request.dataTransmitterPseudonymId(), refFacility);
  }

  @Override
  @Transactional
  public GetReferenceFacilityResponse getReferenceFacilityLinkedToMukSelfUser() {
    featureToggle.assertNewFeatureIsEnabled(BaseFeature.MUK_FACILITY_LINK);

    String dataTransmitterPseudonymId =
        mukFacilityLinkService.getMukSelfUserDataTransmitterPseudonymId();
    Facility referenceFacility =
        mukFacilityLinkService.getReferenceFacility(dataTransmitterPseudonymId);

    return FacilityMapper.mapReferenceFacilityToApi(referenceFacility);
  }
}
