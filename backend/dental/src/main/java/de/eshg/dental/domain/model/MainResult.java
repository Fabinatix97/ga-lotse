/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.model;

public enum MainResult {
  /** Kariesfrei */
  S,
  /** Initialkaries */
  I,
  /** Kariös */
  D,
  /** Gefüllt */
  F,
  /** Extrahiert */
  E,
  /** KFO-Extr. */
  Y,
  /** Nichtanlage */
  X,
  /** Zerstört */
  Z,
  /** Trauma */
  T,
  /** Hypoplasie */
  H,
  /** Trep/Fistel */
  O,
  /** Versiegelt */
  V,
  /** Nicht beurteilbar */
  N,
  /** Platzhalter */
  P,
  /** Krone */
  K,
  /** Zahn fehlt */
  U
}
