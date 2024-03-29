/**
 * @name FullResAvatars
 * @author GentlePuppet
 * @authorId 199263542833053696
 * @version 4.0.5
 * @description Hover over avatars to see a bigger version.
 * @website https://github.com/GentlePuppet/FullResAvatar.plugin.js/
 * @source https://raw.githubusercontent.com/GentlePuppet/FullResAvatar.plugin.js/main/FullSizeAvatars.plugin.js
 * @updateUrl https://raw.githubusercontent.com/GentlePuppet/FullResAvatar.plugin.js/main/FullSizeAvatars.plugin.js
 */
const fs = require("fs");

const configFile = require("path").join(BdApi.Plugins.folder, "FullResAvatars.Config.json");

const defaultConfig = {
    EnableUpdates: 1,
    SilentUpdates: 0,
	imagesize: 512,
	panelsize: 256,
	info: {
		name: "Full Res Avatars On Hover",
		id: "FullSizeAvatars",
		version: "4.0.5",
		updateUrl: "https://raw.githubusercontent.com/GentlePuppet/FullResAvatar.plugin.js/main/FullSizeAvatars.plugin.js",
	}
};

let config = {};

module.exports = class {	
	getName() { return defaultConfig.info.name; }
    constructor() {this.settingsPanel = null;}
    load() {
        if (fs.existsSync(configFile)) {
            try {
                const configFileData = fs.readFileSync(configFile, "utf-8");
                const savedConfig = JSON.parse(configFileData);
                config = { ...defaultConfig, ...savedConfig };
                return config;
            } catch (error) {
                console.error("Error loading config from file:", error);
            }
        }
        else {
            try {
                const configToSave = { ...defaultConfig };
                delete configToSave.info;
                fs.writeFileSync(configFile, JSON.stringify(configToSave, null, 4));
                console.log("Config saved to file successfully.");
            } catch (error) {
                console.error("Error saving config to file:", error);
            }
        }

    }
	//---- Start Plugin
    start() {	
		//---- Create Popout Image Panel
		if (document.getElementById("IPH")) {document.getElementById("IPH").remove();}
		const ip = document.createElement("img");
		document.body.after(ip);
		ip.setAttribute("id", "IPH");
		ip.setAttribute("style", "height:" + Number(config.panelsize + 5) + "px;width:" + Number(config.panelsize + 5) + "px;padding:5px;display:none;z-index:999999;position:absolute;");

		//---- Create Track Mouse Event
		document.addEventListener("mousemove", this.mmhfunc) 
        
        this.CheckifUpdate();
    }
	
    getSettingsPanel() {
        const configFileData = fs.readFileSync(configFile, "utf-8");
        const savedConfig = JSON.parse(configFileData);
        config = { ...defaultConfig, ...savedConfig };

        this.settingsPanel = document.createElement("div");
        this.settingsPanel.setAttribute("id", "settings-panel");
        this.settingsPanel.setAttribute("style", "display:grid; padding: 20px; z-index: 1000;");

        const gridContainer = document.createElement("div");
        gridContainer.setAttribute("style", "color: var(--header-primary); display: grid; grid-template-columns: 1fr 1fr; gap: 5px;");

        // Create input fields for config settings and their respective labels
        const enableUpdatesLabel = document.createElement("label");
        enableUpdatesLabel.textContent = "Enable Updates";
        const enableUpdatesInput = document.createElement("input");
        enableUpdatesInput.setAttribute("type", "checkbox");
        enableUpdatesInput.checked = config.EnableUpdates === 1;
	    
        const silentUpdatesLabel = document.createElement("label");
        silentUpdatesLabel.textContent = "Silent Updates";
        const silentUpdatesInput = document.createElement("input");
        silentUpdatesInput.setAttribute("type", "checkbox");
        silentUpdatesInput.checked = config.SilentUpdates === 1;

        const imageSizeLabel = document.createElement("label");
        imageSizeLabel.textContent = "Avatar Resolution";
        const imageSizeInput = document.createElement("input");
        imageSizeInput.setAttribute("type", "number");
        imageSizeInput.value = config.imagesize;

        const panelSizeLabel = document.createElement("label");
        panelSizeLabel.textContent = "Avatar Panel Size";
        const panelSizeInput = document.createElement("input");
        panelSizeInput.setAttribute("type", "number");
        panelSizeInput.value = config.panelsize;

        this.settingsPanel.appendChild(gridContainer);
        gridContainer.appendChild(enableUpdatesLabel);
        gridContainer.appendChild(enableUpdatesInput);
        gridContainer.appendChild(silentUpdatesLabel);
        gridContainer.appendChild(silentUpdatesInput);
        gridContainer.appendChild(imageSizeLabel);
        gridContainer.appendChild(imageSizeInput);
        gridContainer.appendChild(panelSizeLabel);
        gridContainer.appendChild(panelSizeInput);

        // Wait for the .bd-addon-modal-settings element to exist
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                    // .bd-addon-modal-settings element is now available
                    const bdaddon = document.querySelector(".bd-addon-modal-settings");
                    if (bdaddon) {
                        // Append the settings panel to .bd-addon-modal-settings
                        bdaddon.appendChild(this.settingsPanel);
                        const backdrop = document.querySelector('[class*="backdrop"]');
                        backdrop.removeEventListener("click");
                        // Override done button
                        const saveButton = document.querySelector('.bd-addon-modal > [class*="footer-"] > button');
                        saveButton.textContent = "Save";
                        saveButton.addEventListener("click", () => {
                            // Update config settings with input values
                            config.EnableUpdates = enableUpdatesInput.checked ? 1 : 0;
                            config.SilentUpdates = silentUpdatesInput.checked ? 1 : 0;
                            config.imagesize = parseInt(imageSizeInput.value);
                            config.panelsize = parseInt(panelSizeInput.value);
                            document.getElementById("IPH").setAttribute("style", "height:" + Number(config.panelsize + 5) + "px;width:" + Number(config.panelsize + 5) + "px;padding:5px;display:none;z-index:999999;position:absolute;");

            
                            // Save the updated config to the JSON file
                            this.saveConfigToFile();
                        });
                        observer.disconnect();
                        break;
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
	
	saveConfigToFile() {
        try {
            const configToSave = { ...config };
            // Exclude config.info from the saved configuration
            delete configToSave.info;
            fs.writeFileSync(configFile, JSON.stringify(configToSave, null, 4));
            console.log("Config saved to file successfully.");
        } catch (error) {
            console.error("Error saving config to file:", error);
        }
    }

	//---- Track Mouse Event Handler
	mmhfunc = (e) => this.fmm(e);
	
    stop() {
		document.removeEventListener('mousemove', this.mmhfunc);
		if (document.getElementById("IPH")) {document.getElementById("IPH").remove();}
		if (document.getElementById("FSAUpdateNotif")) {document.getElementById("FSAUpdateNotif").remove();}
	}
	
	//---- Track Mouse Event and Check If Hovering Over Avatars
	fmm(e){
		let container = document.querySelector("#app-mount")
		let mah = container.querySelector('[class^="member"] > [class^="memberInner"] > [class^="avatar"]:hover')
		let fah = container.querySelector('[class^="link"] > [class^="layout"] > [class^="avatar"]:hover')
		let fadmh = container.querySelector('[class^="listItemContents"] > [class^="userInfo"] > [class*="avatar"]:hover')
		let pah = container.querySelector('[class^="clickable"] > [class^="avatarHoverTarget"] > [class^="wrapper"]:hover')
		let ipm = document.querySelector("#IPH")
		let dih = (e.pageY / (container.offsetHeight) * 100);
		let diw = (e.pageX / (container.offsetWidth) * 100);
		
		if (!mah && !fah && !fadmh && !pah) {
			ipm.style.display = "none";
		} else {
			var ais = container.querySelector("div:hover > div > svg > foreignObject > div > img").src.replace( /\?size=\d+/g, '?size=' + config.imagesize);
			var status = container.querySelector("div:hover > div > svg > rect").getAttribute('fill');

			ipm.src = ais;
			ipm.style.display = "block";
			
			if (dih >= 75 && dih < 88) {ipm.style.top = e.pageY - (config.panelsize / 2 ) - 10 + 'px'} 
			else if (dih >= 88) {ipm.style.top = e.pageY - config.panelsize - 10 + 'px'} 
			else {ipm.style.top = e.pageY - 10 + 'px'}
			
			if (diw >= 50) {ipm.style.left = e.pageX - config.panelsize - 30 + 'px'} 
			else {ipm.style.left = e.pageX + 30 + 'px';}
			
			if (status == "transparent") {
				var statusfix = container.querySelector("div:hover > div > svg > svg > rect").getAttribute('fill');
				ipm.style.background = statusfix;
			} else {
				ipm.style.background = status;
			}
		}
	}
    
    CheckifUpdate() {
        if (!config.EnableUpdates) {
            console.log('FullSizeAvatars: Updates are disabled.');
            return;
        } 
        if (config.EnableUpdates) {
            console.log('FullSizeAvatars: Updates are Enabled')
            require("request").get(defaultConfig.info.updateUrl, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    const updatedPluginContent = body;
                    
                    // Extract the version from the plugin content
                    const match = updatedPluginContent.match(/version:\s*["'](\d+\.\d+\.\d+)["']/);
                    const updatedVersion = match ? match[1] : null;
        
                    // Check if the versions match
                    if (defaultConfig.info.version !== updatedVersion) {
                        if (config.SilentUpdates) {
                            console.log('FullSizeAvatars: Silent Updates are enabled.');
                            fs.writeFile(require("path").join(BdApi.Plugins.folder, "FullSizeAvatars.plugin.js"), updatedPluginContent, (err) => {
                                if (err) {
                                    console.error('FullSizeAvatars: Error writing updated file:', err);
                                } else {
                                    console.log('FullSizeAvatars: Updated successfully.');
                                }
                            })
                        } 
                        else {
                            console.log('FullSizeAvatars: Silent Updates are disabled.');
                            if (document.getElementById("FSAUpdateNotif")) {document.getElementById("FSAUpdateNotif").remove();}
                            const UpdateNotif = document.createElement("div");
                            const UpdateText = document.createElement("a");
                            const CloseUpdate = document.createElement("a");
                            const title = document.querySelector("#app-mount")
                            title.before(UpdateNotif); UpdateNotif.append(UpdateText); UpdateNotif.append(CloseUpdate);
                            UpdateNotif.setAttribute("id", "FSAUpdateNotif");
                            UpdateNotif.setAttribute("style", "text-align: center; background: var(--brand-experiment); padding: 5px;");
                            UpdateText.setAttribute("style", "color: white; text-decoration: underline;");
                            CloseUpdate.setAttribute("style", "color: white; padding-left: 1%");
                            UpdateText.textContent = "Click to update - Full Res Avatars On Hover";
                            CloseUpdate.textContent = "X";
                            UpdateText.addEventListener("click", () => {
                                fs.writeFile(require("path").join(BdApi.Plugins.folder, "FullSizeAvatars.plugin.js"), updatedPluginContent, (err) => {
                                    if (err) {
                                        console.error('FullSizeAvatars: Error writing updated file:', err);
                                    } else {
                                        console.log('FullSizeAvatars: Updated successfully.');
                                    }
                                })
                                UpdateNotif.remove()
                            });
                            CloseUpdate.addEventListener("click", () => {
                                UpdateNotif.remove()
                            });
                            return;
                        } 
                    } else { console.log("FullSizeAvatars: Plugin is Up-to-date") }
                } else {console.error('FullSizeAvatars: Error downloading update:', error)}
            })
        }
    }
}
