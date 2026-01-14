/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.domain.repository;

import de.eshg.prostituteprotection.domain.model.EncryptedFile;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EncryptedFileRepository extends JpaRepository<EncryptedFile, Long> {

  List<EncryptedFile> findByProcedureIdOrderByCreatedAtAscIdAsc(Long procedureId);
}
