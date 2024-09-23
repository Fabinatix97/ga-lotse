/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.informationstatementtemplate.persistence.entity;

import de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.element.Element;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ElementRepository extends JpaRepository<Element, UUID> {}
