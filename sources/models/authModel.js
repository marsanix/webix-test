import * as Cookies from "js-cookie";
import * as AppConfig from "../app.config";

export class authModel {

	status() {
		return new Promise(function (resolve, reject) {
			console.log('this.credentials', this.credentials);
			resolve(this.credentials);
		});
	}

	getCurrentUser() {
		return this.getAccessToken();
	}

	getAccessToken() {
		if (this.credentials.access_token === undefined) {
			return null;
		}

		if ((this.credentials.expires_in + this.credentials.timestamp) < (Date.now() / 1000)) {
			return null;
		}

		return this.credentials.access_token;
	}

	setCurrentUser(userId) {
		this.user = userId;
	}

	login(email, password) {

		// return webix.ajax().post(AppConfig.API_URL + "auth", {
		// 	email, password
		// }).then(a => {
		// 	a.json();

		// 	const jsonData = a.json().data;
		// 	this.credentials = {
		// 		"access_token": jsonData.token,
		// 		"expires_in": jsonData.expired_at,
		// 		"refresh_expired_in": jsonData.refresh_expired_at,
		// 		"token_type": "Bearer",
		// 	};
		// 	this.credentials.timestamp = Date.now() / 1000 | 0;

		// 	Cookies.set("appToken", this.credentials.access_token);
		// 	Cookies.set("appCookie", this.credentials);

		// 	return new Promise((resolve, reject) => {
		// 		resolve(this.credentials);
		// 	});

		// });


		return webix.ajax().headers({
			"Content-Type": "application/json",
		}).post(AppConfig.API_URL + "auth", JSON.stringify({
			"email": email,
			"password": password
		}), function (text, data) {

			const jsonData = data.json().data;
			this.credentials = {
				"access_token": jsonData.token,
				"expires_in": jsonData.expired_at,
				"refresh_expired_in": jsonData.refresh_expired_at,
				"token_type": "Bearer",
			};
			this.credentials.timestamp = Date.now() / 1000 | 0;

			Cookies.set("appToken", this.credentials.access_token);
			Cookies.set("appCookie", this.credentials);

			return new Promise((resolve, reject) => {
				resolve(this.credentials);
			});

		}).then(null, function () {

			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(null);
				}, 2000);
			});

		});

	}

	logout() {
		this.credentials = {};
		Cookies.remove("appCookie");
	}

	refresh() {
		// Use the refresh-token to get a new bearer-token

	}

}