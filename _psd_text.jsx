// 用 ActionManager 读取评论组内文字图层的字体/字号/行距/字距等属性
app.displayDialogs = DialogModes.NO;
var log = [];
function logIt(s){ log.push(String(s)); }

try {
  var doc = app.open(new File("Y:/英雄联盟赛事/SC-PSD/B站SC/B站SC新版.psd"));

  // 找到"评论"组
  function findSet(layers, name){
    for (var i=0;i<layers.length;i++){
      var l = layers[i];
      if (l.typename === "LayerSet"){
        if (l.name === name) return l;
        var r = findSet(l.layers, name);
        if (r) return r;
      }
    }
    return null;
  }

  var grp = findSet(doc.layers, "评论");
  if (!grp){ logIt("未找到 评论 组"); }
  else {
    logIt("=== 评论组 内文字图层属性 ===");
    for (var i=0;i<grp.layers.length;i++){
      var l = grp.layers[i];
      var k = "";
      try { k = l.kind; } catch(e){}
      if (k !== LayerKind.TEXT) continue;

      logIt("--- 图层: " + l.name + " ---");
      try { logIt("  contents=" + l.textItem.contents); } catch(e){}

      // ActionManager: 获取 textKey
      try {
        var ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        // 选择该层
        doc.activeLayer = l;
        var ref2 = new ActionReference();
        ref2.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        var desc = executeActionGet(ref2);
        var textKey = desc.getObjectValue(stringIDToTypeID("textKey"));
        // 字体
        try { logIt("  fontName=" + textKey.getString(stringIDToTypeID("fontPostScriptName"))); } catch(e){ logIt("  fontPostScriptName NG:"+e); }
        // 字号 (textSize)
        try { logIt("  textSize=" + textKey.getDouble(stringIDToTypeID("textSize")) + "pt"); } catch(e){ logIt("  textSize NG:"+e); }
        // leading
        try { logIt("  leading(auto?)=" + textKey.getBoolean(stringIDToTypeID("autoLeading"))); } catch(e){}
        try { logIt("  leadingSize=" + textKey.getDouble(stringIDToTypeID("leadingSize")) + "pt"); } catch(e){ logIt("  leadingSize NG"); }
        // tracking
        try { logIt("  tracking=" + textKey.getInteger(stringIDToTypeID("tracking"))); } catch(e){ logIt("  tracking NG"); }
        // 颜色
        try {
          var col = textKey.getObjectValue(stringIDToTypeID("textColor"));
          var rd = col.getObjectValue(stringIDToTypeID("RGBC"));
          var r = Math.round(rd.getDouble(stringIDToTypeID("red"))*255);
          var g = Math.round(rd.getDouble(stringIDToTypeID("green"))*255);
          var b = Math.round(rd.getDouble(stringIDToTypeID("blue"))*255);
          logIt("  color=rgb(" + r + "," + g + "," + b + ")");
        } catch(e){ logIt("  color NG"); }
      } catch(e){ logIt("  ActionManager 失败: " + e); }
    }
  }

  doc.close(SaveOptions.DONOTSAVECHANGES);
} catch(err){ logIt("ERROR: " + err); }
log.join("\n");
