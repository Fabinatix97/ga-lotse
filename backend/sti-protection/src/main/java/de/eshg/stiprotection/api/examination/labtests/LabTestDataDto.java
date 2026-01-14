/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.examination.labtests;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.api.commons.HasTypeDiscriminator;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "LabTestData")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @Type(value = CancerScreeningTestDto.class, name = CancerScreeningTestDto.SCHEMA),
  @Type(value = ChlamydiaTestDto.class, name = ChlamydiaTestDto.SCHEMA),
  @Type(value = GonorrheaTestDto.class, name = GonorrheaTestDto.SCHEMA),
  @Type(value = HepatitisATestDto.class, name = HepatitisATestDto.SCHEMA),
  @Type(value = HepatitisBTestDto.class, name = HepatitisBTestDto.SCHEMA),
  @Type(value = HepatitisCTestDto.class, name = HepatitisCTestDto.SCHEMA),
  @Type(value = HivTestDto.class, name = HivTestDto.SCHEMA),
  @Type(value = HpvTestDto.class, name = HpvTestDto.SCHEMA),
  @Type(value = OtherTestsDto.class, name = OtherTestsDto.SCHEMA),
  @Type(value = MpoxTestDto.class, name = MpoxTestDto.SCHEMA),
  @Type(value = MycoplasmaTestDto.class, name = MycoplasmaTestDto.SCHEMA),
  @Type(value = SyphilisTestDto.class, name = SyphilisTestDto.SCHEMA),
})
public sealed interface LabTestDataDto extends HasTypeDiscriminator
    permits CancerScreeningTestDto,
        ChlamydiaTestDto,
        GonorrheaTestDto,
        HepatitisATestDto,
        HepatitisBTestDto,
        HepatitisCTestDto,
        HivTestDto,
        HpvTestDto,
        OtherTestsDto,
        MpoxTestDto,
        MycoplasmaTestDto,
        SyphilisTestDto {

  Boolean result();

  String value();

  String remark();
}
