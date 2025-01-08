/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.util.Assert;

public record PersonKeyAttributes(
    @NotBlank String firstName, @NotBlank String lastName, @NotNull LocalDate dateOfBirth) {

  public static final Pattern SERIALIZATION_PATTERN =
      Pattern.compile(
          "PersonKeyAttributes\\[firstName=(.+?), lastName=(.+?), dateOfBirth=(.+?)\\]");

  /*
  Required for deserializing PersonKeyAttributes as Map keys
  See de.eshg.base.centralfile.api.person.GetPersonFileStateIdsByKeyAttributesResponse
   */
  @JsonCreator
  private static PersonKeyAttributes fromJsonString(String s) {
    Matcher matcher = SERIALIZATION_PATTERN.matcher(s);
    Assert.isTrue(matcher.matches(), "Did not match expected pattern");
    Assert.isTrue(matcher.groupCount() == 3, "Wrong number of groups");
    return new PersonKeyAttributes(
        matcher.group(1), matcher.group(2), LocalDate.parse(matcher.group(3)));
  }
}
