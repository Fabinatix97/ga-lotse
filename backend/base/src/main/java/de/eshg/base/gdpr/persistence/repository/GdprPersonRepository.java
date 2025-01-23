/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.persistence.repository;

import de.eshg.base.gdpr.persistence.GdprPerson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GdprPersonRepository extends JpaRepository<GdprPerson, Long> {}
