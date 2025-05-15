<#import "../common/forms.ftlh" as forms>
<#macro content type="NUL" examination="NUL">
<#-- @ftlvariable name="type" type="de.eshg.schoolentry.pdf.schoolinfoletter.model.SchoolInfoLetterExaminationTypeDto" -->
<#-- @ftlvariable name="examination" type="de.eshg.schoolentry.pdf.schoolinfoletter.model.SchoolInfoLetterExaminationDto" -->
  <table style="width: 70%; margin: 1mm 0 1mm 0;">
    <colgroup>
      <col style="width: 25%"/>
      <col style="width: 25%"/>
      <col style="width: 25%"/>
      <col style="width: 25%"/>
    </colgroup>
    <tr>
      <td>
        <@forms.checkbox checked=type?isHash && type.name() == "REGULAR_EXAMINATION" title="Regelkind"/>
      </td>
      <td>
        <@forms.checkbox checked=type?isHash && type.name() == "CAN_CHILD" title="Kann-Kind"/>
      </td>
      <td>
        <@forms.checkbox checked=type?isHash && type.name() == "ENTRY_LEVEL" title="Eingangsstufe"/>
      </td>
      <td>
        <@forms.checkbox checked=examination?isHash && examination.postponed title="Zurückgestellt"/>
      </td>
    </tr>
  </table>
</#macro>
