/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.domain.model;

import de.eshg.lib.procedure.domain.model.RelatedFacility;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(indexes = @Index(columnList = "procedure_id"))
public class Facility extends RelatedFacility<ProstituteProtectionProcedure> {}
