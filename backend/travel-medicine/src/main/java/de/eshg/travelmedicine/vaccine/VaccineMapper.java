/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccine;

import static de.eshg.rest.service.security.CurrentUserHelper.getCurrentUserId;

import de.eshg.travelmedicine.disease.DiseaseMapper;
import de.eshg.travelmedicine.disease.api.DiseaseDto;
import de.eshg.travelmedicine.disease.persistence.entity.Disease;
import de.eshg.travelmedicine.util.Validators;
import de.eshg.travelmedicine.vaccine.api.PostPutVaccineRequest;
import de.eshg.travelmedicine.vaccine.api.VaccineDto;
import de.eshg.travelmedicine.vaccine.persistence.entity.Vaccine;

public class VaccineMapper {

  private VaccineMapper() {}

  public static VaccineDto toInterfaceType(Vaccine vaccine) {
    DiseaseDto diseaseDto = DiseaseMapper.toInterfaceType(vaccine.getDisease());
    int numVaccinations = vaccine.getOffsets().size() + 1;

    return new VaccineDto(
        vaccine.getId(),
        vaccine.getName(),
        diseaseDto,
        numVaccinations,
        vaccine.getOffsets(),
        vaccine.getFee(),
        vaccine.getInventoryVaccineId(),
        vaccine.getCreatedAt(),
        vaccine.getModifiedAt(),
        vaccine.getCurrentBatchId());
  }

  public static Vaccine toDomainType(PostPutVaccineRequest postPutVaccineRequest, Disease disease) {
    String batchId = Validators.validateBatchId(postPutVaccineRequest.currentBatchId());

    Vaccine vaccine = new Vaccine();
    vaccine.setName(postPutVaccineRequest.name());
    vaccine.setDisease(disease);
    vaccine.setOffsets(postPutVaccineRequest.offsets());
    vaccine.setFee(postPutVaccineRequest.fee());
    vaccine.setInventoryVaccineId(postPutVaccineRequest.inventoryVaccineId());
    vaccine.setModifiedBy(getCurrentUserId());
    vaccine.setCurrentBatchId(batchId);
    return vaccine;
  }
}
