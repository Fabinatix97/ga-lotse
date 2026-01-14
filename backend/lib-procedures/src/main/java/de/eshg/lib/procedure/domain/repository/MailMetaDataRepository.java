/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.procedure.domain.model.MailMetaData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MailMetaDataRepository extends JpaRepository<MailMetaData, Long> {}
