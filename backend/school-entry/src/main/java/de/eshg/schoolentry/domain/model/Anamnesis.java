/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import de.cronn.reflection.util.PropertyUtils;
import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import java.beans.PropertyDescriptor;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;
import org.hibernate.annotations.JdbcType;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.hibernate.type.SqlTypes;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class Anamnesis extends GenericEntity<Long> implements ValidatableEntity {

  @Id private Long id;

  @MapsId
  @OneToOne(optional = false)
  private SchoolEntryProcedure procedure;

  private Boolean childLanguageScreening;
  private Boolean preliminaryCourse;

  @Min(0)
  private Integer birthWeight;

  private Boolean gestationalAge;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private BooleanWithUnknown u2;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private BooleanWithUnknown u3;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private BooleanWithUnknown u4;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private BooleanWithUnknown u5;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private BooleanWithUnknown u6;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private BooleanWithUnknown u7;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private BooleanWithUnknown u7a;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private BooleanWithUnknown u8;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private BooleanWithUnknown u9;

  private Boolean earlySupport;
  private Boolean integrationPlace;
  private Boolean ergotherapy;
  private Boolean speechTherapy;
  private Boolean physiotherapy;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SchoolEntryCountryCode nationalityChild;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SchoolEntryCountryCode countryOfBirthChild;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SchoolEntryCountryCode nationalityFirstParent;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SchoolEntryCountryCode countryOfBirthFirstParent;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SchoolEntryCountryCode nationalitySecondParent;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private SchoolEntryCountryCode countryOfBirthSecondParent;

  private Boolean hasMigrationBackground;
  private LocalDate inGermanySince;

  private Integer numberOfSiblings;

  @JdbcTypeCode(SqlTypes.ARRAY)
  private List<Integer> siblingsBirthYears;

  private String responsiblePhysician;
  private LocalDate inDaycareSince;
  private Boolean wasInDaycare;
  private String daycareName;
  private String schoolName;
  private Boolean spectaclesInFamily;
  private String chronicIllnessOrDisabilityInFamily;
  private Boolean developmentConspicuities;
  private Boolean infancyConspicuities;
  private Boolean severeIllnesses;

  @JdbcTypeCode(SqlTypes.ARRAY)
  private List<String> allergies;

  private Boolean hospitalizationsOrOperations;
  private String underMedicalTreatmentFor;
  private String regularMedication;
  private Boolean visionImpairment;
  private Boolean hearingImpairment;
  private Boolean speechImpairment;
  private LocalDate spectaclesSince;
  private LocalDate visionSchoolSince;
  private String hearingAid;
  private LocalDate speechTherapyStart;
  private LocalDate speechTherapyEnd;
  private LocalDate ergoTherapyStart;
  private LocalDate ergoTherapyEnd;
  private LocalDate physioTherapyStart;
  private LocalDate physioTherapyEnd;
  private String additionalTherapies;
  private Boolean personalConspicuities;
  private String clubSport;
  private String otherInterests;
  private Boolean canSwim;
  private Boolean hasSeahorseBadge;

  private String note;

  @Override
  public Long getId() {
    return id;
  }

  public SchoolEntryProcedure getProcedure() {
    return procedure;
  }

  void setProcedure(SchoolEntryProcedure procedure) {
    this.procedure = procedure;
  }

  public Boolean getChildLanguageScreening() {
    return childLanguageScreening;
  }

  public void setChildLanguageScreening(Boolean childLanguageScreening) {
    this.childLanguageScreening = childLanguageScreening;
  }

  public Boolean getPreliminaryCourse() {
    return preliminaryCourse;
  }

  public void setPreliminaryCourse(Boolean preliminaryCourse) {
    this.preliminaryCourse = preliminaryCourse;
  }

  public Integer getBirthWeight() {
    return birthWeight;
  }

  public void setBirthWeight(Integer birthWeight) {
    this.birthWeight = birthWeight;
  }

  public Boolean getGestationalAge() {
    return gestationalAge;
  }

  public void setGestationalAge(Boolean gestationalAge) {
    this.gestationalAge = gestationalAge;
  }

  public BooleanWithUnknown getU2() {
    return u2;
  }

  public void setU2(BooleanWithUnknown u2) {
    this.u2 = u2;
  }

  public BooleanWithUnknown getU3() {
    return u3;
  }

  public void setU3(BooleanWithUnknown u3) {
    this.u3 = u3;
  }

  public BooleanWithUnknown getU4() {
    return u4;
  }

  public void setU4(BooleanWithUnknown u4) {
    this.u4 = u4;
  }

  public BooleanWithUnknown getU5() {
    return u5;
  }

  public void setU5(BooleanWithUnknown u5) {
    this.u5 = u5;
  }

  public BooleanWithUnknown getU6() {
    return u6;
  }

  public void setU6(BooleanWithUnknown u6) {
    this.u6 = u6;
  }

  public BooleanWithUnknown getU7() {
    return u7;
  }

  public void setU7(BooleanWithUnknown u7) {
    this.u7 = u7;
  }

  public BooleanWithUnknown getU7a() {
    return u7a;
  }

  public void setU7a(BooleanWithUnknown u7a) {
    this.u7a = u7a;
  }

  public BooleanWithUnknown getU8() {
    return u8;
  }

  public void setU8(BooleanWithUnknown u8) {
    this.u8 = u8;
  }

  public BooleanWithUnknown getU9() {
    return u9;
  }

  public void setU9(BooleanWithUnknown u9) {
    this.u9 = u9;
  }

  public Boolean getEarlySupport() {
    return earlySupport;
  }

  public void setEarlySupport(Boolean earlySupport) {
    this.earlySupport = earlySupport;
  }

  public Boolean getIntegrationPlace() {
    return integrationPlace;
  }

  public void setIntegrationPlace(Boolean integrationPlace) {
    this.integrationPlace = integrationPlace;
  }

  public Boolean getErgotherapy() {
    return ergotherapy;
  }

  public void setErgotherapy(Boolean ergotherapy) {
    this.ergotherapy = ergotherapy;
  }

  public Boolean getSpeechTherapy() {
    return speechTherapy;
  }

  public void setSpeechTherapy(Boolean speechTherapy) {
    this.speechTherapy = speechTherapy;
  }

  public Boolean getPhysiotherapy() {
    return this.physiotherapy;
  }

  public void setPhysiotherapy(Boolean physiotherapy) {
    this.physiotherapy = physiotherapy;
  }

  public SchoolEntryCountryCode getNationalityChild() {
    return nationalityChild;
  }

  public void setNationalityChild(SchoolEntryCountryCode nationalityChild) {
    this.nationalityChild = nationalityChild;
  }

  public SchoolEntryCountryCode getCountryOfBirthChild() {
    return countryOfBirthChild;
  }

  public void setCountryOfBirthChild(SchoolEntryCountryCode countryOfBirthChild) {
    this.countryOfBirthChild = countryOfBirthChild;
  }

  public SchoolEntryCountryCode getNationalityFirstParent() {
    return nationalityFirstParent;
  }

  public void setNationalityFirstParent(SchoolEntryCountryCode nationalityFirstParent) {
    this.nationalityFirstParent = nationalityFirstParent;
  }

  public SchoolEntryCountryCode getCountryOfBirthFirstParent() {
    return countryOfBirthFirstParent;
  }

  public void setCountryOfBirthFirstParent(SchoolEntryCountryCode countryOfBirthFirstParent) {
    this.countryOfBirthFirstParent = countryOfBirthFirstParent;
  }

  public SchoolEntryCountryCode getNationalitySecondParent() {
    return nationalitySecondParent;
  }

  public void setNationalitySecondParent(SchoolEntryCountryCode nationalitySecondParent) {
    this.nationalitySecondParent = nationalitySecondParent;
  }

  public SchoolEntryCountryCode getCountryOfBirthSecondParent() {
    return countryOfBirthSecondParent;
  }

  public void setCountryOfBirthSecondParent(SchoolEntryCountryCode countryOfBirthSecondParent) {
    this.countryOfBirthSecondParent = countryOfBirthSecondParent;
  }

  public Boolean getHasMigrationBackground() {
    return hasMigrationBackground;
  }

  public void setHasMigrationBackground(Boolean migrationBackground) {
    this.hasMigrationBackground = migrationBackground;
  }

  public LocalDate getInGermanySince() {
    return inGermanySince;
  }

  public void setInGermanySince(LocalDate inGermanySince) {
    this.inGermanySince = inGermanySince;
  }

  public List<Integer> getSiblingsBirthYears() {
    return siblingsBirthYears;
  }

  public void setSiblingsBirthYears(List<Integer> siblingsBirthYears) {
    this.siblingsBirthYears = siblingsBirthYears;
  }

  public String getResponsiblePhysician() {
    return responsiblePhysician;
  }

  public void setResponsiblePhysician(String responsiblePhysician) {
    this.responsiblePhysician = responsiblePhysician;
  }

  public LocalDate getInDaycareSince() {
    return inDaycareSince;
  }

  public void setInDaycareSince(LocalDate inDaycareSince) {
    this.inDaycareSince = inDaycareSince;
  }

  public String getDaycareName() {
    return daycareName;
  }

  public void setDaycareName(String daycareName) {
    this.daycareName = daycareName;
  }

  public String getSchoolName() {
    return schoolName;
  }

  public void setSchoolName(String responsibleSchoolContactId) {
    this.schoolName = responsibleSchoolContactId;
  }

  public Boolean getSpectaclesInFamily() {
    return spectaclesInFamily;
  }

  public void setSpectaclesInFamily(Boolean spectaclesInFamily) {
    this.spectaclesInFamily = spectaclesInFamily;
  }

  public String getChronicIllnessOrDisabilityInFamily() {
    return chronicIllnessOrDisabilityInFamily;
  }

  public void setChronicIllnessOrDisabilityInFamily(String chronicIllnessOrDisabilityInFamily) {
    this.chronicIllnessOrDisabilityInFamily = chronicIllnessOrDisabilityInFamily;
  }

  public Boolean getDevelopmentConspicuities() {
    return developmentConspicuities;
  }

  public void setDevelopmentConspicuities(Boolean developmentConspicuities) {
    this.developmentConspicuities = developmentConspicuities;
  }

  public Boolean getInfancyConspicuities() {
    return infancyConspicuities;
  }

  public void setInfancyConspicuities(Boolean infancyConspicuities) {
    this.infancyConspicuities = infancyConspicuities;
  }

  public Boolean getSevereIllnesses() {
    return severeIllnesses;
  }

  public void setSevereIllnesses(Boolean severeIllnesses) {
    this.severeIllnesses = severeIllnesses;
  }

  public List<String> getAllergies() {
    return allergies;
  }

  public void setAllergies(List<String> allergies) {
    this.allergies = allergies;
  }

  public Boolean getHospitalizationsOrOperations() {
    return hospitalizationsOrOperations;
  }

  public void setHospitalizationsOrOperations(Boolean hospitalizationsOrOperations) {
    this.hospitalizationsOrOperations = hospitalizationsOrOperations;
  }

  public String getUnderMedicalTreatmentFor() {
    return underMedicalTreatmentFor;
  }

  public void setUnderMedicalTreatmentFor(String underMedicalTreatmentFor) {
    this.underMedicalTreatmentFor = underMedicalTreatmentFor;
  }

  public String getRegularMedication() {
    return regularMedication;
  }

  public void setRegularMedication(String regularMedication) {
    this.regularMedication = regularMedication;
  }

  public Boolean getVisionImpairment() {
    return visionImpairment;
  }

  public void setVisionImpairment(Boolean visionImpairment) {
    this.visionImpairment = visionImpairment;
  }

  public Boolean getHearingImpairment() {
    return hearingImpairment;
  }

  public void setHearingImpairment(Boolean hearingImpairment) {
    this.hearingImpairment = hearingImpairment;
  }

  public Boolean getSpeechImpairment() {
    return speechImpairment;
  }

  public void setSpeechImpairment(Boolean speechImpairment) {
    this.speechImpairment = speechImpairment;
  }

  public LocalDate getSpectaclesSince() {
    return spectaclesSince;
  }

  public void setSpectaclesSince(LocalDate spectaclesSince) {
    this.spectaclesSince = spectaclesSince;
  }

  public LocalDate getVisionSchoolSince() {
    return visionSchoolSince;
  }

  public void setVisionSchoolSince(LocalDate visionSchoolSince) {
    this.visionSchoolSince = visionSchoolSince;
  }

  public String getHearingAid() {
    return hearingAid;
  }

  public void setHearingAid(String hearingAid) {
    this.hearingAid = hearingAid;
  }

  public LocalDate getSpeechTherapyStart() {
    return speechTherapyStart;
  }

  public void setSpeechTherapyStart(LocalDate speechTherapyStart) {
    this.speechTherapyStart = speechTherapyStart;
  }

  public LocalDate getSpeechTherapyEnd() {
    return speechTherapyEnd;
  }

  public void setSpeechTherapyEnd(LocalDate speechTherapyEnd) {
    this.speechTherapyEnd = speechTherapyEnd;
  }

  public LocalDate getErgoTherapyStart() {
    return ergoTherapyStart;
  }

  public void setErgoTherapyStart(LocalDate ergoTherapyStart) {
    this.ergoTherapyStart = ergoTherapyStart;
  }

  public LocalDate getErgoTherapyEnd() {
    return ergoTherapyEnd;
  }

  public void setErgoTherapyEnd(LocalDate ergoTherapyEnd) {
    this.ergoTherapyEnd = ergoTherapyEnd;
  }

  public LocalDate getPhysioTherapyStart() {
    return physioTherapyStart;
  }

  public void setPhysioTherapyStart(LocalDate physioTherapyStart) {
    this.physioTherapyStart = physioTherapyStart;
  }

  public LocalDate getPhysioTherapyEnd() {
    return physioTherapyEnd;
  }

  public void setPhysioTherapyEnd(LocalDate physioTherapyEnd) {
    this.physioTherapyEnd = physioTherapyEnd;
  }

  public String getAdditionalTherapies() {
    return additionalTherapies;
  }

  public void setAdditionalTherapies(String additionalTherapies) {
    this.additionalTherapies = additionalTherapies;
  }

  public Boolean getPersonalConspicuities() {
    return personalConspicuities;
  }

  public void setPersonalConspicuities(Boolean personalConspicuities) {
    this.personalConspicuities = personalConspicuities;
  }

  public String getClubSport() {
    return clubSport;
  }

  public void setClubSport(String clubSport) {
    this.clubSport = clubSport;
  }

  public String getOtherInterests() {
    return otherInterests;
  }

  public void setOtherInterests(String otherInterests) {
    this.otherInterests = otherInterests;
  }

  public Boolean getCanSwim() {
    return canSwim;
  }

  public void setCanSwim(Boolean canSwim) {
    this.canSwim = canSwim;
  }

  public Boolean getHasSeahorseBadge() {
    return hasSeahorseBadge;
  }

  public void setHasSeahorseBadge(Boolean hasSeahorseBadge) {
    this.hasSeahorseBadge = hasSeahorseBadge;
  }

  public boolean hasEdits() {
    return getPropertiesToValidate()
        .map(prop -> PropertyUtils.read(this, prop))
        .anyMatch(Objects::nonNull);
  }

  public Stream<PropertyDescriptor> getPropertiesToValidate() {
    List<PropertyDescriptor> propertiesToIgnore =
        List.of(PropertyUtils.getPropertyDescriptor(Anamnesis.class, Anamnesis::getProcedure));

    return PropertyUtils.getPropertyDescriptors(Anamnesis.class).stream()
        .filter(prop -> !propertiesToIgnore.contains(prop))
        .filter(PropertyUtils::isFullyAccessible);
  }

  public Integer getNumberOfSiblings() {
    return numberOfSiblings;
  }

  public void setNumberOfSiblings(Integer numberOfSiblings) {
    this.numberOfSiblings = numberOfSiblings;
  }

  public Boolean getWasInDaycare() {
    return wasInDaycare;
  }

  public void setWasInDaycare(Boolean wasInDaycare) {
    this.wasInDaycare = wasInDaycare;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String notes) {
    this.note = notes;
  }
}
