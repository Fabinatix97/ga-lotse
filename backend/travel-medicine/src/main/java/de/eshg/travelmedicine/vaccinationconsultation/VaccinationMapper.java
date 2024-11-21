/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.travelmedicine.util.MappingUtil;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostVaccinationRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.VaccinationDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.VaccinationTypeDto;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.Vaccination;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationType;
import de.eshg.travelmedicine.vaccine.persistence.entity.Vaccine;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class VaccinationMapper {

  public Vaccination toDomainType(
      PostVaccinationRequest postVaccinationRequest, Vaccine vaccine, VaccinationConsultation vc) {
    int vaccinationNumber = postVaccinationRequest.vaccinationNumber();
    List<Integer> latencies = vaccine.getOffsets().stream().sorted().toList();
    Integer latency = null;
    if (vaccinationNumber > 1 && latencies.size() > vaccinationNumber - 2) {
      latency = latencies.get(vaccinationNumber - 2);
    }
    String defaultBatchIdentifier = vaccine.getCurrentBatchId();
    return new Vaccination(
        vc,
        vaccine.getDisease().getName(),
        vaccine.getName(),
        vaccine.getInventoryVaccineId(),
        vaccine.getFee(),
        MappingUtil.mapEnum(VaccinationType.class, postVaccinationRequest.vaccinationType()),
        vaccinationNumber,
        latency,
        defaultBatchIdentifier);
  }

  public VaccinationDto toInterfaceType(Vaccination vaccination) {
    return new VaccinationDto(
        vaccination.getId(),
        vaccination.getDiseaseName(),
        vaccination.getVaccineName(),
        MappingUtil.mapEnum(VaccinationTypeDto.class, vaccination.getVaccinationType()),
        vaccination.getVaccinationNumber(),
        vaccination.getBatchIdentifier(),
        vaccination.getDefaultBatchIdentifier(),
        vaccination.getAppliedAt(),
        vaccination.getCreatedAt(),
        vaccination.getModifiedAt());
  }
}
