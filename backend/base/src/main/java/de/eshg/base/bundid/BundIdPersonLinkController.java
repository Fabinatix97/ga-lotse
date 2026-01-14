/*
 * Copyright 2026 cronn GmbH
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
import de.eshg.rest.service.error.NotFoundException;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "BundIdPersonLink")
public class BundIdPersonLinkController implements BundIdPersonLinkApi {

  private final BundIdPersonLinkService bundIdPersonLinkService;
  private final PersonRepository personRepository;

  public BundIdPersonLinkController(
      BundIdPersonLinkService bundIdPersonLinkService, PersonRepository personRepository) {
    this.bundIdPersonLinkService = bundIdPersonLinkService;
    this.personRepository = personRepository;
  }

  @Override
  @Transactional
  public void createBundIdPersonLink(AddBundIdPersonLinkRequest request) {
    Person refPerson =
        personRepository
            .findByExternalId(request.referencePersonId())
            .orElseThrow(() -> new NotFoundException(PersonController.REFERENCE_PERSON_NOT_FOUND));

    bundIdPersonLinkService.addBundIdPersonLink(request.bpk2(), refPerson);
  }

  @Override
  @Transactional(readOnly = true)
  public GetReferencePersonResponse getReferencePersonLinkedToBundIdSelfUser() {
    String bpk2 = bundIdPersonLinkService.getBundIdSelfUserBPK2();
    Person referencePerson = bundIdPersonLinkService.getReferencePerson(bpk2);

    return PersonMapper.mapReferencePersonToApi(referencePerson);
  }
}
