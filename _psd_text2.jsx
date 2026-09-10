// 方式2:通过 getObjectValue(textKey) 的 textStyleRange 读取文字样式
app.displayDialogs = DialogModes.NO;
var log = [];
function logIt(s){ log.push(String(s)); }

function dumpDesc(desc, indent, depth){
  if (depth > 3) return;
  var cnt = 0;
  try { cnt = desc.count; } catch(e){ logIt(indent + "<no count>"); return; }
  for (var i=0;i<cnt;i++){
    var key = desc.getKey(i);
    var tid = key.type;
    var name = "";
    try { name = key.getID ? String(key) : String(key); } catch(e){ name = "?"; }
    var valStr = "";
    try {
      var vt = desc.getType(key);
      if (vt === DescValueType.DOUBLETYPE) valStr = "D=" + desc.getDouble(key);
      else if (vt === DescValueType.INTEGERTYPE) valStr = "I=" + desc.getInteger(key);
      else if (vt === DescValueType.STRINGTYPE) valStr = "S=" + desc.getString(key);
      else if (vt === DescValueType.BOOLEANTYPE) valStr = "B=" + desc.getBoolean(key);
      else if (vt === DescValueType.OBJECTTYPE) { logIt(indent + name + " [OBJ]"); dumpDesc(desc.getObjectValue(key), indent+"  ", depth+1); continue; }
      else if (vt === DescValueType.LISTTYPE) valStr = "LIST(len=" + desc.getList(key).count + ")";
      else if (vt === DescValueType.UNITDOUBLE) valStr = "U=" + desc.getUnitDoubleValue(key);
      else valStr = "other(" + vt + ")";
    } catch(e){ valStr = "<err " + e + ">"; }
    logIt(indent + name + ": " + valStr);
  }
}

try {
  var doc = app.open(new File("Y:/英雄联盟赛事/SC-PSD/B站SC/B站SC新版.psd"));
  function findSet(layers, name){
    for (var i=0;i<layers.length;i++){
      var l = layers[i];
      if (l.typename === "LayerSet"){
        if (l.name === name) return l;
        var r = findSet(l.layers, name); if (r) return r;
      }
    }
    return null;
  }
  var grp = findSet(doc.layers, "评论");
  for (var i=0;i<grp.layers.length;i++){
    var l = grp.layers[i];
    var k=""; try{ k=l.kind; }catch(e){}
    if (k !== LayerKind.TEXT) continue;
    logIt("========== 图层: " + l.name.substring(0,20) + " ==========");
    doc.activeLayer = l;
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var desc = executeActionGet(ref);
    var textKey = desc.getObjectValue(stringIDToTypeID("textKey"));
    logIt("--- textKey 内容 ---");
    dumpDesc(textKey, "  ", 0);
  }
  doc.close(SaveOptions.DONOTSAVECHANGES);
} catch(err){ logIt("ERROR: " + err); }
log.join("\n");
