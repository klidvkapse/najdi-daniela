const FOLDER_ID = "1_PBRMUkpc1iA891GHhuSXpGh0WL69KbR";
const DATA_FILE_NAME = "NAJDI_ME_ZPRAVY.json";
function output(data, callback) {
  const body = JSON.stringify(data);
  if (callback && /^[a-zA-Z_$][\w$.]*$/.test(callback)) return ContentService.createTextOutput(callback + "(" + body + ");").setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}
function folder(){ return DriveApp.getFolderById(FOLDER_ID); }
function dataFile(){ const files=folder().getFilesByName(DATA_FILE_NAME); return files.hasNext()?files.next():folder().createFile(DATA_FILE_NAME,'{"messages":[]}',MimeType.PLAIN_TEXT); }
function readMessages(){ const parsed=JSON.parse(dataFile().getBlob().getDataAsString()||'{"messages":[]}'); return Array.isArray(parsed.messages)?parsed.messages:[]; }
function saveMessages(messages){ dataFile().setContent(JSON.stringify({messages})); }
function doGet(e){ try{return output({success:true,messages:readMessages()},e&&e.parameter?e.parameter.callback:"");}catch(err){return output({success:false,error:String(err)},e&&e.parameter?e.parameter.callback:"");} }
function doPost(e){
  try{
    const d=JSON.parse(e.postData&&e.postData.contents?e.postData.contents:"{}");
    const password=PropertiesService.getScriptProperties().getProperty("ADMIN_PASSWORD");
    if(!password||d.password!==password)return output({success:false,error:"Nesprávné heslo."});
    let messages=readMessages();
    if(d.action==="publish"){
      let imageUrl=String(d.imageUrl||"");
      if(d.imageBase64){ const bytes=Utilities.base64Decode(d.imageBase64); const file=folder().createFile(Utilities.newBlob(bytes,d.mimeType||"image/jpeg","zprava_"+Date.now())); file.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW); imageUrl="https://drive.google.com/thumbnail?id="+file.getId()+"&sz=w1600"; }
      const item={id:Utilities.getUuid(),message:String(d.message||"").slice(0,1000),imageUrl:imageUrl,createdAt:new Date().toISOString()}; messages.unshift(item);saveMessages(messages);return output({success:true,message:item});
    }
    if(d.action==="update"){ const item=messages.find(x=>x.id===d.id);if(!item)throw new Error("Zpráva nebyla nalezena.");item.message=String(d.message||"").slice(0,1000);saveMessages(messages);return output({success:true,messages:messages}); }
    if(d.action==="delete"){ messages=messages.filter(x=>x.id!==d.id);saveMessages(messages);return output({success:true,messages:messages}); }
    return output({success:false,error:"Neznámá akce."});
  }catch(err){return output({success:false,error:String(err)});}
}
