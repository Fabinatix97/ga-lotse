<#import "../common/forms.ftlh" as forms />

<#macro content eyeExaminationInfo="NUL" >
<#-- @ftlvariable name="eyeExaminationInfo" type="de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterEyeExaminationInfoDto" -->
  <table style="width: 100%; line-height: 1rem;">
    <colgroup>
      <col style="width: 17%" />
      <col style="width: 17%" />
      <col style="width: 33%" />
      <col style="width: 33%" />
    </colgroup>
    <tr>
      <td>
        <@forms.checkbox checked=eyeExaminationInfo?isHash && !eyeExaminationInfo.conspicuous title="Nein"/>
      </td>
      <td>
        <@forms.checkbox checked=eyeExaminationInfo?isHash && eyeExaminationInfo.conspicuous title="Ja"/>
      </td>
      <td>
        <@forms.checkbox checked=eyeExaminationInfo?isHash && eyeExaminationInfo.clarificationArranged title="Abklärung veranlasst"/>
      </td>
      <td>
        <@forms.checkbox checked=eyeExaminationInfo?isHash && eyeExaminationInfo.underTreatment title="in Kontrolle / Behandlung"/>
      </td>
    </tr>
    <tr>
      <td colspan="2"></td>
      <td>
        <@forms.checkbox checked=eyeExaminationInfo?isHash && eyeExaminationInfo.spectacleWearer title="Brillenträger"/>
      </td>
      <td>
        <@forms.checkbox checked=eyeExaminationInfo?isHash && eyeExaminationInfo.colorSenseDisorder title="Farbsinnstörung"/>
      </td>
    </tr>
  </table>
</#macro>
