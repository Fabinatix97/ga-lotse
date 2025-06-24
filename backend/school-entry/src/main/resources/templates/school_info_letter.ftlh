<#import "components/common/base.ftlh" as base />
<#import "components/common/letterhead.ftlh" as letterhead />
<#import "components/common/address.ftlh" as address />
<#import "components/common/footer.ftlh" as footer />
<#import "components/common/forms.ftlh" as forms />
<#import "components/schoolinfoletter/title.ftlh" as schoolinfoletter_title />
<#import "components/schoolinfoletter/type.ftlh" as schoolinfoletter_type />
<#import "components/schoolinfoletter/school_and_promotion_hints.ftlh" as schoolinfoletter_schoolAndPromotionHints />
<#import "components/schoolinfoletter/vaccination_info.ftlh" as schoolinfoletter_vaccinationInfo />
<#import "components/schoolinfoletter/eye_examination_info.ftlh" as schoolinfoletter_eyeExaminationInfo />
<#import "components/schoolinfoletter/hearing_examination_info.ftlh" as schoolinfoletter_hearingExaminationInfo />
<#import "components/schoolinfoletter/therapy_and_promotion_info.ftlh" as schoolinfoletter_therapyAndPromotionInfo />
<#import "components/schoolinfoletter/physicians_recommendation.ftlh" as schoolinfoletter_physiciansRecommendation />


<#-- @ftlvariable name="departmentLogo" type="de.eshg.lib.document.generator.department.DepartmentLogo" -->
<#-- @ftlvariable name="office" type="de.eshg.schoolentry.pdf.Address" -->
<#-- @ftlvariable name="school" type="de.eshg.schoolentry.pdf.Address" -->
<#-- @ftlvariable name="examination" type="de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterExaminationDto" -->
<#-- @ftlvariable name="date" type="java.lang.String" -->

<#macro additionalStyle>
  h4 {
    font-size: 10pt;
    margin-bottom: 0;
  }
  h5 {
    font-size: 9pt;
    margin-bottom: 0;
  }
</#macro>

<@base.document title="Schulinfobrief" styles=[
  footer.style,
  letterhead.style,
  schoolinfoletter_title.style,
  additionalStyle
]>
  <@footer.content office=office />

  <@letterhead.content sender=office logo=departmentLogo date=date>
    <@address.content address=school />
  </@letterhead.content>

  <div class="body">

    <@schoolinfoletter_title.content child=examination.child date=examination.date schoolYear=examination.schoolYear />

    <@schoolinfoletter_type.content type=examination.type examination=examination />

    <h4>Schul- und förderrelevante Hinweise</h4>
    <@schoolinfoletter_schoolAndPromotionHints.content schoolAndPromotionHints=examination.schoolAndPromotionHints />

    <h5>Bemerkung</h5>
    <p>${examination.note!"--keine--"}</p>

    <@schoolinfoletter_vaccinationInfo.content vaccinationInfo=examination.vaccinationInfo />

    <h4>Sehscreening auffällig</h4>
    <@schoolinfoletter_eyeExaminationInfo.content eyeExaminationInfo=examination.eyeExaminationInfo/>

    <div style="page-break-after: always"></div>
    <h4>Hörscreening auffällig</h4>
    <@schoolinfoletter_hearingExaminationInfo.content hearingExaminationInfo=examination.hearingExaminationInfo />

    <h4>Gesundheitliche Einschränkung</h4>
    <@forms.checkbox checked=examination.consultationWithCustodianRecommended title="Rücksprache mit den Personensorgeberechtigten empfohlen"/>

    <h4>Laufende Therapien / Fördermaßnahmen</h4>
    <@schoolinfoletter_therapyAndPromotionInfo.content therapyAndPromotionInfo=examination.therapyAndPromotionInfo />

    <h4>Schulärztliche Empfehlung</h4>
    <@schoolinfoletter_physiciansRecommendation.content physiciansRecommendation=examination.physiciansRecommendation />

    <#if (examination.customRecommendation!"")?has_content>
      <h5>Kommentar</h5>
      <p>${examination.customRecommendation}</p>
    </#if>

    <h4>Elternwunsch</h4>
    <p>${examination.parentsWish.note!"--keinen--"}</p>
    <@forms.checkbox checked=examination.parentsWish.referredToFurtherConsultationFromSchool title="auf weitere Beratung der Schule verwiesen" />

    <div style="margin-top: 2cm;">
      <div>Im Auftrag</div>
      <div>Ihr Kinder- und Jugendgesundheitsdienst</div>
    </div>

  </div>
</@base.document>
