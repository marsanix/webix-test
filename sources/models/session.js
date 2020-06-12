import * as Cookies from "js-cookie";
import * as AppConfig from "../app.config";

function status() {
	return new Promise(function (resolve, reject) {
		const token = Cookies.get("appToken");
		if (token) {
			return resolve(true);
		}
		return reject(false);
	});

	// return webix.ajax().post("server/login.php?status")
	//     .then(a => a.json());
}

function login(user, pass) {
	return webix.ajax().post(AppConfig.API_URL + "auth", {
		email: user, password: pass
	}).then(a => a.json()).then((a) => {

		this.credentials = {
			"access_token": a.data.token,
			"expires_in": a.data.expired_at,
			"refresh_expired_in": a.data.refresh_expired_at,
			"token_type": "Bearer",
		};
		this.credentials.timestamp = Date.now() / 1000 | 0;

		Cookies.set("appToken", this.credentials.access_token);
		Cookies.set("appCookie", this.credentials);

		return new Promise(function (resolve, reject) {
			return resolve(a);
		});

	});
}

function logout() {
	return new Promise(function (resolve, reject) {
		Cookies.remove("appToken");
		return resolve(null);
	});
	// return webix.ajax().post("server/login.php?logout")
	//     .then(a => a.json());
}

export default {
	status, login, logout
}