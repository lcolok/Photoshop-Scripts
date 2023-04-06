#target photoshop

function main() {
    if (app.documents.length === 0) {
        alert('请打开一个PSD文档。');
        return;
    }

    var doc = app.activeDocument;
    var outputPath = Folder.selectDialog('请选择导出PNG文件的文件夹。');

    if (!outputPath) {
        return;
    }

    var initialVisibility = storeInitialVisibility(doc.layers);

    for (var i = 0; i < doc.layers.length; i++) {
        if (initialVisibility[i]) {
            hideAllLayersExcept(doc.layers, i);
            exportLayerAsPNG(doc.layers[i], outputPath);
        }
    }

    restoreInitialVisibility(doc.layers, initialVisibility);

    alert('图层已成功导出为PNG文件。');
}

function storeInitialVisibility(layers) {
    var initialVisibility = [];

    for (var i = 0; i < layers.length; i++) {
        initialVisibility.push(layers[i].visible);
    }

    return initialVisibility;
}

function restoreInitialVisibility(layers, initialVisibility) {
    for (var i = 0; i < layers.length; i++) {
        layers[i].visible = initialVisibility[i];
    }
}

function hideAllLayersExcept(layers, indexToKeepVisible) {
    for (var i = 0; i < layers.length; i++) {
        if (i !== indexToKeepVisible) {
            layers[i].visible = false;
        } else {
            layers[i].visible = true;
        }
    }
}

function exportLayerAsPNG(layer, outputPath) {
    app.activeDocument.activeLayer = layer;

    var layerName = layer.name.replace(/[:\/\\*\?\"\<\>\|]/g, '_');
    var saveFile = File(outputPath + '/' + layerName + '.png');

    var options = new PNGSaveOptions();
    options.interlaced = false;
    options.transparency = true;

    app.activeDocument.saveAs(saveFile, options, true, Extension.LOWERCASE);
}

main();
