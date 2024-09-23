/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccine;

import static de.eshg.base.inventory.api.InventoryItemTypeDto.VACCINE;
import static de.eshg.rest.service.security.CurrentUserHelper.getCurrentUserId;

import de.eshg.base.inventory.InventoryApi;
import de.eshg.base.inventory.api.GetInventoryItemsResponse;
import de.eshg.base.inventory.api.InventoryItemDto;
import de.eshg.base.inventory.api.InventoryItemFilterParameters;
import de.eshg.rest.service.error.AlreadyExistsException;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.travelmedicine.disease.persistence.entity.Disease;
import de.eshg.travelmedicine.disease.persistence.entity.DiseaseRepository;
import de.eshg.travelmedicine.util.Validators;
import de.eshg.travelmedicine.vaccine.api.GetInventoryVaccinesWithoutRmbiVaccineResponse;
import de.eshg.travelmedicine.vaccine.api.GetVaccinesResponse;
import de.eshg.travelmedicine.vaccine.api.InventoryVaccineWithoutRmbiVaccine;
import de.eshg.travelmedicine.vaccine.api.PostPutVaccineRequest;
import de.eshg.travelmedicine.vaccine.api.VaccineDto;
import de.eshg.travelmedicine.vaccine.persistence.entity.Vaccine;
import de.eshg.travelmedicine.vaccine.persistence.entity.VaccineRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class VaccineService {
  private final VaccineRepository vaccineRepository;
  private final DiseaseRepository diseaseRepository;
  private final InventoryApi inventoryApi;

  public VaccineService(
      VaccineRepository vaccineRepository,
      DiseaseRepository diseaseRepository,
      InventoryApi inventoryApi) {
    this.vaccineRepository = vaccineRepository;
    this.diseaseRepository = diseaseRepository;
    this.inventoryApi = inventoryApi;
  }

  public GetVaccinesResponse getVaccines() {
    List<VaccineDto> vaccineDtoList =
        vaccineRepository.findAll().stream()
            .map(VaccineMapper::toInterfaceType)
            .sorted(Comparator.comparing(VaccineDto::name))
            .toList();
    return new GetVaccinesResponse(vaccineDtoList);
  }

  public GetInventoryVaccinesWithoutRmbiVaccineResponse getInventoryVaccinesWithoutRMBIVaccine() {
    List<InventoryItemDto> inventoryItems = getInventoryVaccines();
    GetVaccinesResponse vaccines = getVaccines();
    List<UUID> usedUUIDs =
        vaccines.vaccines().stream().map(VaccineDto::inventoryVaccineId).toList();
    List<InventoryVaccineWithoutRmbiVaccine> unusedInventoryVaccines =
        inventoryItems.stream()
            .filter(inventoryItem -> !usedUUIDs.contains(inventoryItem.id()))
            .map(
                inventoryItem ->
                    new InventoryVaccineWithoutRmbiVaccine(
                        inventoryItem.id(), inventoryItem.name()))
            .toList();
    return new GetInventoryVaccinesWithoutRmbiVaccineResponse(unusedInventoryVaccines);
  }

  private Vaccine retrieveVaccineFromRepo(UUID id) {
    return vaccineRepository
        .findById(id)
        .orElseThrow(() -> new NotFoundException("Vaccine not found"));
  }

  private Disease retrieveDiseaseFromRepo(UUID diseaseId) {
    return diseaseRepository
        .findById(diseaseId)
        .orElseThrow(() -> new BadRequestException("No such disease: " + diseaseId));
  }

  public VaccineDto getOneVaccine(UUID id) {
    Vaccine vaccine = retrieveVaccineFromRepo(id);
    return VaccineMapper.toInterfaceType(vaccine);
  }

  public VaccineDto addVaccine(PostPutVaccineRequest request) {
    String name = request.name().trim();
    Optional<Vaccine> found = vaccineRepository.findByName(name);
    if (found.isPresent()) throw new AlreadyExistsException("Vaccine exists: " + name);

    checkInventoryId(request.inventoryVaccineId());
    UUID diseaseId = request.diseaseId();
    final Disease disease = retrieveDiseaseFromRepo(diseaseId);

    Optional<Vaccine> optionalVaccine =
        vaccineRepository.findByInventoryVaccineId(request.inventoryVaccineId());
    if (optionalVaccine.isPresent()) {
      throw new BadRequestException(
          "Given inventory vaccine is already used by vaccine " + optionalVaccine.get().getId());
    }

    validateOffsets(request.offsets());
    Vaccine vaccine = VaccineMapper.toDomainType(request, disease);

    vaccineRepository.save(vaccine);

    return VaccineMapper.toInterfaceType(vaccine);
  }

  public VaccineDto modifyVaccine(UUID id, PostPutVaccineRequest request) {
    Vaccine vaccine = retrieveVaccineFromRepo(id);

    String newName = request.name();
    Optional<Vaccine> foundByName = vaccineRepository.findByName(newName);
    if (foundByName.isPresent() && !foundByName.get().getId().equals(id))
      throw new AlreadyExistsException("Vaccine exists: " + newName);

    UUID newInventoryVaccineId = request.inventoryVaccineId();
    if (!newInventoryVaccineId.equals(vaccine.getInventoryVaccineId())) {
      checkInventoryId(newInventoryVaccineId);
    }

    Optional<Vaccine> foundByInventoryVaccine =
        vaccineRepository.findByInventoryVaccineId(newInventoryVaccineId);
    if (foundByInventoryVaccine.isPresent() && foundByInventoryVaccine.get().getId() != id) {
      throw new BadRequestException(
          "Given inventory vaccine is already used by vaccine "
              + foundByInventoryVaccine.get().getId());
    }

    validateOffsets(request.offsets());
    String currentBatchId = Validators.validateBatchId(request.currentBatchId());

    vaccine.setName(newName);
    UUID diseaseId = request.diseaseId();
    Disease disease = retrieveDiseaseFromRepo(diseaseId);

    vaccine.setDisease(disease);
    vaccine.setOffsets(request.offsets());
    vaccine.setFee(request.fee());
    vaccine.setInventoryVaccineId(newInventoryVaccineId);
    vaccine.setCurrentBatchId(currentBatchId);
    vaccine.setModifiedBy(getCurrentUserId());

    vaccineRepository.flush();

    return VaccineMapper.toInterfaceType(vaccine);
  }

  private void validateOffsets(List<Integer> offsets) {
    int lastOffset = 0;
    for (Integer offset : offsets) {
      if (offset == null) {
        throw new BadRequestException("Offset must be a non-null Integer");
      }
      if (offset <= lastOffset) {
        throw new BadRequestException("Offset must increase compared to last offset");
      }
      lastOffset = offset;
    }
  }

  public void deleteVaccine(UUID id) {
    Vaccine vaccine =
        vaccineRepository
            .findById(id)
            .orElseThrow(() -> new NotFoundException("Vaccine not found: " + id));
    vaccineRepository.delete(vaccine);
  }

  private List<InventoryItemDto> getInventoryVaccines() {
    GetInventoryItemsResponse response =
        inventoryApi.getInventoryItems(
            new InventoryItemFilterParameters(null, VACCINE, null, null, null, null, null));
    return response.elements();
  }

  private void checkInventoryId(UUID inventoryId) {
    if (getInventoryVaccines().stream().map(InventoryItemDto::id).noneMatch(inventoryId::equals)) {
      throw new BadRequestException("inventoryVaccineId is unknown in inventory");
    }
  }
}
