import { JetView, plugins } from "webix-jet";

export default class MenuView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const theme = this.app.config.theme;
		const screen = this.app.config.size;

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

		return {
			view: "sidebar",
			css: "webix_dark " + theme,
			width: 200,
			collapsed: (screen !== "wide"),
			tooltip: (obj) => {
				return this.getRoot().config.collapsed ? obj.value : "";
			},
			// template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{ id: "layanan", value: _("Layanan"), icon: "mdi mdi-book" },
				{ id: "pengajuan", value: _("Pengajuan"), icon: "mdi mdi-file-document" },
				{ id: "start", value: _("Start"), icon: "mdi mdi-account-box" },
				{ id: "data", value: _("Data"), icon: "mdi mdi-chart-areaspline" },
				// { id: "widgets", value: _("Widgets"), icon: "mdi mdi-widgets" },
				// { id: "demos", value: _("Demos"), icon: "mdi mdi-monitor-dashboard" },
				// { id: "prices", value: _("Prices"), icon: "mdi mdi-currency-usd" },
				// { id: "tutorials", value: _("Tutorials"), icon: "mdi mdi-school" }
			]
		};
	}
	init(sidebar) {
		this.use(plugins.Menu, {
			id: sidebar,
			// urls: {
			// 	"customers": "customers?user=1/information"
			// }
		});
		this.on(this.app, "menu:toggle", () => sidebar.toggle());
		sidebar.getPopup().attachEvent("onBeforeShow", () => false);
	}
	urlChange(ui, url) {
		if (url.length > 1) {
			if (!ui.find(opts => url[1].page === opts.id).length)
				ui.unselect();
		}
	}
}