/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db;

import de.eshg.lib.procedure.domain.model.RelatedFacility;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(indexes = @Index(columnList = "procedure_id"))
public class Facility extends RelatedFacility<StiProtectionProcedure> {}
