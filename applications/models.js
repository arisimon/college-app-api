"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

//applications schema
const applicationSchema = mongoose.Schema({
    user: { type: String },
    name: { type: String },
    university_name: {
        type: String,
        required: true
    },
    app_due_date: { type: Date, required: true },
    admission_type: { type: String },
    hs_transcript_sent: { type: Boolean },
    mid_transcript_sent: { type: Boolean },
    SAT_sent: { type: Boolean },
    SAT_subject_sent: { type: Boolean },
    AP_sent: { type: Boolean },
    recommendation_requested: { type: Boolean },
    recommendation_sent: { type: Boolean },
    recommendation_thanks: { type: Boolean },
    essay_status: { type: String },
    interview_status_prepare: { type: Boolean },
    interview_status_complete: { type: Boolean },
    interview_status_thanks_sent: { type: Boolean },
    financial_aid_date: { type: Date },
    FAFSA_complete: { type: Boolean },
    application_fees_paid: { type: Boolean }
});

applicationSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        university_name: this.university_name,
        app_due_date: this.app_due_date,
        admission_type: this.admission_type,
        hs_transcript_sent: this.hs_transcript_sent,
        mid_transcript_sent: this.mid_transcript_sent,
        SAT_sent: this.SAT_sent,
        SAT_subject_sent: this.SAT_subject_sent,
        AP_sent: this.AP_sent,
        recommendation_requested: this.recommendation_requested,
        recommendation_sent: this.recommendation_sent,
        recommendation_thanks: this.recommendation_thanks,
        essay_status: this.essay_status,
        interview_status_prepare: this.interview_status_prepare,
        interview_status_complete: this.interview_status_complete,
        interview_status_thanks_sent: this.interview_status_thanks_sent,
        financial_aid_date: this.financial_aid_date,
        FAFSA_complete: this.FAFSA_complete,
        application_fees_paid: this.application_fees_paid
    };
};

const Applications = mongoose.model(
    "Applications",
    applicationSchema,
    "applications"
);

module.exports = { Applications };
