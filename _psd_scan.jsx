// 扫描 PSD 图层结构,输出所有图层/图层组的名称、类型、bounds、可见性
// 重点找"评论组"相关的组和文字图层
app.displayDialogs = DialogModes.NO;

var log = [];
function logIt(s){ log.push(String(s)); }

try {
  var doc = app.open(new File("Y:/英雄联盟赛事/SC-PSD/B站SC/B站SC新版.psd"));
  logIt("=== 文档信息 ===");
  logIt("name=" + doc.name + " width=" + doc.width + " height=" + doc.height + " resolution=" + doc.resolution);

  function boundsStr(b){
    if(!b) return "null";
    // b = [left, top, right, bottom] in UnitValue
    return "L=" + Math.round(b[0].as("px")) + " T=" + Math.round(b[1].as("px")) + " R=" + Math.round(b[2].as("px")) + " B=" + Math.round(b[3].as("px"))
      + " W=" + Math.round(b[2].as("px")-b[0].as("px")) + " H=" + Math.round(b[3].as("px")-b[1].as("px"));
  }

  function walk(layers, depth){
    for (var i=0; i<layers.length; i++){
      var l = layers[i];
      var indent = "";
      for (var d=0; d<depth; d++) indent += "  ";
      var kindStr = "";
      try { kindStr = l.kind; } catch(e){ kindStr = "?"; }
      var vis = l.visible ? "V" : "H";
      logIt(indent + "[" + i + "] " + l.name + " (kind=" + kindStr + ", " + vis + ") bounds: " + boundsStr(l.bounds));
      if (l.typename === "LayerSet"){
        walk(l.layers, depth+1);
      } else if (kindStr === LayerKind.TEXT){
        try {
          var ti = l.textItem;
          var tsz = ti.size; // UnitValue
          logIt(indent + "    TEXT: \"" + ti.contents.replace(/\r/g,"\\r").replace(/\n/g,"\\n") + "\"");
          logIt(indent + "    font=" + ti.font + " size=" + tsz.value + tsz.type + " leading=" + ti.leading.value + ti.leading.type + " tracking=" + ti.tracking);
          try { logIt(indent + "    color=" + ti.color.rgb.hexValue); } catch(e2){}
          // 位置
          try {
            var b = l.bounds;
            logIt(indent + "    textBounds L=" + Math.round(b[0].as("px")) + " T=" + Math.round(b[1].as("px")) + " W=" + Math.round(b[2].as("px")-b[0].as("px")) + " H=" + Math.round(b[3].as("px")-b[1].as("px")));
          } catch(e3){}
        } catch(e){ logIt(indent + "    <读取文字失败: " + e + ">"); }
      }
    }
  }

  walk(doc.layers, 0);
  doc.close(SaveOptions.DONOTSAVECHANGES);
} catch(err){
  logIt("ERROR: " + err);
}

log.join("\n");
