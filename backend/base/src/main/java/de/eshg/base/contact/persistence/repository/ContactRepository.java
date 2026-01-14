/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.persistence.repository;

import de.eshg.base.contact.persistence.entity.Contact;
import de.eshg.base.contact.persistence.entity.InstitutionContactCategory;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContactRepository
    extends JpaRepository<Contact, UUID>, JpaSpecificationExecutor<Contact> {
  @Modifying
  @Query(
      """
          update Contact c
          set c.mergedInto = :target
          where c.mergedInto = :source""")
  void updateMergeRefs(Contact target, Contact source);

  List<Contact> findAllById(Iterable<UUID> ids);

  @Query("select count(*) from Contact c where c.category = :category")
  long countByCategory(@Param("category") InstitutionContactCategory category);

  @Query("select id from Contact where mergedInto.id = :mergedInto")
  List<UUID> findAllByMergedInto(@Param("mergedInto") UUID mergedInto);
}
