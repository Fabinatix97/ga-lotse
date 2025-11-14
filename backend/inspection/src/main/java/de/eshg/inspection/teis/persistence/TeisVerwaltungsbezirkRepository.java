/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis.persistence;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeisVerwaltungsbezirkRepository
    extends JpaRepository<TeisVerwaltungsbezirk, String> {

  Optional<TeisVerwaltungsbezirk> findTeisVerwaltungsbezirkByZid(String zid);
}
