// 通过 textStyleRange 列表精确读取每段文字的字号/行距/字距/字体
app.displayDialogs = DialogModes.NO;
var log = [];
function logIt(s){ log.push(String(s)); }
function dumpDesc(desc, indent, depth){
  if (depth > 4) return;
  var cnt=0; try{ cnt=desc.count; }catch(e){ return; }
  for (var i=0;i<cnt;i++){
    var key = desc.getKey(i);
    var name=""; try{ name=String(key); }catch(e){ name="?"; }
    var vt=0; try{ vt=desc.getType(key); }catch(e){}
    try{
      if (vt===DescValueType.DOUBLETYPE) logIt(indent+name+" = "+desc.getDouble(key));
      else if (vt===DescValueType.UNITDOUBLE) logIt(indent+name+" = "+desc.getUnitDoubleValue(key)+" (unit)");
      else if (vt===DescValueType.INTEGERTYPE) logIt(indent+name+" = int "+desc.getInteger(key));
      else if (vt===DescValueType.STRINGTYPE) logIt(indent+name+" = str "+desc.getString(key));
      else if (vt===DescValueType.BOOLEANTYPE) logIt(indent+name+" = bool "+desc.getBoolean(key));
      else if (vt===DescValueType.OBJECTTYPE){ logIt(indent+name+" [OBJ]"); dumpDesc(desc.getObjectValue(key), indent+"  ", depth+1); }
      else if (vt===DescValueType.LISTTYPE){
        var lst=desc.getList(key); logIt(indent+name+" LIST len="+lst.count);
        for (var j=0;j<lst.count;j++){
          try{ var it=lst.getObjectValue(j); dumpDesc(it, indent+"    ["+j+"] ", depth+1); }catch(e){}
        }
      }
      else logIt(indent+name+" = <type "+vt+">");
    }catch(e){ logIt(indent+name+" <err>"); }
  }
}
try{
  var doc = app.open(new File("Y:/英雄联盟赛事/SC-PSD/B站SC/B站SC新版.psd"));
  function findSet(layers,name){
    for(var i=0;i<layers.length;i++){var l=layers[i];
      if(l.typename==="LayerSet"){ if(l.name===name) return l; var r=findSet(l.layers,name); if(r) return r; } }
    return null;
  }
  var grp=findSet(doc.layers,"评论");
  for(var i=0;i<grp.layers.length;i++){
    var l=grp.layers[i]; var k=""; try{k=l.kind;}catch(e){}
    if(k!==LayerKind.TEXT) continue;
    logIt("########## "+l.name.substring(0,18)+" ##########");
    doc.activeLayer=l;
    var ref=new ActionReference();
    ref.putEnumerated(charIDToTypeID("Lyr "),charIDToTypeID("Ordn"),charIDToTypeID("Trgt"));
    var d=executeActionGet(ref);
    var tk=d.getObjectValue(stringIDToTypeID("textKey"));
    dumpDesc(tk,"  ",0);
  }
  doc.close(SaveOptions.DONOTSAVECHANGES);
}catch(e){ logIt("ERROR: "+e); }
log.join("\n");
