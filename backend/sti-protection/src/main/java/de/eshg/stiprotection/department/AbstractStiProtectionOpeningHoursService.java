/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.config.AuditLogWriter;
import de.eshg.config.departmentinfo.AbstractOpeningHoursService;
import de.eshg.config.domain.AbstractOpeningHours;
import de.eshg.config.initialization.MandatoryInitialOpeningHours;
import de.eshg.persistence.TransactionHelper;
import de.eshg.stiprotection.api.citizen.GetOpeningHoursResponse;
import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

abstract class AbstractStiProtectionOpeningHoursService<O extends AbstractOpeningHours>
    extends AbstractOpeningHoursService<O> {
  public AbstractStiProtectionOpeningHoursService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      MandatoryInitialOpeningHours initialOpeningHours,
      AuditLogWriter auditLogWriter,
      Class<O> configClass) {
    super(entityManager, transactionHelper, initialOpeningHours, auditLogWriter, configClass);
  }

  @Transactional(propagation = Propagation.REQUIRED, readOnly = true)
  public GetOpeningHoursResponse getOpeningHours() {
    O config = getConfig();
    return new GetOpeningHoursResponse(config.getDe(), config.getEn());
  }
}
