import "./styles/app.css";
import { JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";
import session from "models/session";
// import { authModel } from "models/authModel";
// import { auth } from "plugins/auth";

export default class MyApp extends JetApp {
	constructor(config) {

		let cookies = true;

		const size = () => {
			const screen = document.body.offsetWidth;
			return screen > 1210 ? "wide" : (screen > 1060 ? "mid" : "small");
		};

		const defaults = {
			id: APPNAME,
			version: VERSION,
			router: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug: !PRODUCTION,
			start: "/login",
			size: size(),
		};

		super({ ...defaults, ...config });

		let localeConfig = {
			webix: {
				en: "en-US",
			}
		};
		if (cookies)
			localeConfig.storage = webix.storage.local;

		this.use(plugins.Locale, localeConfig);

		webix.event(window, "resize", () => {
			const newSize = size();
			if (newSize != this.config.size) {
				this.config.size = newSize;
				this.refresh();
			}
		});
	}
}

if (!BUILD_AS_MODULE) {
	webix.ready(() => {
		var app = new MyApp();
		app.render();

		// app.use(auth, { model: new authModel() });

		app.use(plugins.User, {
			model: session,
			ping: 15000,
			afterLogin: "top/layanan",
		});

		app.attachEvent("app:error:resolve", function (name, error) {
			window.console.error(error);
		});

	});
}