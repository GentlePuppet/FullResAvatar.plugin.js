/**
 * @name FullResAvatars
 * @author GentlePuppet
 * @authorId 199263542833053696
 * @version 3.8
 * @description Hover over avatars to see a bigger version. Click edit and change the numbers with the ← to customize the size of both the image and the panel containing the image.
 * @website https://github.com/GentlePuppet/FullResAvatar.plugin.js/
 * @source https://raw.githubusercontent.com/GentlePuppet/FullResAvatar.plugin.js/main/FullSizeAvatars.plugin.js
 * @updateUrl https://raw.githubusercontent.com/GentlePuppet/FullResAvatar.plugin.js/main/FullSizeAvatars.plugin.js
 */
const config = {
	imagesize: 512, /* ← Image Resolution ← */
	panelsize: 256, /* ← Popout Panel Size ← */
	info: {
		name: "Full Res Avatars On Hover",
		id: "FullSizeAvatars",
		version: "3.8",
		updateUrl: "https://raw.githubusercontent.com/GentlePuppet/FullResAvatar.plugin.js/main/FullSizeAvatars.plugin.js",
	}
};
module.exports = class {	
	getName() { return config.info.name; }
	//---- Try to load ZeresPluginLibrary to enable auto-updates
	load() {
		try { global.ZeresPluginLibrary.PluginUpdater.checkForUpdate(config.info.name, config.info.version, config.info.updateUrl); }
		catch (err) { console.error(this.getName(), "Failed load the ZeresPluginLibrary for automatic updates.", err); }
	}
	//---- Start Plugin
    start() {
		var pansize = (config.panelsize);
		var pansize = Number(pansize) + 5;
		
		//---- Create Image Panel
		if (document.getElementById("IPH")) {document.getElementById("IPH").remove();}
		const ip = document.createElement("img");
		document.body.after(ip);
		ip.setAttribute("id", "IPH");
		ip.setAttribute("style", "height:" + pansize + "px;width:" + pansize + "px;padding:5px;display:none;z-index:999999;position:absolute;");

		//---- Create Track Mouse Event
		document.addEventListener("mousemove", this.mmhfunc) 
    };
		
	//---- Track Mouse Event Handler
	mmhfunc = (e) => this.fmm(e);
	
    stop() {
		document.removeEventListener('mousemove', this.mmhfunc);
		document.getElementById("IPH").remove();
	};
	
	//---- Track Mouse Event and Check If Hovering Over Avatars
	fmm(e){
		let container = document.querySelector("#app-mount")
		let mah = container.querySelector(".avatar-6qzftW:hover")
		let fah = container.querySelector(".avatar-1HDIsL:hover")
		let fadmh = container.querySelector(".avatar-2MSPKk:hover")
		let ipm = document.querySelector("#IPH")
		let dih = (e.pageY / (container.offsetHeight) * 100);
		let diw = (e.pageX / (container.offsetWidth) * 100);
		
		if (!mah && !fah && !fadmh && !cmcah) {
			ipm.style.display = "none";
		} else {
			var ais = container.querySelector("div:hover > div > svg > foreignObject > div > img").src.replace('?size=32', '?size=' + config.imagesize);
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
