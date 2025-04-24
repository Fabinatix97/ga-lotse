/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.persistence.TransactionHelper;
import de.eshg.stiprotection.persistence.StiConsultationOpeningHours;
import de.eshg.stiprotection.persistence.config.DepartmentInfoConfig;
import de.eshg.stiprotection.persistence.db.Concern;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;

@Service
@ConfigConcernQualifier(concern = Concern.HIV_STI_CONSULTATION)
public class StiConsultationOpeningHoursService
    extends AbstractStiProtectionOpeningHoursService<StiConsultationOpeningHours> {

  public StiConsultationOpeningHoursService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      DepartmentInfoConfig departmentInfoConfig) {
    super(
        entityManager,
        transactionHelper,
        departmentInfoConfig
            .getOpeningHours()
            .get(Concern.HIV_STI_CONSULTATION.name().toLowerCase()),
        StiConsultationOpeningHours.class);
  }

  @Override
  protected StiConsultationOpeningHours createEmptyOpeningHoursEntity() {
    return new StiConsultationOpeningHours();
  }
}
