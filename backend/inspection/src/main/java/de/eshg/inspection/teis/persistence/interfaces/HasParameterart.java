/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis.persistence.interfaces;

import de.eshg.inspection.teis.persistence.TeisListe;

public interface HasParameterart {
  TeisListe getParameterart();

  void setParameterart(TeisListe parameter);
}
