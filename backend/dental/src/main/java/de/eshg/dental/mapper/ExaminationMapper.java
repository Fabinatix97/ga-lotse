/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.mapper;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.dental.api.AbsenceExaminationResultDto;
import de.eshg.dental.api.ExaminationDto;
import de.eshg.dental.api.ExaminationResultDto;
import de.eshg.dental.api.FluoridationExaminationResultDto;
import de.eshg.dental.api.MainResultDto;
import de.eshg.dental.api.MihStatusDto;
import de.eshg.dental.api.OralHygieneStatusDto;
import de.eshg.dental.api.OrthodonticStatusDto;
import de.eshg.dental.api.ReasonForAbsenceDto;
import de.eshg.dental.api.ScreeningExaminationResultDto;
import de.eshg.dental.api.SecondaryResultDto;
import de.eshg.dental.api.ToothDiagnosisDto;
import de.eshg.dental.api.ToothDto;
import de.eshg.dental.domain.model.AbsenceExaminationResult;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.ExaminationResult;
import de.eshg.dental.domain.model.FluoridationExaminationResult;
import de.eshg.dental.domain.model.MainResult;
import de.eshg.dental.domain.model.MihStatus;
import de.eshg.dental.domain.model.OralHygieneStatus;
import de.eshg.dental.domain.model.OrthodonticStatus;
import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.domain.model.ReasonForAbsence;
import de.eshg.dental.domain.model.ScreeningExaminationResult;
import de.eshg.dental.domain.model.SecondaryResult;
import de.eshg.dental.domain.model.Tooth;
import de.eshg.dental.domain.model.ToothDiagnosis;
import java.time.Clock;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public final class ExaminationMapper {
  private ExaminationMapper() {}

  private static Clock clock;

  @Autowired
  public void setClock(Clock clock) {
    ExaminationMapper.clock = clock;
  }

  public static ExaminationDto mapToDto(Examination examination) {
    if (examination == null) {
      return null;
    }
    ProphylaxisSession prophylaxisSession = examination.getProphylaxisSession();
    return new ExaminationDto(
        examination.getExternalId(),
        examination.getVersion(),
        prophylaxisSession.getDateAndTime(),
        ProphylaxisSessionMapper.mapToDto(prophylaxisSession.getType()),
        prophylaxisSession.isScreening(),
        DentitionTypeMapper.mapToDto(prophylaxisSession.getDentitionType()),
        prophylaxisSession.hasFluoridationVarnish(),
        examination
            .getChild()
            .isFluoridationConsentGivenAtDateOptionally(
                examination.getDateAndTime().atZone(clock.getZone()).toLocalDate()),
        examination.getChild().getNote(),
        mapToDto(examination.getResult()));
  }

  public static ExaminationResultDto mapToDto(ExaminationResult result) {
    if (result == null) {
      return null;
    }
    boolean fluoridationIsConsented =
        result
            .getExamination()
            .getChild()
            .isFluoridationConsentGivenAtDate(
                result.getExamination().getDateAndTime().atZone(clock.getZone()).toLocalDate());
    return switch (result) {
      case FluoridationExaminationResult fluoridationExaminationResult ->
          new FluoridationExaminationResultDto(
              fluoridationIsConsented
                  ? fluoridationExaminationResult.isFluorideVarnishApplied()
                  : Boolean.FALSE);
      case ScreeningExaminationResult screeningExaminationResult ->
          new ScreeningExaminationResultDto(
              fluoridationIsConsented
                  ? screeningExaminationResult.isFluorideVarnishApplied()
                  : Boolean.FALSE,
              mapToDto(screeningExaminationResult.getOralHygieneStatus()),
              mapToDto(screeningExaminationResult.getMihStatus()),
              OrthodonticFindingMapper.mapToDto(
                  screeningExaminationResult.getOrthodonticFindings()),
              mapToDto(screeningExaminationResult.getOrthodonticStatus()),
              DentitionTypeMapper.mapToDto(screeningExaminationResult.getDentitionType()),
              screeningExaminationResult.hasPlaque(),
              screeningExaminationResult.hasCalculus(),
              screeningExaminationResult.hasGingivitis(),
              screeningExaminationResult.hasParodontitis(),
              screeningExaminationResult.hasBlackStain(),
              mapToDto(screeningExaminationResult.getToothDiagnoses()),
              screeningExaminationResult.isIndividualProphylaxis(),
              screeningExaminationResult.isFissureSealing(),
              screeningExaminationResult.isTartarRemoval(),
              screeningExaminationResult.isGingivitisTreatment(),
              screeningExaminationResult.isOrthodonticTreatment(),
              screeningExaminationResult.isPlaqueTreatment(),
              screeningExaminationResult.isPrimaryDentitionObstructsSecondary(),
              screeningExaminationResult.isInspectionAppointment());
      case AbsenceExaminationResult absenceExaminationResult ->
          new AbsenceExaminationResultDto(mapToDto(absenceExaminationResult.getReasonForAbsence()));
      default -> throw new IllegalArgumentException("Unexpected examination result: " + result);
    };
  }

  private static OralHygieneStatusDto mapToDto(OralHygieneStatus oralHygieneStatus) {
    return switch (oralHygieneStatus) {
      case null -> null;
      case EXCELLENT -> OralHygieneStatusDto.EXCELLENT;
      case GOOD -> OralHygieneStatusDto.GOOD;
      case POOR -> OralHygieneStatusDto.POOR;
    };
  }

  public static OralHygieneStatus mapToDomain(OralHygieneStatusDto oralHygieneStatus) {
    return switch (oralHygieneStatus) {
      case null -> null;
      case EXCELLENT -> OralHygieneStatus.EXCELLENT;
      case GOOD -> OralHygieneStatus.GOOD;
      case POOR -> OralHygieneStatus.POOR;
    };
  }

  private static MihStatusDto mapToDto(MihStatus mihStatus) {
    return switch (mihStatus) {
      case null -> null;
      case MILD -> MihStatusDto.MILD;
      case MODERATE -> MihStatusDto.MODERATE;
      case SERIOUS -> MihStatusDto.SERIOUS;
    };
  }

  public static MihStatus mapToDomain(MihStatusDto mihStatus) {
    return switch (mihStatus) {
      case null -> null;
      case MILD -> MihStatus.MILD;
      case MODERATE -> MihStatus.MODERATE;
      case SERIOUS -> MihStatus.SERIOUS;
    };
  }

  public static Map<Tooth, ToothDiagnosis> mapToDomain(List<ToothDiagnosisDto> toothDiagnoses) {
    return toothDiagnoses.stream()
        .collect(
            StreamUtil.toLinkedHashMap(
                toothDiagnosis -> mapToDomain(toothDiagnosis.tooth()),
                ExaminationMapper::mapResultsToDomain));
  }

  public static Map<Tooth, ToothDiagnosis> mapToDomain(
      Map<ToothDto, ToothDiagnosisDto> toothDiagnosesDto) {
    return toothDiagnosesDto.values().stream()
        .collect(
            StreamUtil.toLinkedHashMap(
                toothDiagnosis -> mapToDomain(toothDiagnosis.tooth()),
                ExaminationMapper::mapResultsToDomain));
  }

  public static List<ToothDiagnosisDto> mapToDto(Map<Tooth, ToothDiagnosis> toothDiagnoses) {
    return toothDiagnoses.entrySet().stream()
        .map(tooth -> mapToDto(tooth.getKey(), tooth.getValue()))
        .toList();
  }

  private static ToothDiagnosis mapResultsToDomain(ToothDiagnosisDto dto) {
    if (dto == null) {
      return null;
    }
    ToothDiagnosis toothDiagnosis = new ToothDiagnosis();
    toothDiagnosis.setMainResult(mapToDomain(dto.mainResult()));
    toothDiagnosis.setSecondaryResult(mapToDomain(dto.secondaryResult()));
    return toothDiagnosis;
  }

  private static ToothDiagnosisDto mapToDto(Tooth tooth, ToothDiagnosis toothDiagnosis) {
    if (toothDiagnosis == null) {
      return null;
    }
    return new ToothDiagnosisDto(
        mapToDto(tooth),
        mapToDto(toothDiagnosis.mainResult()),
        mapToDto(toothDiagnosis.secondaryResult()));
  }

  private static MainResultDto mapToDto(MainResult mainResult) {
    return switch (mainResult) {
      case null -> null;
      case S -> MainResultDto.S;
      case I -> MainResultDto.I;
      case D -> MainResultDto.D;
      case F -> MainResultDto.F;
      case M -> MainResultDto.M;
      case X -> MainResultDto.X;
      case Z -> MainResultDto.Z;
      case T -> MainResultDto.T;
      case H -> MainResultDto.H;
      case O -> MainResultDto.O;
      case V -> MainResultDto.V;
      case N -> MainResultDto.N;
      case U -> MainResultDto.U;
      case K -> MainResultDto.K;
      case E -> MainResultDto.E;
      case W -> MainResultDto.W;
      case P -> MainResultDto.P;
      case A -> MainResultDto.A;
    };
  }

  private static SecondaryResultDto mapToDto(SecondaryResult secondaryResult) {
    return switch (secondaryResult) {
      case null -> null;
      case S -> SecondaryResultDto.S;
      case I -> SecondaryResultDto.I;
      case D -> SecondaryResultDto.D;
      case F -> SecondaryResultDto.F;
      case M -> SecondaryResultDto.M;
      case X -> SecondaryResultDto.X;
      case Z -> SecondaryResultDto.Z;
      case T -> SecondaryResultDto.T;
      case H -> SecondaryResultDto.H;
      case O -> SecondaryResultDto.O;
      case V -> SecondaryResultDto.V;
      case N -> SecondaryResultDto.N;
      case U -> SecondaryResultDto.U;
      case K -> SecondaryResultDto.K;
      case E -> SecondaryResultDto.E;
      case W -> SecondaryResultDto.W;
      case P -> SecondaryResultDto.P;
      case A -> SecondaryResultDto.A;
      case DA -> SecondaryResultDto.DA;
      case FA -> SecondaryResultDto.FA;
      case ID -> SecondaryResultDto.ID;
      case INS -> SecondaryResultDto.INS;
      case LUE -> SecondaryResultDto.LUE;
      case RET -> SecondaryResultDto.RET;
      case ZA -> SecondaryResultDto.ZA;
    };
  }

  private static MainResult mapToDomain(MainResultDto dto) {
    return switch (dto) {
      case null -> null;
      case S -> MainResult.S;
      case I -> MainResult.I;
      case D -> MainResult.D;
      case F -> MainResult.F;
      case M -> MainResult.M;
      case X -> MainResult.X;
      case Z -> MainResult.Z;
      case T -> MainResult.T;
      case H -> MainResult.H;
      case O -> MainResult.O;
      case V -> MainResult.V;
      case N -> MainResult.N;
      case U -> MainResult.U;
      case K -> MainResult.K;
      case E -> MainResult.E;
      case W -> MainResult.W;
      case P -> MainResult.P;
      case A -> MainResult.A;
    };
  }

  private static SecondaryResult mapToDomain(SecondaryResultDto dto) {
    return switch (dto) {
      case null -> null;
      case S -> SecondaryResult.S;
      case I -> SecondaryResult.I;
      case D -> SecondaryResult.D;
      case F -> SecondaryResult.F;
      case M -> SecondaryResult.M;
      case X -> SecondaryResult.X;
      case Z -> SecondaryResult.Z;
      case T -> SecondaryResult.T;
      case H -> SecondaryResult.H;
      case O -> SecondaryResult.O;
      case V -> SecondaryResult.V;
      case N -> SecondaryResult.N;
      case U -> SecondaryResult.U;
      case K -> SecondaryResult.K;
      case E -> SecondaryResult.E;
      case W -> SecondaryResult.W;
      case P -> SecondaryResult.P;
      case A -> SecondaryResult.A;
      case DA -> SecondaryResult.DA;
      case FA -> SecondaryResult.FA;
      case ID -> SecondaryResult.ID;
      case INS -> SecondaryResult.INS;
      case LUE -> SecondaryResult.LUE;
      case RET -> SecondaryResult.RET;
      case ZA -> SecondaryResult.ZA;
    };
  }

  public static Tooth mapToDomain(ToothDto dto) {
    return switch (dto) {
      case null -> null;
      case T11 -> Tooth.T11;
      case T12 -> Tooth.T12;
      case T13 -> Tooth.T13;
      case T14 -> Tooth.T14;
      case T15 -> Tooth.T15;
      case T16 -> Tooth.T16;
      case T17 -> Tooth.T17;
      case T18 -> Tooth.T18;
      case T21 -> Tooth.T21;
      case T22 -> Tooth.T22;
      case T23 -> Tooth.T23;
      case T24 -> Tooth.T24;
      case T25 -> Tooth.T25;
      case T26 -> Tooth.T26;
      case T27 -> Tooth.T27;
      case T28 -> Tooth.T28;
      case T31 -> Tooth.T31;
      case T32 -> Tooth.T32;
      case T33 -> Tooth.T33;
      case T34 -> Tooth.T34;
      case T35 -> Tooth.T35;
      case T36 -> Tooth.T36;
      case T37 -> Tooth.T37;
      case T38 -> Tooth.T38;
      case T41 -> Tooth.T41;
      case T42 -> Tooth.T42;
      case T43 -> Tooth.T43;
      case T44 -> Tooth.T44;
      case T45 -> Tooth.T45;
      case T46 -> Tooth.T46;
      case T47 -> Tooth.T47;
      case T48 -> Tooth.T48;
      case T51 -> Tooth.T51;
      case T52 -> Tooth.T52;
      case T53 -> Tooth.T53;
      case T54 -> Tooth.T54;
      case T55 -> Tooth.T55;
      case T61 -> Tooth.T61;
      case T62 -> Tooth.T62;
      case T63 -> Tooth.T63;
      case T64 -> Tooth.T64;
      case T65 -> Tooth.T65;
      case T71 -> Tooth.T71;
      case T72 -> Tooth.T72;
      case T73 -> Tooth.T73;
      case T74 -> Tooth.T74;
      case T75 -> Tooth.T75;
      case T81 -> Tooth.T81;
      case T82 -> Tooth.T82;
      case T83 -> Tooth.T83;
      case T84 -> Tooth.T84;
      case T85 -> Tooth.T85;
    };
  }

  private static ToothDto mapToDto(Tooth tooth) {
    return switch (tooth) {
      case null -> null;
      case T11 -> ToothDto.T11;
      case T12 -> ToothDto.T12;
      case T13 -> ToothDto.T13;
      case T14 -> ToothDto.T14;
      case T15 -> ToothDto.T15;
      case T16 -> ToothDto.T16;
      case T17 -> ToothDto.T17;
      case T18 -> ToothDto.T18;
      case T21 -> ToothDto.T21;
      case T22 -> ToothDto.T22;
      case T23 -> ToothDto.T23;
      case T24 -> ToothDto.T24;
      case T25 -> ToothDto.T25;
      case T26 -> ToothDto.T26;
      case T27 -> ToothDto.T27;
      case T28 -> ToothDto.T28;
      case T31 -> ToothDto.T31;
      case T32 -> ToothDto.T32;
      case T33 -> ToothDto.T33;
      case T34 -> ToothDto.T34;
      case T35 -> ToothDto.T35;
      case T36 -> ToothDto.T36;
      case T37 -> ToothDto.T37;
      case T38 -> ToothDto.T38;
      case T41 -> ToothDto.T41;
      case T42 -> ToothDto.T42;
      case T43 -> ToothDto.T43;
      case T44 -> ToothDto.T44;
      case T45 -> ToothDto.T45;
      case T46 -> ToothDto.T46;
      case T47 -> ToothDto.T47;
      case T48 -> ToothDto.T48;
      case T51 -> ToothDto.T51;
      case T52 -> ToothDto.T52;
      case T53 -> ToothDto.T53;
      case T54 -> ToothDto.T54;
      case T55 -> ToothDto.T55;
      case T61 -> ToothDto.T61;
      case T62 -> ToothDto.T62;
      case T63 -> ToothDto.T63;
      case T64 -> ToothDto.T64;
      case T65 -> ToothDto.T65;
      case T71 -> ToothDto.T71;
      case T72 -> ToothDto.T72;
      case T73 -> ToothDto.T73;
      case T74 -> ToothDto.T74;
      case T75 -> ToothDto.T75;
      case T81 -> ToothDto.T81;
      case T82 -> ToothDto.T82;
      case T83 -> ToothDto.T83;
      case T84 -> ToothDto.T84;
      case T85 -> ToothDto.T85;
    };
  }

  private static ReasonForAbsenceDto mapToDto(ReasonForAbsence reasonForAbsence) {
    return switch (reasonForAbsence) {
      case null -> null;
      case NOT_APPEARED -> ReasonForAbsenceDto.NOT_APPEARED;
      case MOVED -> ReasonForAbsenceDto.MOVED;
      case SHIFTED -> ReasonForAbsenceDto.SHIFTED;
      case REFUSED -> ReasonForAbsenceDto.REFUSED;
    };
  }

  public static ReasonForAbsence mapToDomain(ReasonForAbsenceDto reasonForAbsenceDto) {
    return switch (reasonForAbsenceDto) {
      case null -> null;
      case NOT_APPEARED -> ReasonForAbsence.NOT_APPEARED;
      case MOVED -> ReasonForAbsence.MOVED;
      case SHIFTED -> ReasonForAbsence.SHIFTED;
      case REFUSED -> ReasonForAbsence.REFUSED;
    };
  }

  public static OrthodonticStatus mapToDomain(OrthodonticStatusDto dto) {
    return switch (dto) {
      case null -> null;
      case WITHOUT_FINDINGS -> OrthodonticStatus.WITHOUT_FINDINGS;
      case TREATMENT_STARTED -> OrthodonticStatus.TREATMENT_STARTED;
      case TREATMENT_REQUIRED -> OrthodonticStatus.TREATMENT_REQUIRED;
      case TREATMENT_PLANNED -> OrthodonticStatus.TREATMENT_PLANNED;
      case TREATMENT_COMPLETED -> OrthodonticStatus.TREATMENT_COMPLETED;
      case TREATMENT_CANCELED -> OrthodonticStatus.TREATMENT_CANCELED;
      case UNDER_OBSERVATION -> OrthodonticStatus.UNDER_OBSERVATION;
    };
  }

  public static OrthodonticStatusDto mapToDto(OrthodonticStatus orthodonticStatus) {
    return switch (orthodonticStatus) {
      case null -> null;
      case WITHOUT_FINDINGS -> OrthodonticStatusDto.WITHOUT_FINDINGS;
      case TREATMENT_STARTED -> OrthodonticStatusDto.TREATMENT_STARTED;
      case TREATMENT_REQUIRED -> OrthodonticStatusDto.TREATMENT_REQUIRED;
      case TREATMENT_PLANNED -> OrthodonticStatusDto.TREATMENT_PLANNED;
      case TREATMENT_COMPLETED -> OrthodonticStatusDto.TREATMENT_COMPLETED;
      case TREATMENT_CANCELED -> OrthodonticStatusDto.TREATMENT_CANCELED;
      case UNDER_OBSERVATION -> OrthodonticStatusDto.UNDER_OBSERVATION;
    };
  }
}
