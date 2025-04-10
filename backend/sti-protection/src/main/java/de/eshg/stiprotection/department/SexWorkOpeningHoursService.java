/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.base.util.MapUtils;
import de.eshg.config.ConfigurationStatus;
import de.eshg.persistence.TransactionHelper;
import de.eshg.stiprotection.persistence.SexWorkOpeningHours;
import de.eshg.stiprotection.persistence.config.DepartmentInfoConfig;
import de.eshg.stiprotection.persistence.db.Concern;
import jakarta.persistence.EntityManager;
import java.util.SequencedMap;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SexWorkOpeningHoursService
    extends AbstractStiProtectionOpeningHoursService<SexWorkOpeningHours> {

  private static final String CONFIGURATION_ENDPOINT = "SEX_WORK_OPENING_HOURS";

  public SexWorkOpeningHoursService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      DepartmentInfoConfig departmentInfoConfig) {
    super(
        entityManager,
        transactionHelper,
        departmentInfoConfig.getOpeningHours().get(Concern.SEX_WORK.name().toLowerCase()),
        SexWorkOpeningHours.class);
  }

  @Override
  protected SexWorkOpeningHours createEmptyOpeningHoursEntity() {
    return new SexWorkOpeningHours();
  }

  @Override
  @Transactional(propagation = Propagation.REQUIRED)
  protected SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    return MapUtils.orderedMapOf(CONFIGURATION_ENDPOINT, toConfigurationStatus(getConfig()));
  }
}
