<#import "../common/forms.ftlh" as forms />

<#macro content hearingExaminationInfo="NUL" >
<#-- @ftlvariable name="hearingExaminationInfo" type="de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterHearingExaminationInfoDto" -->
  <table style="width: 100%;">
    <colgroup>
      <col style="width: 17%" />
      <col style="width: 17%" />
      <col style="width: 33%" />
      <col style="width: 33%" />
    </colgroup>
    <tr>
      <td>
        <@forms.checkbox checked=hearingExaminationInfo?isHash && !hearingExaminationInfo.conspicuous title="Nein"/>
      </td>
      <td>
        <@forms.checkbox checked=hearingExaminationInfo?isHash && hearingExaminationInfo.conspicuous title="Ja"/>
      </td>
      <td>
        <@forms.checkbox checked=hearingExaminationInfo?isHash && hearingExaminationInfo.clarificationArranged title="Abklärung veranlasst"/>
      </td>
      <td>
        <@forms.checkbox checked=hearingExaminationInfo?isHash && hearingExaminationInfo.underTreatment title="in Kontrolle / Behandlung"/>
      </td>
    </tr>
  </table>
</#macro>
