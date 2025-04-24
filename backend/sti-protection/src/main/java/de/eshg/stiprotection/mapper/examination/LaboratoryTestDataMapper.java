/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.examination;

import de.eshg.stiprotection.api.examination.labtests.CancerScreeningTestDto;
import de.eshg.stiprotection.api.examination.labtests.ChlamydiaTestDto;
import de.eshg.stiprotection.api.examination.labtests.GonorrheaTestDto;
import de.eshg.stiprotection.api.examination.labtests.HepatitisATestDto;
import de.eshg.stiprotection.api.examination.labtests.HepatitisBTestDto;
import de.eshg.stiprotection.api.examination.labtests.HepatitisCTestDto;
import de.eshg.stiprotection.api.examination.labtests.HivTestDto;
import de.eshg.stiprotection.api.examination.labtests.HpvTestDto;
import de.eshg.stiprotection.api.examination.labtests.LabTestDataDto;
import de.eshg.stiprotection.api.examination.labtests.MpoxTestDto;
import de.eshg.stiprotection.api.examination.labtests.MycoplasmaTestDto;
import de.eshg.stiprotection.api.examination.labtests.OtherTestsDto;
import de.eshg.stiprotection.api.examination.labtests.SyphilisTestDto;
import de.eshg.stiprotection.persistence.db.examination.labtests.CancerScreeningTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.ChlamydiaTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.GonorrheaTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.HepatitisATest;
import de.eshg.stiprotection.persistence.db.examination.labtests.HepatitisBTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.HepatitisCTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.HivTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.HpvTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.LabTestData;
import de.eshg.stiprotection.persistence.db.examination.labtests.MpoxTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.MycoplasmaTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.OtherTests;
import de.eshg.stiprotection.persistence.db.examination.labtests.SyphilisTest;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class LaboratoryTestDataMapper {

  private LaboratoryTestDataMapper() {}

  public static List<LabTestDataDto> toInterfaceType(Collection<LabTestData> labTests) {
    if (labTests == null) {
      return null;
    }
    List<LabTestDataDto> result = new ArrayList<>();
    for (LabTestData e : labTests) {
      switch (e) {
        case CancerScreeningTest t ->
            result.add(new CancerScreeningTestDto(t.getResult(), t.getValue(), t.getRemark()));
        case MpoxTest t -> result.add(new MpoxTestDto(t.getResult(), t.getValue(), t.getRemark()));
        case SyphilisTest t ->
            result.add(
                new SyphilisTestDto(
                    t.getResult(), t.getValue(), t.getRemark(), t.getHadSyphilis()));
        case HpvTest t -> result.add(new HpvTestDto(t.getResult(), t.getValue(), t.getRemark()));
        case OtherTests t ->
            result.add(
                new OtherTestsDto(
                    t.getResult(), t.getValue(), t.getRemark(), t.getOtherTestName()));
        case HivTest t -> result.add(new HivTestDto(t.getResult(), t.getValue(), t.getRemark()));
        case MycoplasmaTest t ->
            result.add(
                new MycoplasmaTestDto(
                    t.getResult(),
                    t.getValue(),
                    t.getRemark(),
                    t.getOral(),
                    t.getAnal(),
                    t.getUrethral()));
        case GonorrheaTest t ->
            result.add(
                new GonorrheaTestDto(
                    t.getResult(),
                    t.getValue(),
                    t.getRemark(),
                    t.getOral(),
                    t.getAnal(),
                    t.getUrethral()));
        case ChlamydiaTest t ->
            result.add(
                new ChlamydiaTestDto(
                    t.getResult(),
                    t.getValue(),
                    t.getRemark(),
                    t.getOral(),
                    t.getAnal(),
                    t.getUrethral()));
        case HepatitisATest t ->
            result.add(
                new HepatitisATestDto(
                    t.getResult(),
                    t.getValue(),
                    t.getRemark(),
                    t.getInfection(),
                    t.getVaccineTitre()));
        case HepatitisBTest t ->
            result.add(
                new HepatitisBTestDto(
                    t.getResult(),
                    t.getValue(),
                    t.getRemark(),
                    t.getInfection(),
                    t.getVaccineTitre()));
        case HepatitisCTest t ->
            result.add(new HepatitisCTestDto(t.getResult(), t.getValue(), t.getRemark()));
        default ->
            throw new IllegalArgumentException("Unexpected value: " + e.getClass().getName());
      }
    }
    return result;
  }

  public static List<LabTestData> toDatabaseTypeLabTestData(List<LabTestDataDto> labTestData) {
    if (labTestData == null) {
      return null;
    }
    List<LabTestData> result = new ArrayList<>(labTestData.size());
    for (LabTestDataDto e : labTestData) {
      switch (e) {
        case CancerScreeningTestDto t ->
            result.add(new CancerScreeningTest(t.result(), t.value(), t.remark()));
        case ChlamydiaTestDto t ->
            result.add(
                new ChlamydiaTest(
                    t.result(), t.value(), t.remark(), t.oral(), t.anal(), t.urethral()));
        case GonorrheaTestDto t ->
            result.add(
                new GonorrheaTest(
                    t.result(), t.value(), t.remark(), t.oral(), t.anal(), t.urethral()));
        case HepatitisATestDto t ->
            result.add(
                new HepatitisATest(
                    t.result(), t.value(), t.remark(), t.infection(), t.vaccineTitre()));
        case HepatitisBTestDto t ->
            result.add(
                new HepatitisBTest(
                    t.result(), t.value(), t.remark(), t.infection(), t.vaccineTitre()));
        case HepatitisCTestDto t ->
            result.add(new HepatitisCTest(t.result(), t.value(), t.remark()));
        case HivTestDto t -> result.add(new HivTest(t.result(), t.value(), t.remark()));
        case HpvTestDto t -> result.add(new HpvTest(t.result(), t.value(), t.remark()));
        case MpoxTestDto t -> result.add(new MpoxTest(t.result(), t.value(), t.remark()));
        case OtherTestsDto t ->
            result.add(new OtherTests(t.result(), t.value(), t.remark(), t.otherTestName()));
        case MycoplasmaTestDto t ->
            result.add(
                new MycoplasmaTest(
                    t.result(), t.value(), t.remark(), t.oral(), t.anal(), t.urethral()));
        case SyphilisTestDto t ->
            result.add(new SyphilisTest(t.result(), t.value(), t.remark(), t.hadSyphilis()));
        default ->
            throw new IllegalArgumentException("Unexpected value: " + e.getClass().getName());
      }
    }
    return result;
  }
}
