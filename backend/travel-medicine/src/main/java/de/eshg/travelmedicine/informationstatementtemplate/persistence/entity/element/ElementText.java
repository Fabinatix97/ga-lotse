/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.element;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.element.ElementType.Type;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DataSensitivity(SensitivityLevel.PUBLIC)
@DiscriminatorValue(value = Type.TEXT)
public class ElementText extends Element {

  private String text;

  @Override
  public ElementType getType() {
    return ElementType.TEXT;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }
}
