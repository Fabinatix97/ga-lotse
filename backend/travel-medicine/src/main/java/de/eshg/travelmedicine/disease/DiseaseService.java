/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.disease;

import de.eshg.rest.service.error.AlreadyExistsException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.travelmedicine.disease.api.DiseaseDto;
import de.eshg.travelmedicine.disease.api.GetDiseasesResponse;
import de.eshg.travelmedicine.disease.api.PostPutDiseaseRequest;
import de.eshg.travelmedicine.disease.persistence.entity.Disease;
import de.eshg.travelmedicine.disease.persistence.entity.DiseaseRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class DiseaseService {
  private final DiseaseRepository diseaseRepository;

  public DiseaseService(DiseaseRepository diseaseRepository) {
    this.diseaseRepository = diseaseRepository;
  }

  public GetDiseasesResponse getDiseases() {
    List<DiseaseDto> diseaseDtos =
        diseaseRepository.findAll().stream()
            .map(DiseaseMapper::toInterfaceType)
            .sorted(Comparator.comparing(DiseaseDto::name))
            .toList();
    return new GetDiseasesResponse(diseaseDtos);
  }

  public GetDiseasesResponse getPublicDiseases() {
    List<DiseaseDto> diseaseDtos =
        diseaseRepository.findByVisibleToCitizenPortalTrue().stream()
            .map(DiseaseMapper::toInterfaceType)
            .sorted(Comparator.comparing(DiseaseDto::name))
            .toList();
    return new GetDiseasesResponse(diseaseDtos);
  }

  public DiseaseDto getDisease(UUID id) {
    Disease disease = retrieveDiseaseFromRepo(id);
    return DiseaseMapper.toInterfaceType(disease);
  }

  public DiseaseDto createDisease(PostPutDiseaseRequest request) {
    String name = request.diseaseName().trim();
    diseaseRepository
        .findByName(name)
        .ifPresent(
            existingDisease -> {
              throw new AlreadyExistsException("Disease exists: " + name);
            });
    Disease newDisease = new Disease();
    newDisease.setName(name);
    newDisease.setEstimatedFee(request.estimatedFee());
    newDisease.setVisibleToCitizenPortal((request.visibleToCitizenPortal()));
    diseaseRepository.save(newDisease);
    return DiseaseMapper.toInterfaceType(newDisease);
  }

  public DiseaseDto updateDisease(UUID id, PostPutDiseaseRequest request) {
    String newName = request.diseaseName();
    Optional<Disease> foundByName = diseaseRepository.findByName(newName);
    if (foundByName.isPresent() && !foundByName.get().getId().equals(id))
      throw new AlreadyExistsException("Disease exists: " + newName);

    Disease disease = retrieveDiseaseFromRepo(id);
    disease.setName(newName);
    disease.setEstimatedFee(request.estimatedFee());
    disease.setVisibleToCitizenPortal((request.visibleToCitizenPortal()));
    diseaseRepository.flush();
    return DiseaseMapper.toInterfaceType(disease);
  }

  public void deleteDisease(UUID id) {
    Disease disease = retrieveDiseaseFromRepo(id);
    diseaseRepository.delete(disease);
  }

  private Disease retrieveDiseaseFromRepo(UUID id) {
    return diseaseRepository
        .findById(id)
        .orElseThrow(() -> new NotFoundException("Disease not found"));
  }
}
