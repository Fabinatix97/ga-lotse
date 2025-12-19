/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry;

import de.eshg.base.centralfile.PersonApi;
import de.eshg.lib.procedure.procedures.AbstractProcedureSearchController;
import de.eshg.medicalregistry.api.MedicalRegistryEntrySearchResultDto;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import de.eshg.medicalregistry.domain.repository.MedicalRegistryProcedureRepository;
import de.eshg.medicalregistry.mapper.SearchProcedureByPersonMapper;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MedicalRegistrySearchController
    extends AbstractProcedureSearchController<
        MedicalRegistryProcedure,
        MedicalRegistryEntrySearchResultDto,
        SearchMedicalRegistryByPersonResponse> {

  protected MedicalRegistrySearchController(
      SearchProcedureByPersonMapper searchProcedureByPersonMapper,
      MedicalRegistryProcedureRepository medicalRegistryProcedureRepository,
      PersonApi personApi) {
    super(
        searchProcedureByPersonMapper,
        SearchMedicalRegistryByPersonResponse::new,
        medicalRegistryProcedureRepository,
        personApi);
  }
}
