// views/myview.js
import { JetView } from "webix-jet";
import * as Cookies from "js-cookie";
import * as AppConfig from "../app.config";

export default class Pengajuan extends JetView {
	config() {
		return {
			rows:
				[
					{
						cols: [
							{
								view: "text",
								id: "textField",
								placeholder: "Filter by nama...",
								on: {
									onTimedKeyPress: function () {
										$$("grid1").filterByAll();
									}
								}
							},
							{
								template: "<button>Add New</button>",
								width: 100,
								css: "bg-clear",
							}
						]
					},
					{
						id: "grid1",
						view: "datatable",
						autoConfig: true,
						css: "webix_shadow_medium",
						columns: [
							{ id: "id", header: "ID", width: 50 },
							{ id: "nama", header: "Nama", fillspace: 4, sort: "string" },
							{ id: "waktu_pelayanan", header: "Waktu Pelayanan", fillspace: 4, sort: "string" },
							{ id: "biaya", header: "Biaya", fillspace: 2 },
							{ id: "id", header: "#", fillspace: 1, template: "<button>Edit</button>", click: viewEdit },
						],
						pager: "pager",
						select: "row",
						on: {
							onBeforeLoad: function () {
								this.showOverlay("Loading...");
							},
							onAfterLoad: function () {
								if (!this.count())
									this.showOverlay("Sorry, there is no data");
								else
									this.hideOverlay();
							}
						},
						url: {
							$proxy: true,
							load: function (view, params) {
								return webix.ajax().headers({
									"Content-Type": "application/json; charset=utf-8",
									"Authorization": "Bearer " + getToken(),
								}).get(AppConfig.API_URL + "pengajuan", params);
							}
						}
					},
					{
						height: 10,
					},
					{
						view: "pager",
						id: "pager",
						size: 3,
						group: 3,
						template: "{common.first()}{common.prev()}{common.pages()}{common.next()}{common.last()}",
					},
				]
		};

		function getToken() {
			return Cookies.get("appToken");
		}

		function viewEdit(obj, common, value) {
			console.log("obj", obj);
			console.log("common", common);
			console.log("val", value);
		}

	}

	init(view) {

		view.attachEvent("onAfterSelect", function (selection, preserve) {
			//... some code here ...
			console.log('selection', selection);
		});

		$$("grid1").registerFilter(
			$$("textField"),
			{ columnId: "nama" },
			{
				getValue: function (view) {
					return view.getValue();
				},
				setValue: function (view, value) {
					view.setValue(value);
				}
			}
		);

		// const layanan = webix.ajax(AppConfig.API_URL + "layanan").then(a => a.json());
		// const data = new webix.DataCollection({
		// 	data: layanan
		// });
		// view.parse(data);
	}

}