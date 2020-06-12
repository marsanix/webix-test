import { JetView } from "webix-jet";

export default class UserMenuPopup extends JetView {
	config() {
		return {
			view: "popup",
			width: 200,
			body: {
				view: "list",
				scroll: false,
				yCount: 2,
				select: true,
				borderless: true,
				navigation: true,
				template: "<span class='#icon#'></span> #label# ",
				data: [
					{ id: "profile", label: "Logged by Nama User", icon: "mdi mdi-account-circle" },
					{ id: "logout", label: "Logout", icon: "mdi mdi-logout" },
				],
				on: {
					onAfterSelect: id => {
						this.toggleMenu(id);
					},
					ready() {
						this.select();
					}
				},
			}
		};
	}
	init() {
	}
	showPopup(pos) {
		this.getRoot().show(pos);
	}
	toggleMenu(value) {
		console.log("value", value);
		this.show("/logout");
		// document.location.href = "#!/top/logout";
	}
}