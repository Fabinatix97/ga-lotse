/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.medicalhistorytemplate.persistence.entity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MedicalHistoryTemplateRepository
    extends JpaRepository<MedicalHistoryTemplate, UUID> {
  Optional<MedicalHistoryTemplate> findByTitle(String title);

  Optional<MedicalHistoryTemplate> findByMainFlagIsTrue();

  Optional<MedicalHistoryTemplate> findByFollowUpFlagIsTrue();

  @Query(value = "from MedicalHistoryTemplate mht order by mht.title, mht.mainFlag")
  List<MedicalHistoryTemplate> findAllOrderByTitle();
}
