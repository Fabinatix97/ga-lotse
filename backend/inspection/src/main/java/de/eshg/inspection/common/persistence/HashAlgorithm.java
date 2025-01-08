/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.common.persistence;

/**
 * <b>HashAlgorithm has to be backward compatible, do not remove old algorithms!</b> <br>
 * <br>
 * Those algorithms are used to ensure data integrity for checklists and signatures. This means that
 * any checklist or signature that was hashed with a certain algorithm, has to be verified with the
 * very same algorithm in the future.
 */
public enum HashAlgorithm {
  BLAKE2B_512
}
