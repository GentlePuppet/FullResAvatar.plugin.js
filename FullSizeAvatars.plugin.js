/**
 * @name FullResAvatars
 * @author GentlePuppet
 * @authorId 199263542833053696
 * @version 3.9.0
 * @description Hover over avatars to see a bigger version.
 * @website https://github.com/GentlePuppet/FullResAvatar.plugin.js/
 * @source https://raw.githubusercontent.com/GentlePuppet/FullResAvatar.plugin.js/main/FullSizeAvatars.plugin.js
 * @updateUrl https://raw.githubusercontent.com/GentlePuppet/FullResAvatar.plugin.js/main/FullSizeAvatars.plugin.js
 */
const fs = require("fs");
const cpath = require("path");
const crequest = require("request");

const configFile = cpath.join(BdApi.Plugins.folder, "FullResAvatars.Config.json");

let config = {
    EnableUpdates: 0,
	imagesize: 512,
	panelsize: 256,
	info: {
		name: "Full Res Avatars On Hover",
		id: "FullSizeAvatars",
		version: "3.9.0",
		updateUrl: "https://raw.githubusercontent.com/GentlePuppet/FullResAvatar.plugin.js/main/FullSizeAvatars.plugin.js",
	}
};

module.exports = class {	
	getName() { return config.info.name; }
    constructor() {this.settingsPanel = null;}
    //---- Check url and update plugin
    load() {
        function saveConfigToFile() {
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
        if (fs.existsSync(configFile)) {
            try {
                const configFileData = fs.readFileSync(configFile, "utf-8");
                const savedConfig = JSON.parse(configFileData);
                config = { ...config, ...savedConfig };
            } catch (error) {
                console.error("Error loading config from file:", error);
            }
        }
        else {
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
        if (!config.EnableUpdates) {
            console.log('Updates are disabled.');
            return;
        }
        crequest.get(config.info.updateUrl, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const updatedPluginContent = body;
                
                // Extract the version from the plugin content
                const versionRegex = /version:\s*["'](\d+\.\d+\.\d+)["']/;
                const match = updatedPluginContent.match(versionRegex);
                const updatedVersion = match ? match[1] : null;
    
                // Check if the versions match
                if (config.info.version !== updatedVersion) {
                    // Versions don't match, update the plugin
    
                    // Write the updated content to the plugin file
                    fs.writeFile(cpath.join(BdApi.Plugins.folder, "FullSizeAvatars.plugin.js"), updatedPluginContent, (err) => {
                        if (err) {
                            console.error('Error writing updated FullSizeAvatars file:', err);
                        } else {
                            console.log('Plugin updated successfully.');
                        }
                    });
                } else {
                    console.log('FullSizeAvatars is already up to date.');
                }
            } else {
                console.error('Error downloading FullSizeAvatars update:', error);
            }
        });
    }
	//---- Start Plugin
    start() {	
		//---- Create Image Panel
		if (document.getElementById("IPH")) {document.getElementById("IPH").remove();}
		const ip = document.createElement("img");
		document.body.after(ip);
		ip.setAttribute("id", "IPH");
		ip.setAttribute("style", "height:" + Number(config.panelsize + 5) + "px;width:" + Number(config.panelsize + 5) + "px;padding:5px;display:none;z-index:999999;position:absolute;");

		//---- Create Track Mouse Event
		document.addEventListener("mousemove", this.mmhfunc) 
    }
	// Settings
    getSettingsPanel() {
        this.settingsPanel = document.createElement("div");
        this.settingsPanel.setAttribute("id", "settings-panel");
        this.settingsPanel.setAttribute("style", "display:grid; padding: 20px; z-index: 1000;");

        const gridContainer = document.createElement("div");
        gridContainer.setAttribute("style", "color: var(--header-primary); display: grid; grid-template-columns: 1fr 1fr; gap: 5px;");

        // Create input fields for config settings and their respective labels
        const enableUpdatesLabel = document.createElement("label");
        enableUpdatesLabel.textContent = "Enable Auto Updates (0 or 1)";
        const enableUpdatesInput = document.createElement("input");
        enableUpdatesInput.setAttribute("type", "number");
        enableUpdatesInput.value = config.EnableUpdates;

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
                            config.EnableUpdates = parseInt(enableUpdatesInput.value);
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
	// Save Config to File
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
		document.getElementById("IPH").remove();
	};
	
	//---- Track Mouse Event and Check If Hovering Over Avatars
	fmm(e){
		let container = document.querySelector("#app-mount")
		let mah = container.querySelector('[class^="member-"] > [class^="memberInner-"] > [class^="avatar-"]:hover')
		let fah = container.querySelector('[class^="link-"] > [class^="layout-"] > [class^="avatar-"]:hover')
		let fadmh = container.querySelector('[class^="listItemContents-"] > [class^="userInfo-"] > [class*="avatar-"]:hover')
		let pah = container.querySelector('[class^="clickable-"] > [class^="avatarHoverTarget-"] > [class^="wrapper-"]:hover')
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
	};
};
