// Cookie Compliancy BEGIN
function GetCookie(name) {
    var arg=name+"=";
    var alen=arg.length;
    var clen=document.cookie.length;
    var i=0;
    while (i<clen) {
      var j=i+alen;
      if (document.cookie.substring(i,j)==arg)
        return "here";
      i=document.cookie.indexOf(" ",i)+1;
      if (i==0) break;
    }
    return null;
  }
  function testFirstCookie(){
      var offset = new Date().getTimezoneOffset();
      if ((offset >= -180) && (offset <= 0)) { // European time zones
          var visit=GetCookie("cookieCompliancyAccepted");
          if (visit==null){
             $("#myCookieConsent").fadeIn(400);	// Show warning
         } else {
              // Already accepted
         }		
      }
  }
  $(document).ready(function(){
      $("#cookieButton").click(function(){
          console.log('Understood');
          var expire=new Date();
          expire=new Date(expire.getTime()+7776000000);
          document.cookie="cookieCompliancyAccepted=here; expires="+expire+";path=/";
          $("#myCookieConsent").hide(400);
      });
      testFirstCookie();
  });
  // Cookie Compliancy END