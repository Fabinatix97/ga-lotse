/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.bundid;

import de.eshg.base.bundId.BundIdPersonLinkApi;
import de.eshg.base.bundId.api.AddBundIdPersonLinkRequest;
import de.eshg.base.bundid.persistence.BundIdPersonLinkService;
import de.eshg.base.centralfile.PersonController;
import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import de.eshg.base.centralfile.mapper.PersonMapper;
import de.eshg.base.centralfile.persistence.entity.Person;
import de.eshg.base.centralfile.persistence.repository.PersonRepository;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureToggle;
import de.eshg.rest.service.error.NotFoundException;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "BundIdPersonLink")
public class BundIdPersonLinkController implements BundIdPersonLinkApi {

  private final BundIdPersonLinkService bundIdPersonLinkService;
  private final BaseFeatureToggle featureToggle;
  private final PersonRepository personRepository;

  public BundIdPersonLinkController(
      BundIdPersonLinkService bundIdPersonLinkService,
      BaseFeatureToggle featureToggle,
      PersonRepository personRepository) {
    this.bundIdPersonLinkService = bundIdPersonLinkService;
    this.featureToggle = featureToggle;
    this.personRepository = personRepository;
  }

  @Override
  @Transactional
  public void createBundIdPersonLink(AddBundIdPersonLinkRequest request) {
    featureToggle.assertNewFeatureIsEnabled(BaseFeature.BUNDID_PERSON_LINK);

    Person refPerson =
        personRepository
            .findByExternalId(request.referencePersonId())
            .orElseThrow(() -> new NotFoundException(PersonController.REFERENCE_PERSON_NOT_FOUND));

    bundIdPersonLinkService.addBundIdPersonLink(request.bundId(), refPerson);
  }

  @Override
  @Transactional
  public GetReferencePersonResponse getReferencePersonLinkedToBundIdSelfUser() {
    featureToggle.assertNewFeatureIsEnabled(BaseFeature.BUNDID_PERSON_LINK);

    String bundId = bundIdPersonLinkService.getBundIdSelfUserId();
    Person referencePerson = bundIdPersonLinkService.getReferencePersons(bundId);

    return PersonMapper.mapReferencePersonToApi(referencePerson);
  }
}
