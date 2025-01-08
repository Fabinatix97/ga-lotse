/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.importing;

import de.eshg.base.contact.api.VCardInstitutionContactDto;
import de.eshg.base.contact.api.VCardPersonContactDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import ezvcard.Ezvcard;
import ezvcard.VCard;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import org.apache.commons.io.FilenameUtils;
import org.springframework.web.multipart.MultipartFile;

public class ParseVCardUtils {

  private ParseVCardUtils() {}

  public static VCardPersonContactDto getVCardDataFromPerson(MultipartFile vcfFile)
      throws IOException {
    VCard vcard = read(vcfFile);

    assertFileWasParsed(vcard);

    return VCardMapper.mapVCardFromPersonToApi(vcard);
  }

  public static VCardInstitutionContactDto getVCardDataFromInstitution(MultipartFile vcfFile)
      throws IOException {
    VCard vcard = read(vcfFile);

    assertFileWasParsed(vcard);

    return VCardMapper.mapVCardFromInstitutionToApi(vcard);
  }

  private static VCard read(MultipartFile vcfFile) throws IOException {
    String vCardData = new String(vcfFile.getBytes(), StandardCharsets.UTF_8);
    return Ezvcard.parse(vCardData).first();
  }

  public static void validateFileExistsAndHasCorrectType(MultipartFile file) {
    if (!file.getResource().exists()) {
      throw new BadRequestException("Uploaded file %s does not exist.".formatted(file.getName()));
    }
    if (!Objects.requireNonNull(FilenameUtils.getExtension(file.getOriginalFilename()))
        .endsWith("vcf")) {
      throw new BadRequestException("Unsupported file type: Only vcf file format is allowed");
    }
  }

  private static void assertFileWasParsed(VCard vcard) {
    if (vcard == null) {
      throw new BadRequestException(ErrorCode.INVALID_FILE, "Could not parse file");
    }
  }
}
