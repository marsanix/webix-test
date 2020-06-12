import { JetView } from "webix-jet";
import NotificationView from "views/notifications";
import UserMenuPopup from "views/user-menu";

export default class ToolView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const theme = this.app.config.theme;

		return {
			view: "toolbar", css: theme,
			height: 56,
			elements: [
				{
					paddingY: 7,
					rows: [
						{
							view: "icon", icon: "mdi mdi-menu",
							click: () => this.app.callEvent("menu:toggle"),
							tooltip: _("Click to collapse / expand the sidebar")
						}
					]
				},
				{ css: "logo" },
				{},
				{
					paddingY: 7,
					rows: [
						{
							margin: 8,
							cols: [
								{
									view: "icon", icon: "mdi mdi-bell",
									localId: "bell", badge: 3,
									tooltip: _("Open latest notifications"),
									click: function () {
										this.$scope.notifications.showPopup(this.$view);
									}
								}
							]
						}
					]
				},
				{
					template: `<image class="mainphoto" src="data/photos/abdul.jpg" webix_tooltip="${_("Change your personal settings")}">`,
					width: 60, localId: "avatar",
					borderless: true,
					batch: "default",
					onClick: {
						"mainphoto": function () {
							this.$scope.userMenuPopup.showPopup(this.$view);
							// return false;
						}
					}
				},
				{ width: 4 }
			]
		};
	}
	init() {
		this.notifications = this.ui(NotificationView);
		this.userMenuPopup = this.ui(UserMenuPopup);

		this.on(this.app, "read:notifications", () => {
			this.$$("bell").config.badge = 0;
			this.$$("bell").refresh();

			setTimeout(() => {
				if (this.app) {
					this.$$("bell").config.badge += 1;
					this.$$("bell").refresh();
					this.app.callEvent("new:notification");
				}
			}, 10000);
		});
	}
}