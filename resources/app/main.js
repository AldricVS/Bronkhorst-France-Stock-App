const {app, BrowserWindow} = require('electron')

function createWindow(){
    const winW = 1280;
    const winH = 720;

    let win = new BrowserWindow({
        width: winW,
        height: winH,
        webPreferences:{
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true,
            enableRemoteModule: true
        }
    })

    win.loadFile('index.html')
    win.removeMenu();

    win.on('close', function(e){
        var dialog = require('electron').dialog;
        var answer = dialog.showMessageBoxSync(this, 
            {
                type: "question",
                buttons: ['Oui', 'Non'],
                defaultId: 1,
                title: "Quitter ?",
                message: "Voulez-vous vraiment quitter ?\nToutes les modifications apportées non sauvegardées ne seront pas sauvegardées !"
            });
        if(answer == 1){
            e.preventDefault();
        }
    })
}

app.whenReady().then(createWindow)