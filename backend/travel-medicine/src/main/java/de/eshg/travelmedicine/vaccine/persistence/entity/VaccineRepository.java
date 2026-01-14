/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccine.persistence.entity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VaccineRepository extends JpaRepository<Vaccine, UUID> {
  Optional<Vaccine> findByName(String name);

  Optional<Vaccine> findByInventoryVaccineId(UUID id);

  List<Vaccine> findAllByDiseaseId(UUID id);
}
