/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import static de.eshg.base.contact.api.InstitutionContactCategoryDto.*;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Arrays;
import java.util.List;

@Schema(
    name = "ContactSubCategory",
    description =
        "The list of possible sub-types under which an Institution in the Contact Management can be categorized.")
public enum InstitutionContactSubCategoryDto {
  BERUFSSCHULE(SCHOOL),
  FOERDERSCHULE(SCHOOL),
  GRUNDSCHULE(SCHOOL),
  GRUND_HAUPTSCHULE(SCHOOL),
  GRUND_HAUPT_REALSCHULE(SCHOOL),
  GYMNASIUM(SCHOOL),
  HAUPTSCHULE(SCHOOL),
  HAUPT_REALSCHULE(SCHOOL),
  INTEGRIERTE_GESAMTSCHULE(SCHOOL),
  KOOPERATIVE_GESAMTSCHULE(SCHOOL),
  REALSCHULE(SCHOOL);

  private final InstitutionContactCategoryDto parentCategory;

  InstitutionContactSubCategoryDto(InstitutionContactCategoryDto parentCategory) {
    this.parentCategory = parentCategory;
  }

  public InstitutionContactCategoryDto getParentCategory() {
    return parentCategory;
  }

  public static List<InstitutionContactSubCategoryDto> getSubCategoriesByParentCategory(
      InstitutionContactCategoryDto parentCategory) {
    return Arrays.stream(InstitutionContactSubCategoryDto.values())
        .filter(subCategory -> subCategory.getParentCategory() == parentCategory)
        .toList();
  }
}
