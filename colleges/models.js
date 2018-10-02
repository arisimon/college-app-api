"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

//colleges schema
const collegeSchema = mongoose.Schema({
	web_pages: { type: String },
	name: { type: String },
	alpha_two_code: { type: String },
	state_province: { type: String },
	country: { type: String }
});

collegeSchema.methods.serialize = function() {
	return {
		id: this._id,
		name: this.name,
		alpha_two_code: this.alpha_two_code,
		state_province: this.state_province,
		country: this.country
	};
};

collegeSchema.index({ name: 1 });
const Colleges = mongoose.model("Colleges", collegeSchema, "colleges");

module.exports = { Colleges };
