/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.base.util.MapUtils;
import de.eshg.config.ConfigurationStatus;
import de.eshg.persistence.TransactionHelper;
import de.eshg.stiprotection.persistence.StiConsultationOpeningHours;
import de.eshg.stiprotection.persistence.config.DepartmentInfoConfig;
import de.eshg.stiprotection.persistence.db.Concern;
import jakarta.persistence.EntityManager;
import java.util.SequencedMap;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StiConsultationOpeningHoursService
    extends AbstractStiProtectionOpeningHoursService<StiConsultationOpeningHours> {

  private static final String CONFIGURATION_ENDPOINT = "STI_CONSULTATION_OPENING_HOURS";

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

  @Override
  @Transactional(propagation = Propagation.REQUIRED)
  protected SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    return MapUtils.orderedMapOf(CONFIGURATION_ENDPOINT, toConfigurationStatus(getConfig()));
  }
}
