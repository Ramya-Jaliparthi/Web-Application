COMMENTS:
> FRD used - https://bcbsma.atlassian.net/wiki/spaces/MOS/pages/339280051/My+Preferences
> Base FRD version - V46 (Draft) as on May 1st

SCOPEs:
> Registered
> Authed



TASKS:
> FORM ELEMENTS
> FORM VALIDATIONS
> FORM CSS
> UPLOAD COMPONENT
> API - MemberInfo
> DATA OBJECTS

DEV NOTES:
> https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
> get only encoded - event.target.result.split(',')[1]
> if(file.type === "image/jpeg" ||
    file.type === "image/png"){
      this.upload_files.push(event.target.result);
      this.localUrl.push(event.target.result);
  }else if(file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type === "application/msword"){
      this.upload_files.push(event.target.result);
      this.localUrl.push('assets/images/if_word.png');
  }else if(file.type === "application/pdf"){
      this.upload_files.push(event.target.result);
      this.localUrl.push('assets/images/if_pdf.png');
  }


    alert(arguments.callee.toString());