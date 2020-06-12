// views/myview.js
import { JetView } from "webix-jet";
import * as Cookies from "js-cookie";
import * as AppConfig from "../app.config";

export default class Layanan extends JetView {
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
										$$("grid").filterByAll();
									}
								}
							},
							{
								view: "toolbar",
								elements: [
									{ view: "button", value: "Add New", icon: "mdi mdi-folder-plus", click: add }
								],
								width: 120,
								css: "bg-clear",
							}
						]
					},
					{
						cols: [
							{
								id: "grid",
								view: "datatable",
								autoConfig: true,
								css: "webix_shadow_medium",
								columns: [
									{ id: "id", header: "ID", width: 50, hide: true },
									{ id: "nama", header: "Nama", fillspace: 4, sort: "string" },
									{ id: "waktu_pelayanan", header: "Waktu Pelayanan", fillspace: 4, sort: "string" },
									{ id: "biaya", header: "Biaya", fillspace: 2 },
									// { id: "edit", header: "", width: 80, template: "<button class=\"btnEdit\"><i class=\"mdi mdi-pencil\"></i> Edit</button>" },
									{ id: "delete", header: "", width: 100, template: "<button class=\"btnDelete\"><i class=\"mdi mdi-delete\"></i> Delete</button>" },
								],
								pager: "pager",
								select: "row",
								on: {
									onItemClick: function (id, e, trg) {
										detail(id.row);
									},
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
										return webix.ajax().get(AppConfig.API_URL + "layanan", params);
									}
								}
							},
							{
								view: "form",
								id: "form1",
								scroll: false,
								gravity: 0.7,
								elements: [
									{ view: "text", name: "id", label: "ID", labelWidth: 120, readonly: true },
									{ view: "text", name: "nama", label: "Nama", labelWidth: 120 },
									{ view: "text", name: "nama_singkat", label: "Nama Singkat", labelWidth: 120 },
									{ view: "textarea", name: "dasar_hukum", label: "Dasar Hukum", labelWidth: 120 },
									{ view: "text", name: "waktu_pelayanan", label: "Waktu Pelayanan", labelWidth: 120 },
									{ view: "text", name: "biaya", label: "Biaya", labelWidth: 120 },
									{ view: "textarea", name: "pengelola", label: "Pengelola", labelWidth: 120, height: 70 },

									{ view: "button", value: "Save", click: saveNew }
								],
								rows: [
									{
										template: "<h1>Testing</h1>"
									}
								]

							}
						]
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

		function add() {
			const grid = $$("grid");
			grid.add({
				id: "",
				nama: "",
				nama_singkat: "",
				dasar_hukum: "",
				waktu_pelayanan: "",
				biaya: "",
				pengelola: "",
			});
			const lastId = grid.getLastId();
			grid.select(lastId);
		}

		function saveNew() {
			const form = $$("form1");
			const data = {
				id: form.elements.id.data.value,
				nama: form.elements.nama.data.value,
				nama_singkat: form.elements.nama_singkat.data.value,
				dasar_hukum: form.elements.dasar_hukum.data.value,
				waktu_pelayanan: form.elements.waktu_pelayanan.data.value,
				biaya: form.elements.biaya.data.value,
				pengelola: form.elements.pengelola.data.value,
			};

			const layanan = webix.ajax().headers({
				// "Content-Type": "application/json",
				"Authorization": "Bearer " + getToken(),
				"Accept": "application/json, text/plain, */*",
				// "sec-fetch-mode" : "cors",
				// "sec-fetch-site": "cross-site",
			}).post(AppConfig.API_URL + "layanan/" + data.id, data).then(a => a.json());
			if (layanan) {
				$$("form1").save();
			}
		}

		function detail(id) {
			return id;
			// webix.message("detail: " + id);
		}

		function getToken() {
			return Cookies.get("appToken");
		}

	}

	init(view) {

		const token = Cookies.get("appToken");

		$$("form1").bind("grid");

		$$("grid").on_click.btnDelete = function (e, id, trg) {

			const deleted = webix.ajax().headers({
				"Content-Type": "application/json",
				"Authorization": "Bearer " + token,
				"Origin" : "https://sikancil.kekajian.com",
				"Accept": "application/json, text/plain, */*",
			}).del(AppConfig.API_URL + "layanan/" + id).then(a => a.json());
			if (deleted) {
				webix.message("The selected data has been deleted.");
				$$("grid").remove(id);
			}

			//block default onclick event
			return false;
		};

		// $$("grid").on_click.btnEdit = function (e, id, trg) {
		// 	//id.column - column id
		// 	//id.row - row id
		// 	webix.message("Add row: " + id);
		// 	//block default onclick event
		// 	return false;
		// };

		$$("grid").registerFilter(
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