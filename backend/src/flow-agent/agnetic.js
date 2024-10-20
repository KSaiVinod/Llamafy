const Bedrock = require("./bedrock");
const forms = require("../controller/form");
const Tunehq = require("./tunehq");
const wf = require("./workflow.json");
const {
    radioButtonsGroupSchema,
    checkboxGroupSchema,
    textInputSchema,
} = require("../controller/form");
const redis = require("../helpers/redis_handler");
// const console = require("../helpers/console_helper")("Agentic");

class ProcessWorkflow {
    constructor() {
        this.data = {};
        this.payload = {};
        this.actions = ["bedrock", "forms", "tunehq", "validation", "ajv"];
        this.components = [
            "TextHeading",
            "TextSubheading",
            "TextCaption",
            "TextBody",
            "RichText",
            "TextInput",
            "CheckboxGroup",
            "RadioButtonsGroup",
            "Footer",
            "Dropdown",
            "DatePicker",
        ];
        this.routinginstance = false;
    }

    /* 
    Start process for given  workflow */
    async process_workflow(wf, id, rtrace = true, debug = false) {
        try {
            console.info("Starting Logs");
            this.data = wf;
            this.unique_key = `Llamafy-${id}`;
            this.output = "NO_OUTPUT_FOUND";
            this.trace = [];
            this.debug = debug;
            this.rtrace = rtrace;
            var startid = wf.workflow.start;
            const components_extracted = await this.source(wf.workflow.source);
            this.node_id = startid;
            this.ip = {};
            this.ip.final_flow_json = [];
            for (const i in components_extracted) {
                this.ip.component = JSON.stringify(components_extracted[i]);
                await this.process_node(wf.workflow[startid]);
                if (this.ip.flow_json) {
                    try {
                        console.log("***************");
                        console.log("FLOW JSON found");
                        console.log(JSON.parse(this.ip.flow_json.trim()));
                        console.log("***************");
                        await redis.set(this.unique_key, "COMPLETED");

                        this.ip.final_flow_json.push(
                            JSON.parse(this.ip.flow_json.trim())
                        );
                    } catch (e) {
                        ("something went wrong with parsing");
                    }
                }
            }

            console.log(this.ip.final_flow_json);
            await redis.set(
                `${this.unique_key}-COMPLETED`,
                JSON.stringify(this.ip.flow_json)
            );

            /*
            checkck if the Workflow output is Routing then get the details
            get the routing provider info from this place
            Earlier it was inside routing/workflow process. due to recursive async call it was breaking
        */

            if (this.output == "NO_OUTPUT_FOUND") {
                throw new Error("ROUTING_CONFIG_ERROR");
            }

            if (this.output == "NO_WF_OUTPUT_FOUND") {
                throw new Error("AUTOMATION_PROCESS_FAILED");
            }

            let data = {
                output: this.output,
            };

            // if trace is requested
            if (rtrace) {
                data.trace = this.trace;
            }

            this.reset_vars();
            return data;
        } catch (e) {
            this.output = { status: "err", data: e.message };
            console.error(e.message);

            let data = {
                output: this.output,
            };

            // if trace is requested
            if (rtrace) {
                data.trace = this.trace;
            }
            return data;
        }
    }

    /* 
    Reset the variables after processing done*/

    reset_vars() {
        this.data = "";
        this.payload = "";
        this.output = "";
        this.trace = "";
    }

    async source(source) {
        if (source.form) {
            const scraped = await forms.getGoogleFormJson(source.form);
            this.addtrace("Source", scraped, source);
            if (scraped.components) return scraped.components;
        }
        return false;
    }

    /* 
    Process the node
    and find and execute action with given node*/

    async process_node(node, workflow = {}) {
        try {
            if (node == null || node == undefined) {
                return false;
            }

            var action = this.getaction(node);

            if (this.actions.includes(action)) {
                this.addtrace("data", node);
                //node = this[action].call(this, node);
                switch (action) {
                    case "bedrock":
                        node = await this.bedrock(node);
                        break;
                    case "tunehq":
                        node = await this.tunehq(node);
                        break;
                    case "forms":
                        node = await this.forms(node);
                        break;
                    case "validation":
                        node = await this.validator(node);
                        break;
                    case "ajv":
                        node = await this.ajv(node);
                }

                await this.process_node(node);
            }
        } catch (e) {
            this.addtrace("error-process-node", e.message);
            this.log(e);
            this.log(workflow);
            this.output = { status: "err", data: "" };
            return false;
        }
    }

    async update_progress(node, success = false) {
        try {
            if (node.state) {
                if (success) {
                    await redis.set(this.unique_key, node.state?.post);
                    console.log(
                        `Step Number : ${node.state?.post} | ${JSON.stringify(
                            this.ip
                        )}`
                    );
                } else {
                    await redis.set(this.unique_key, node.state?.pre);
                    console.log(
                        `Step Number : ${node.state?.pre} | ${JSON.stringify(
                            this.ip
                        )}`
                    );
                }
            }
        } catch (e) {
            console.error("Error in Updating Progress", e);
        }
    }

    async bedrock(node) {
        try {
            if (node.bedrock) {
                await this.update_progress(node.bedrock);
                const data = await Bedrock.callLlama3API(
                    node.bedrock.user_message,
                    this.ip
                );
                this.addtrace("bedrock", data);
                this.ip[node.bedrock.save_to] = data;
                this.set_ok_output("bedrock");
                await this.update_progress(node.bedrock, true);

                if (node.next) {
                    this.node_id = node.next.id;
                    return this.data.workflow[node.next.id];
                }
            }
            return false;
        } catch (e) {
            this.log(e);
            this.log(e.message);
            this.addtrace("error-in-bedrock-message", e.message);
        }
    }

    async tunehq(node) {
        try {
            if (node.tunehq) {
                await this.update_progress(node.tunehq);

                const data = await Tunehq.callTuneStudioAPI(
                    node.tunehq.messages,
                    node.tunehq.model,
                    this.ip
                );
                this.addtrace("tunehq", data);
                this.set_ok_output("bedrock");
                await this.update_progress(node.tunehq, true);

                if (node.next) {
                    this.node_id = node.next.id;
                    return this.data.workflow[node.next.id];
                }
            }
            return false;
        } catch (e) {
            this.log(e);
            this.log(e.message);
            this.addtrace("error-in-tunehq-message", e.message);
        }
    }

    async ajv(node) {
        try {
            if (node.ajv) {
                await this.update_progress(node.ajv);

                const data = await forms.validateComponent(
                    this.ip.ai_component,
                    this.ip.flow_json
                );
                if (!data.isValid) {
                    this.ip[node.ajv.failure.save_to] = JSON.stringify(
                        data.errors
                    );
                    return this.data.workflow[node.ajv.failure.next];
                }
                await this.update_progress(node.ajv, post);

                if (node.next) {
                    this.node_id = node.next.id;
                    return this.data.workflow[node.next.id];
                }
            }
            return false;
        } catch (e) {
            this.log(e);
            this.log(e.message);
            this.addtrace("error-in-send-message", e.message);
        }
    }

    async validator(node) {
        await this.update_progress(node.validation);

        switch (this.ip[node.validation.variable]) {
            case "RadioButtonsGroup":
                this.ip[node.validation.save_to] = JSON.stringify(
                    radioButtonsGroupSchema
                );
                if (node.next) {
                    this.node_id = node.next.id;
                    return this.data.workflow[node.next.id];
                }
            case "CheckboxGroup":
                this.ip[node.validation.save_to] =
                    JSON.stringify(checkboxGroupSchema);
                if (node.next) {
                    this.node_id = node.next.id;
                    return this.data.workflow[node.next.id];
                }

            case "TextInput":
                this.ip[node.validation.save_to] =
                    JSON.stringify(textInputSchema);
                if (node.next) {
                    this.node_id = node.next.id;
                    return this.data.workflow[node.next.id];
                }
            default:
                console.log("*************** ERROR");
                break;
        }
        await this.update_progress(node.validation, true);
        console.log("OOPS ***************");
    }

    modify_metadata(data, source) {
        if (source == "journey") {
            return {
                journey: {
                    id: this.journey.journey_uid,
                    status: data,
                },
            };
        }
    }
    /* 
    Add Trace for each action  */
    addtrace(key, value, params = null) {
        try {
            if (this.debug == false && key == "data") {
                return;
            }

            // Fields for searching tracelogs
            let metadata = {};
            if (params) {
                metadata =
                    typeof params == "object" ? { ...params } : { params };
            }

            if (this.rtrace) {
                this.trace.push({
                    time: new Date(),
                    node_id: this.node_id || "",
                    action: key,
                    data: value,
                    metadata,
                });
            }
        } catch (e) {
            console.warn(e.message);
        }
    }

    /* 
    return the action from given node */
    getaction(node) {
        return (this.action = Object.keys(node)[0]);
    }

    /* 
    Logging for trouble shooting in dev env */
    log(title = "", data = {}) {
        console.debug(title, JSON.stringify(data));
    }

    set_ok_output(action) {
        this.output = {
            status: "ok",
            node_id: this.node_id,
            action,
            data: "WF_ACTION_" + action.toUpperCase() + "_COMPLETED",
        };
    }
}

(async () => {
    try {
        pf = new ProcessWorkflow();
        const a = await pf.process_workflow(wf, 1);
    } catch (error) {
        console.error("Error:", error.message);
    }
})();

module.exports = ProcessWorkflow;
