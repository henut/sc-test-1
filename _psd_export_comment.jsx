// 导出"评论"组区域为 PNG,用于查看真实排版
app.displayDialogs = DialogModes.NO;
var log = [];
function logIt(s){ log.push(String(s)); }

try {
  app.preferences.rulerUnits = Units.PIXELS;
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

  // 隐藏除 style1/评论 之外的顶层组,只留评论可见,便于截图
  var grp = findSet(doc.layers, "评论");
  logIt("评论组 bounds: " + grp.bounds);

  // 仅复制评论组区域:先全选区域 -> 合并复制
  // 使用选区+copy:选 评论组 bounds 区域
  var b = grp.bounds;
  var x0 = b[0].as("px"), y0 = b[1].as("px"), x1 = b[2].as("px"), y1 = b[3].as("px");
  // 给点余量
  x0 -= 20; y0 -= 20; x1 += 20; y1 += 20;
  doc.selection.select([[x0,y0],[x1,y0],[x1,y1],[x0,y1]]);

  // 合并拷贝 CpyM
  executeAction(charIDToTypeID("CpyM"), undefined, DialogModes.NO);

  var w = x1 - x0, h = y1 - y0;
  var nd = app.documents.add(w, h, 72, "comment_crop", NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
  nd.paste();

  var outFile = new File("C:/Users/v_hejiandong/WorkBuddy/2026-09-09-15-59-08/_psd_comment.png");
  var opts = new ExportOptionsSaveForWeb();
  opts.format = SaveDocumentType.PNG;
  opts.PNG8 = false;
  opts.transparency = true;
  nd.exportDocument(outFile, ExportType.SAVEFORWEB, opts);
  nd.close(SaveOptions.DONOTSAVECHANGES);
  logIt("已导出: _psd_comment.png size=" + w + "x" + h);

  doc.selection.deselect();
  doc.close(SaveOptions.DONOTSAVECHANGES);
} catch(err){ logIt("ERROR: " + err); }
log.join("\n");
