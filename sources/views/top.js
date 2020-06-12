import { JetView } from "webix-jet";

import ToolView from "views/toolbar";
import MenuView from "views/menu";

export default class TopView extends JetView {
	config() {

		// var menu = {
		// 	view: "menu", id: "top:menu",
		// 	css: "app_menu",
		// 	width: 180, layout: "y", select: true,
		// 	template: "<span class='webix_icon #icon#'></span> #value# ",
		// 	data: [
		// 		{ value: "Dashboard", id: "start", icon: "wxi-columns" },
		// 		{ value: "Data", id: "data", icon: "wxi-pencil" },
		// 		{ value: "Layanan", id: "layanan", icon: "wxi-columns" },
		// 	]
		// };

		var ui = {
			rows: [

				ToolView,
				{
					cols: [
						MenuView,
						{
							type: "space",
							cols: [
								{ $subview: true }
							]
						}
					]
				}


				// {
				// 	cols: [
				// 		{
				// 			type: "clean", paddingX: 5, css: "app_layout", cols: [
				// 				{ paddingX: 5, paddingY: 10, rows: [{ css: "webix_shadow_medium", rows: [header, menu] }] },
				// 				{
				// 					type: "wide", paddingY: 10, paddingX: 5, rows: [
				// 						{ $subview: true }
				// 					]
				// 				}
				// 			]
				// 		}
				// 	]
				// }
			],

		};

		return ui;
	}
	init() {
		// this.use(plugins.Menu, "top:menu");
	}
}