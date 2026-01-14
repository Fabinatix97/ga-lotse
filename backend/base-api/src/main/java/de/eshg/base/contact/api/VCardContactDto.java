/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

public sealed interface VCardContactDto permits VCardInstitutionContactDto, VCardPersonContactDto {
  String fullName();

  @ArraySchema(
      arraySchema =
          @Schema(
              description = "A list of telephone numbers of the contact in the vCard.",
              example = "['+4912345678901','+4912345678902','+4912345678903']"))
  List<String> phoneNumbers();

  @ArraySchema(
      arraySchema =
          @Schema(
              description = "A list of email addresses of the contact in the vCard.",
              example = "['mail1@address.de','mail2@address.de','mail3@address.de']"))
  List<String> emailAddresses();

  List<VCardAddressDto> addresses();
}
