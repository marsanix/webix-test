import * as Cookies from "js-cookie";
import { JetView } from "webix-jet";

export default class LoginView extends JetView {
	config() {

		let values = webix.copy({
			email: "marsanix@gmail.com",
			password: "password123456",
			rememberme: false
		}, Cookies.getJSON("Crm"));

		const login_form = {
			view: "form", localId: "login:form",
			width: 400, borderless: false, margin: 10,
			elementsConfig: {
				labelPosition: "top",
				validateEvent: "key"
			},
			rows: [
				{ gravity: 1, height: 120, template: '<div style="text-align: center;"><img src="data/images/webix.png" style="width: 20rem;" alt="" /></div>', css: "bg-clear" },
				{ type: "header", template: this.app.config.name },
				{
					view: "text",
					id: "email",
					name: "email",
					label: "Email",
					value: values.email,
					required: true,
				},
				{
					view: "text",
					id: "password",
					name: "password",
					label: "Password",
					value: values.password,
					required: true,
					type: "password"
				},
				{
					view: "checkbox",
					id: "remember",
					name: "rememberme",
					label: "Remember credentials?",
					labelPosition: "left",
					labelWidth: 200,
					checkValue: true,
					uncheckValue: false,
					value: values.rememberme
				},
				{
					view: "button",
					id: "login",
					name: "login",
					label: "Login",
					hotkey: "enter",
					click: () => this.do_login()
				}

				// { type: "header", template: this.app.config.name },
				// { view: "text", name: "email", label: "User Name", labelPosition: "top", value: "marsanix@gmail.com" },
				// { view: "text", type: "password", name: "password", label: "Password", labelPosition: "top", value: "password123456" },
				// { view: "button", value: "Login", click: () => this.do_login(), hotkey: "enter" }
			],
			rules: {
				email: webix.rules.isNotEmpty,
				password: webix.rules.isNotEmpty
			}
		};

		return {
			css: "login-background",
			cols: [
				{ gravity: 1, template: ""},
				{
					rows: [
						{ gravity: 1, template: ""},
						login_form,
						{ gravity: 1, template: ""}
					]
				},
				{ gravity: 1, template: ""}
			]
		};
	}

	init(view) {

		webix.extend(this.$$("login:form"), webix.ProgressBar);

		const token = Cookies.get("appToken");
		console.log('token', token);
		if (token) {
			this.show("/top/layanan");
		}

		view.$view.querySelector("input").focus();
	}

	do_login() {

		webix.extend(this.$$("login:form"), webix.ProgressBar);

		const user = this.app.getService("user");
		const form = this.$$("login:form");

		let values = form.getValues();
		if (true === values.rememberme) {
			Cookies.set("Crm", values);
		} else {
			// Clear cookie
			Cookies.remove("Crm");
		}

		if (form.validate()) {
			const data = form.getValues();
			user.login(data.email, data.password).catch(function () {
				webix.html.removeCss(form.$view, "invalid_login");
				form.elements.password.focus();
				webix.delay(function () {
					webix.html.addCss(form.$view, "invalid_login");
				});
			});
		}
	}
}