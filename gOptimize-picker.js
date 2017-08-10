//final
(function(p,i,c,k){i=document.cookie.match('(?:^|;)\\s*_gaexp=([^;]*)'),c=document.location.href,k=i?decodeURIComponent(i[1]).split('.')[4]:null,(i=!~c.indexOf(p[k])&&p[k])&&window.location.replace(c.replace(/special(-2017)?\//, i))})(['special/','special-2017/'])


//dev
(function(p,i,c,k,a){i=document.cookie.match('(?:^|;)\\s*_gaexp=([^;]*)'),c=document.location.href,k=i?decodeURIComponent(i[1]).split('.')[4]:null,
a=c.match(/#*contacts\/*/),a=a&&a[0],
(i=!~c.indexOf(p[k])&&p[k])&&window.location.replace(c.replace(/special(-2017)?\//, i).replace(a,'#contactscontacts/'.replace(a,'')))})(['special/','special-2017/'])


var c = '/contacts/'; var a = c.match(/#*contacts\/*/);a=a&&a[0];c.replace(a,'#contactscontacts/'.replace(a,''))

(function(p,i,c,k,a){i=document.cookie.match('(?:^|;)\\s*_gaexp=([^;]*)'),c=document.location.href,k=i?decodeURIComponent(i[1]).split('.')[4]:null,
a=c.match(/#*contacts\/*/),a=a&&a[0],console.log(a),k=1,
(i=!~c.indexOf(p[k])&&p[k])&&console.log(c.replace(/special(-2017)?\//, i).replace(a,'#contactscontacts/'.replace(a,'')))})(['special/','special-2017/'])
