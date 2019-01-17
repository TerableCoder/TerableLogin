const path = require('path');
const fs = require('fs');

if(!fs.existsSync(path.join(__dirname, './data'))) {
    fs.mkdirSync(path.join(__dirname, './data'));
}

function getJsonData(pathToFile) {
    try {
        return JSON.parse(fs.readFileSync(path.join(__dirname, pathToFile)));
    }catch(e) {
        return undefined;
    }
}

function saveJsonData(pathToFile, data) {
    fs.writeFileSync(path.join(__dirname, pathToFile), JSON.stringify(data, null, "    "));
}

module.exports = function TerableLogin(dispatch) {	
	const command = dispatch.command || dispatch.require.command;
	
	command.add(['tlogin', 'teralogin', 'terablelogin'], {
		$default() {
    		saveJsonData(settingsPath, );
        	command.message(`TerableLogin cleared. The next char you login will be set as the default login.`);
    	}
	});
	
    /*
        Let character select screen and client account settings to finish loading. May need to be adjusted for your CPU.
        No delay works but sometimes the "wind sound effect" from the "warping loading screen" will continue to play afterwards if you switch servers.
		If you set the delay too low your UI gets messed up.
    */
    //const delay = 8000; 
    const delay = 4000; // I play with ingame sounds off
	
    let settingsPath,
    enabled = true,
	data;
	
    dispatch.hook('S_LOGIN_ACCOUNT_INFO', 1, (event) => {
        settingsPath = `./data/${event.serverName}.json`;
        if (!enabled) return;
        
        data = getJsonData(settingsPath);
        if (data) {
            setTimeout(()=>{
                dispatch.toServer('C_SELECT_USER', 1, Object.assign({}, data));
            }, delay);
        }
        enabled = false;
    });
    
    dispatch.hook('C_SELECT_USER', 1, (event) => {
		data = getJsonData(settingsPath);
		if(!data) saveJsonData(settingsPath, Object.assign({}, event));
    });
    
}
