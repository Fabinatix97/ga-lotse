/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street.csv;

import com.opencsv.bean.AbstractBeanField;

public class StreetNameConverter extends AbstractBeanField<StreetName, String> {
  @Override
  protected StreetName convert(String streetNameColumnValue) {
    if (streetNameColumnValue.endsWith("*")) {
      return StreetName.unofficial(removeLastCharacter(streetNameColumnValue));
    }
    return StreetName.official(streetNameColumnValue);
  }

  private static String removeLastCharacter(String streetNameColumnValue) {
    return streetNameColumnValue.substring(0, streetNameColumnValue.length() - 1);
  }

  @Override
  protected String convertToWrite(Object value) {
    if (value == null) {
      return null;
    }
    StreetName streetName = ((StreetName) value);
    return streetName.getStreetName() + (streetName.isUnofficial() ? "*" : "");
  }
}
