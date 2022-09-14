/**
 * @name Full Res Avatars
 * @author GentlePuppet
 * @authorId 199263542833053696
 * @version 2.2
 * @description Hover over avatars to see a bigger version.
 * @source https://github.com/GentlePuppet/FullResAvatar.plugin.js/blob/main/FullSizeAvatars.plugin.js
 * @updateUrl https://raw.githubusercontent.com/GentlePuppet/FullResAvatar.plugin.js/main/FullSizeAvatars.plugin.js
 */
 
 const config = {
	info: {
		name: "Full Res Avatars",
		id: "FullResAvatarHover",
		description: "Hover over avatars to see a bigger version.",
		version: "2.2",
		author: "GentlePuppet",
		updateUrl: "https://raw.githubusercontent.com/GentlePuppet/FullResAvatar.plugin.js/main/FullSizeAvatars.plugin.js"
	}
};
 
module.exports = class FullResAvatars {
	
	getName() { return config.info.name; }
	
	load() {
		try { global.ZeresPluginLibrary.PluginUpdater.checkForUpdate(config.info.name, config.info.version, config.info.updateUrl); }
		catch (err) { console.error(this.getName(), "Failed to reach the ZeresPluginLibrary for Plugin Updater.", err); }
	}

    start() {
		//----Create Image Panel
		if (document.getElementById("ImagePanelHover")) {
			document.getElementById("ImagePanelHover").remove();
		}
		const imagepanel = document.createElement("img");
		document.body.after(imagepanel);
		imagepanel.setAttribute("id", "ImagePanelHover");
		imagepanel.setAttribute("src", "null");
		imagepanel.setAttribute("style", "top: 50%;left:50%;height:205px;width:205px;padding:5px;display:none;z-index:999999;opacity:1;background:var(--background-secondary);border-size:5px;border-style:solid;position:absolute;");

		//---- Create Avatar Hover Events
		document.addEventListener("mouseover", hoverevent);
		function hoverevent() {
			document.querySelectorAll(".avatar-6qzftW, .avatar-1HDIsL, .avatar-2MSPKk").forEach(function(avatar) {
				avatar.onmouseover = ahoverover;
				avatar.onmouseout = ahoverout;
			})
		}
		
		//---- Track Mouse Position
		document.addEventListener("mousemove", funcmousemove) 
		function funcmousemove(e){
			if (document.querySelector(".avatar-6qzftW:hover")) {
				document.querySelector("#ImagePanelHover").style.top = e.pageY - 10 + 'px';
				document.querySelector("#ImagePanelHover").style.left = e.pageX - 220 + 'px';
			}
			else if (document.querySelector(".avatar-1HDIsL:hover") || document.querySelector(".avatar-2MSPKk:hover")) {
				document.querySelector("#ImagePanelHover").style.top = e.pageY - 10 + 'px';
				document.querySelector("#ImagePanelHover").style.left = e.pageX + 20 + 'px';
			}
		};
		
		//---- Start Hovering
		function ahoverover(jnode){
			var avatarsrc = document.querySelector("div:hover > div > svg > foreignObject > div > img").src.replace('?size=32', '?size=256');
			var status = document.querySelector("div:hover > div > svg > rect").getAttribute('fill');
			
			document.querySelector("#ImagePanelHover").style.display = "block";
			document.querySelector("#ImagePanelHover").src = avatarsrc;
			document.querySelector("#ImagePanelHover").style.background = status;
			//document.querySelector("#ImagePanelHover").style.top = CurrentMouseYPostion;
			//document.querySelector("#ImagePanelHover").style.left = CurrentMouseXPostion;
		};
		
		//---- Stop Hovering
		function ahoverout(){
			document.querySelector("#ImagePanelHover").style.display = "none";
			document.querySelector("#ImagePanelHover").src = "null";
		};
    };
	
    stop() {};
};
