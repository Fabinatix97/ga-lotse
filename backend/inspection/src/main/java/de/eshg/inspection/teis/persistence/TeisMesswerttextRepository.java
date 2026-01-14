/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis.persistence;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeisMesswerttextRepository extends JpaRepository<TeisMesswerttext, String> {

  Optional<TeisMesswerttext> findTeisMesswerttextByZid(String zid);
}
