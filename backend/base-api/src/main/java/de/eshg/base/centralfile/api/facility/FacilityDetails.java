/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.facility;

import de.eshg.base.address.AddressDto;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

public interface FacilityDetails {
  @Schema(description = "The name of the Facility.", example = "Example Facility")
  String name();

  @ArraySchema(
      arraySchema =
          @Schema(
              description = "A list of email addresses of the Facility.",
              example = "['mail1@address.de','mail2@address.de','mail3@address.de']"))
  List<String> emailAddresses();

  @ArraySchema(
      arraySchema =
          @Schema(
              description = "A list of telephone numbers of the Facility.",
              example = "['+4912345678901','+4912345678902','+4912345678903']"))
  List<String> phoneNumbers();

  @ArraySchema(arraySchema = @Schema(description = "A list of contact persons of the Facility."))
  List<FacilityContactPersonDto> contactPersons();

  AddressDto contactAddress();

  AddressDto differentBillingAddress();
}
