/**
 * @name FullResAvatars
 * @author GentlePuppet
 * @authorId 199263542833053696
 * @version 3.0
 * @description Hover over avatars to see a bigger version.
 * @source https://github.com/GentlePuppet/FullResAvatar.plugin.js/blob/main/FullSizeAvatars.plugin.js
 * @updateUrl https://raw.githubusercontent.com/GentlePuppet/FullResAvatar.plugin.js/main/FullSizeAvatars.plugin.js
 */
 
 const config = {
	info: {
		version: "3.0",
		updateUrl: "https://raw.githubusercontent.com/GentlePuppet/FullResAvatar.plugin.js/main/FullSizeAvatars.plugin.js",
	}
};
 
module.exports = class {
	//---- Try to load ZeresPluginLibrary to enable auto-updates
	load() {
		try { global.ZeresPluginLibrary.PluginUpdater.checkForUpdate(config.info.name, config.info.version, config.info.updateUrl); }
		catch (err) { console.error(this.getName(), "Failed load the ZeresPluginLibrary for automatic updates.", err); }
	}
	
	//---- Start Plugin
    start() {
		//---- Create Image Panel
		if (document.getElementById("ImagePanelHover")) {
			document.getElementById("ImagePanelHover").remove();
		}
		const imagepanel = document.createElement("img");
		document.body.after(imagepanel);
		imagepanel.setAttribute("id", "ImagePanelHover");
		imagepanel.setAttribute("src", "null");
		imagepanel.setAttribute("style", "top: 50%;left:50%;height:261px;width:261px;padding:5px;display:none;z-index:999999;opacity:1;background:var(--background-secondary);border-size:5px;border-style:solid;position:absolute;");

		//---- Create Track Mouse Event
		document.addEventListener("mousemove", this.mmhfunc) 
    };
		
	//---- Track Mouse Event Handler
	mmhfunc = (e) => this.funcmousemove(e);
	
    stop() {
		document.removeEventListener('mousemove', this.mmhfunc);
		document.getElementById("ImagePanelHover").remove();
	};
	
	//---- Track Mouse Event and Check If Hovering Over Avatars
	funcmousemove(e){
		let mah = document.querySelector(".avatar-6qzftW:hover")
		let fah = document.querySelector(".avatar-1HDIsL:hover")
		let fadmh = document.querySelector(".avatar-2MSPKk:hover")
		let ipm = document.querySelector("#ImagePanelHover")
		
		if (mah == null || fah == null || fadmh == null ) {
			ipm.style.display = "none";
			ipm.src = "null";
		}
		if (mah) {
			var ais = document.querySelector("div:hover > div > svg > foreignObject > div > img").src.replace('?size=32', '?size=256');
			var status = document.querySelector("div:hover > div > svg > rect").getAttribute('fill');
			ipm.src = ais;
			ipm.style.display = "block";
			ipm.style.top = e.pageY - 10 + 'px';
			ipm.style.left = e.pageX - 286 + 'px';
			if (status == "transparent") {
				var statusfix = document.querySelector("div:hover > div > svg > svg > rect").getAttribute('fill');
				ipm.style.background = statusfix;
			} else {
				var status = document.querySelector("div:hover > div > svg > rect").getAttribute('fill');
				ipm.style.background = status;
			}
		}
		else if (fah || fadmh) {
			var ais = document.querySelector("div:hover > div > svg > foreignObject > div > img").src.replace('?size=32', '?size=256');
			var status = document.querySelector("div:hover > div > svg > rect").getAttribute('fill');
			ipm.src = ais;
			ipm.style.display = "block";
			ipm.style.top = e.pageY - 10 + 'px';
			ipm.style.left = e.pageX + 20 + 'px';
			if (status == "transparent") {
				var statusfix = document.querySelector("div:hover > div > svg > svg > rect").getAttribute('fill');
				ipm.style.background = statusfix;
			} else {
				var status = document.querySelector("div:hover > div > svg > rect").getAttribute('fill');
				ipm.style.background = status;
			}
		}
	};
};
