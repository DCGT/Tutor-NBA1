YUI.add("ucs-alert-tracker",function(b){var a=["t1","t2","t3","t4","sec","slk","ct","elm","elmt","dcl","_p","mpos","cpos","bpos","g","cat","pkgt","itc","tar","outcome"];b.namespace("ucs");b.ucs.AlertTracker={init:function(c){this.alertNode=c;this.addModule();this.addListeners();},addListeners:function(){b.publish("ucs-alert-tracker:synthetic-click",{broadcast:2});b.Global.on("ucs-alert-tracker:show-view",b.bind(this.handleShowView,this));b.Global.on("ucs-alert-tracker:close-overlay",b.bind(this.handleCloseOverlay,this));b.Global.on("ucs-alert:remind-me",b.bind(this.handleRemindMe,this));b.Global.on("ucs-alert:submit",b.bind(this.handleSubmit,this));},handleCloseOverlay:function(c){this.handleTrackingEvent({name:"click",t1:"a0",t2:"ucs-alert",t3:"ctrl",sec:"ucs-alert",slk:c.view+"-close",g:c.g,cat:c.cat,itc:"1"});},handleShowView:function(c){this.handleTrackingEvent({name:"event",t1:"a0",t2:"ucs-alert",t3:c.t3,sec:"ucs-alert",slk:c.view+"-pop",g:c.g,cat:c.cat});},handleSubmit:function(c){if(!c.result){return;}this.handleTrackingEvent({name:"click",outcome:c.outcome,t1:"a0",t2:"ucs-alert",t3:"sbmt",t4:c.result,sec:"ucs-alert",slk:c.slk,elm:"btn",g:c.g,cat:c.cat,itc:"1"});b.Global.fire("ucs-alert-tracker:synthetic-click",c);},handleRemindMe:function(c){if(!c.result){return;}this.handleTrackingEvent({name:"click",outcome:c.outcome,t1:"a0",t2:"ucs-alert",t3:"recs",t4:c.t4,sec:"ucs-alert",slk:"remind-me-"+c.result,elm:"btn",g:c.g,cat:c.cat,itc:"1"});b.Global.fire("ucs-alert-tracker:synthetic-click",c);},addModule:function(){this.alertNode.delegate("click",b.bind(this.handleClick,this),"button, a");},_fireRapidBeacon:function(d,c){var e;if(d==="click"){e={"sec":c.sec,"slk":c.slk,"_pValue":c._p,"keys":c,"outcome":c.outcome};}else{if(d==="event"){e={"eventName":"secvw","keys":c,"outcome":c.outcome};}}b.Global.fire("ucs-rapid:"+d,e);},handleClick:function(f){var d=f.currentTarget,c={};if(d.hasClass("rapidnofollow")){return;}b.Array.forEach(a,function(e){var g=d.getAttribute(e);if(g){c[e]=g;}});this._fireRapidBeacon("click",c);},handleTrackingEvent:function(d){var c={};if(!d.name){return;}b.Array.forEach(a,function(e){var f=d[e];if(f){c[e]=f;}});this._fireRapidBeacon(d.name,c);}};},"1.0",{requires:["node","event-custom"]});(function(){ucs.YObj.use("ucs-alert-tracker",function(b){var a=b.one("#yucs-alert");if(a){b.ucs.AlertTracker.init(a);}});}());(function(a){a.YUI.add("ucs-alert-template",function(d){var b={},c={};d.namespace("ucs");c.signup="<i>signup</i>";c.confirmation="<i>confirmation</i>";d.ucs.AlertTemplate=function(e){var f="",g={};d.Object.each(c,function(i,h){f="";if(d.Object.hasKey(e,h)){g=d.one(d.Object.getValue(e,h));if(!d.Lang.isNull(g)){f=d.Lang.trim(g.getHTML());}else{f=d.Lang.trim(i);}}else{f=d.Lang.trim(i);}b[h]=d.Template.Micro.compile(f);});};d.ucs.AlertTemplate.prototype={get:function(e){if(!d.Object.hasKey(b,e)){d.log("template not found. name="+e,"warn");return;}return d.Object.getValue(b,e);},getData:function(){return b;}};},"0.0.1",{requires:["template-micro"]});})(window);(function (global) {

    'use strict';

    global.YUI.add('ucs-alert-view-confirmation', function (Y) {

        Y.namespace('ucs');
        var conf = null,
            helpers = Y.ucs.AlertView.prototype;

        // The confirmation screen
        Y.ucs.AlertViewConfirmation = function (inputs) {

            var view = new Y.View({
                container: Y.Node.create(Y.Lang.sub('<div class="{id}">', {id: inputs.id})),
                events: {
                    '.tinypopup-closebutton': {
                        click: 'handleClose'
                    },
                    '#yucs-alert-info': {
                        mouseover: helpers.showLegal,
                        mouseout: helpers.hideLegal
                    }
                },
                template: inputs.template
            });

            view.name = 'confirmation';

            view.render = function () {
                var container = this.get('container'),
                    data = this.get('data'),
                    form2Template = this.template,
                    url = null,
                    html = null,
                    parent = Y.one('#yucs-alert-overlay');

                conf = window.ucs.Alert.config;

                view.trackingInfo = {
                    view: view.name,
                    cat: data.type,
                    t3: 'confirm',
                    g: data.id
                };


                html = form2Template(data);

                /* to prevent border flash, must immediately precede setHTML */
                parent.setStyle('borderWidth', '1px');

                container.setHTML(html);
                Y.one(conf.ids.overlay).append(container);

                if (data.type === 'live_nation') {
                    Y.ucs.AlertSocialSharing.init('.yucs-alert-share', view.trackingInfo);
                    Y.ucs.AlertRecommendations.init(data,'.yucs-alert-sugg');
                }


                Y.fire('ucs-alert-tracker:show-view', view.trackingInfo);

                return this;
            };

            view.handleClose = function () {
                Y.Global.fire('ucs-alert:hide-overlay', {data: 'action'});
            };

            return view;
        };

    }, '0.0.1', {
        requires: [
            'view',
            'ucs-alert-view',
        ]
    });

})(window);
(function (global) {

    'use strict';

    global.YUI.add('ucs-alert-view-signup', function (Y) {

        Y.namespace('ucs');

        var conf = null,
            helpers = Y.ucs.AlertView.prototype;

        Y.ucs.AlertViewSignup = function (inputs) {

            var view = new Y.View({
                container: Y.Node.create(Y.Lang.sub('<div class="{id}">', {id: inputs.id})),
                events: {
                    '.tinypopup-closebutton': {
                        click: 'handleClose'
                    },
                    '#yucs-alert-subscribe': {
                        click: 'handleSubmit'
                    },
                    '#yucs-alert-info': {
                        mouseover: helpers.showLegal,
                        mouseout: helpers.hideLegal
                    }
                },
                template: inputs.template
            });

            view.name = "signup";

            view.render = function () {
                var container = this.get('container'),
                    data = this.get('data'),
                    html = null,
                    emailNode = null,
                    phoneNode = null,
                    emailError = null,
                    phoneError = null,
                    popupShadow = Y.one('#tinypopup-shadow');

                conf = window.ucs.Alert.config;


                data.text = view.getViewText(data);

                view.trackingInfo = {
                    view: view.name,
                    cat: data.type,
                    t3: 'form',
                    g: data.id
                };


                html = this.template(data);

                container.setHTML(html);

                Y.fire('ucs-alert-tracker:show-view', view.trackingInfo);

                Y.one(conf.ids.overlay).append(container);

                phoneNode = Y.one(conf.ids.input_phone);
                emailNode = Y.one(conf.ids.input_email);
                emailError = Y.one(conf.ids.e_input_email);
                phoneError = Y.one(conf.ids.e_input_phone);


                if (window.ucs.Alert.inputs) {
                    if (window.ucs.Alert.inputs.phone) {
                        phoneNode.set('value', window.ucs.Alert.inputs.phone).addClass('active');
                    }
                    if (window.ucs.Alert.inputs.email) {
                        emailNode.set('value', window.ucs.Alert.inputs.email).addClass('active');
                    }
                    view.enableButton();
                }

                phoneNode.on('keydown', function (e) {
                    var keycode = (e.keyCode) ? e.keyCode : e.which;
                    setTimeout(function () {
                        phoneNode.removeClass('error');
                        phoneError.setStyle('display', 'none');
                        if (view.enableButton()) {
                            /* hit enter to submit the form */
                            if (13 === keycode || 10 === keycode) {
                                view.handleSubmit(e);
                            }
                        }
                    }, 0);
                });
                emailNode.on('keydown', function (e) {
                    var keycode = (e.keyCode) ? e.keyCode : e.which;
                    setTimeout(function () {
                        emailNode.removeClass('error');
                        emailError.setStyle('display', 'none');
                        if (view.enableButton()) {
                            /* hit enter to submit the form */
                            if (13 === keycode || 10 === keycode) {
                                view.handleSubmit(e);
                            }
                        }
                    }, 0);
                });

                phoneNode.on('blur', function () {
                    var phone = phoneNode.get('value');
                    if (phone) {
                        phone = phone.replace(/[+\s()-]/g, '');
                    }
                    phoneNode.removeClass('on-load');
                    if (true === view.validatePhone(phone)) {
                        phoneNode.addClass('active');
                    } else {
                        phoneNode.removeClass('active');
                    }
                });

                emailNode.on('blur', function () {
                    var email = emailNode.get('value');
                    if (true === view.validateEmail(email)) {
                        emailNode.addClass('active');
                    } else {
                        emailNode.set('value', '');
                        emailNode.removeClass('active');
                    }
                });

                emailNode.on('focus', function () {
                    setTimeout(function () {
                        phoneNode.removeClass('on-load');
                    }, 0);
                });

                if(Y.UA.android !== null && Y.UA.android !== 0) {
                    Y.one(conf.ids.input_phone).setAttribute('placeholder', '1 555 555 5555');
                }
                else {
                    Y.jQYUI(conf.ids.input_phone).mask('+1 (999) 999-9999');
                }

                if ('1' === conf.enableAutoSuggest) {
                    //Documentation for plugging-in YUI Autocomplete is here: http://yuilibrary.com/yui/docs/autocomplete/
                    phoneNode.plug(Y.Plugin.AutoComplete, {
                        activateFirstItem: true,
                        circular: true,
                        tabSelect: true,
                        queryDelimiter: '(',
                        source: ['4082222222', '4081111111', '4089999999'],//TODO: this will be replaced with actual sonora call to get phone nums from membership
                        resultFilters: 'startsWith',
                        on : {
                            query : formatPhone
                        }
                    });

                    emailNode.plug(Y.Plugin.AutoComplete, {
                        activateFirstItem: true,
                        circular: true,
                        tabSelect: true,
                        source: ['test@yahoo-inc.com', 'test-user@yahoo-inc.com'], //TODO: this will be replaced with actual sonora call to get emails IDs from membership
                        resultFilters: 'startsWith'
                    });
                }

                if (data.type === 'live_nation' && Number(data.tbd) === 0) {
                    Y.ucs.AlertAddToCalendar.init('.atc-wrapper');
                }
                return this;
            };

            view.getViewText = function (data) {
                var template = '',
                    micro = new Y.Template();

                if (data.text) {
                    return data.text;
                }
                if (data.type === 'live_nation') {
                    if (Number(data.tbd)) {
                        template = 'Get a text or email when <span class="yucs-alert-custom"><%= this.data.name %>\'s</span> live stream is about to start.';
                        return micro.render(template, {data: data});
                    } else {
                        view.addFormattedDates(data);
                        template = 'Get a text or email when the live stream of <span class="yucs-alert-custom"><%= this.data.name %> on <%= this.data.date_short %> at <%= this.data.date_time %></span> is about to start.';

                        return micro.render(template, {data: data});
                    }
                } else {
                    return 'Notify me when the livestream is about to start';
                }
            };

            view.addFormattedDates = function (data) {
                var timezone = Y.Date.format(Y.Date.parse(data.date), {format: '%Z'});

                Y.Intl.setLang('datatype-date-format', 'en-US');
                data.date_formatted = Y.Date.parse(data.date);
                data.date_short = Y.Date.format(Y.Date.parse(data.date), {format: '%B %e'});
                data.date_time = Y.Date.format(Y.Date.parse(data.date), {format: '%l:%M %p {{tz}}'});
                data.date_time = data.date_time.replace('{{tz}}', helpers.mapTimezone(timezone));
                return data;
            };

            view.enableButton = function () {
                var button = Y.one('#yucs-alert-subscribe'),
                    inputs = view.getInputs(),
                    isFormValid = false,
                    errors;

                inputs.phone = inputs.phone.replace('_', '');
                errors = this.validate(inputs)[1];
                if (Y.Object.isEmpty(errors)) {
                    button.removeClass('disabled');
                    button.removeAttribute('disabled');
                    isFormValid = true;
                }
                else {
                    button.addClass('disabled');
                    button.setAttribute('disabled', 'true');
                }
                return isFormValid;
            };

            /**
             * This function removes the non-digits in query string to match with response from membership API
             * Called when phone number is being keyed.
             */
            var formatPhone = function (query) {

                var formattedQuery = null;

                if (query && query.query) {
                    formattedQuery = query.query.replace(/\D/g, '');
                }
                if (formattedQuery) {
                    formattedQuery = formattedQuery.toString();
                    query.query = formattedQuery;
                }
            };

            view.handleClose = function () {
                Y.Global.fire('ucs-alert:hide-overlay', {data: 'action'});
            };

            view.getInputs = function () {
                return {
                    phone: Y.one(conf.ids.input_phone).get('value'),
                    email: Y.one(conf.ids.input_email).get('value')
                };
            };

            view.validate = function (inputs) {
                var fields = {},
                    errors = {};

                inputs.phone = inputs.phone.replace(/[+\s()-]/g, '');
                fields.phone = inputs.phone;
                if (fields.phone !== '' && !this.validatePhone(fields.phone)) {
                    errors.phone = true;
                }

                // input: email
                inputs.email = Y.Lang.trim(inputs.email);
                fields.email = inputs.email;
                if (fields.email !== '' && !this.validateEmail(fields.email)) {
                    errors.email = true;
                }

                // both phone and email are empty?
                if (fields.phone === '' && fields.email === '') {
                    errors.phone = true;
                    errors.email = true;
                }

                return [fields, errors];
            };

            view.validatePhone = function (phone) {
                if (phone.substring(0, 1) === '1') {
                    if (phone.length !== 11) {
                           return false;
                    }
                }
                else {
                    if (phone.length !== 10) {
                           return false;
                    }
                }

                return true;
            };

            view.validateEmail = function (email) {
                // format: xxx@yyy.zzz
                return (/(.+@.+\..+)/).test(email);
            };

            view.on('input-error', function (e) {
                var data = e.data,
                    phoneNode = Y.one(conf.ids.input_phone),
                    emailNode = Y.one(conf.ids.input_email),
                    phoneError = Y.one(conf.ids.e_input_phone),
                    emailError = Y.one(conf.ids.e_input_email),
                    nodes = {
                        phone: phoneError,
                        email: emailError,
                        system: Y.one(conf.ids.e_system)
                    };


                if ('' === phoneNode.get('value')) {
                    phoneNode.removeClass('error');
                    phoneNode.blur();
                } else if ('' === emailNode.get('value')) {
                    emailNode.removeClass('error');
                    emailNode.blur();
                }

                if (data.errors.phone) {
                    nodes.phone.setStyle('display', 'block');
                    phoneNode.addClass('error');
                    phoneNode.focus();
                } else {
                    phoneError.setStyle('display', 'none');
                }

                if (data.errors.email) {
                    emailError.setStyle('display', 'block');
                    emailNode.addClass('error');
                    emailNode.focus();
                } else {
                    emailError.setStyle('display', 'none');
                }

                if (data.errors.system) {
                    if (data.error && data.error.message && data.error.message.description && data.error.message.description === 'Invalid crumb.') {
                      /*
                        nodes.system.setHTML('Your session is expired, please <a href="'+ this.get('data').fullUrl + // The event URL
                                             '?reminder=true"' +
                                             't1="a0" '+
                                             't2="ucs-alert" '+
                                             't3="refresh" '+
                                             'sec="ucs-alert" '+
                                             'slk="refresh" '+
                                             'elm="btn" '+
                                             'g="'+ this.get('data').id + '" '+
                                             'cat="live_nation" '+
                                             'itc="0" '+
                                             '>refresh</a> the page and try again.');
                        */
                        nodes.system.setHTML('Your session is expired, please refresh the page and try again.');
                        nodes.system.setStyle('display', 'block');
                    } else {
                        nodes.system.setHTML('Temporarily unavailable, please try again later.');
                        nodes.system.setStyle('display', 'block');
                    }
                } else {
                    nodes.system.setStyle('display', 'none');
                }
            });

            view.on('input-ok', function (e) {
                var data = e.data,
                    nodes = {
                        phone: Y.one(conf.ids.e_input_phone),
                        email: Y.one(conf.ids.e_input_email),
                        system: Y.one(conf.ids.e_system)
                    };

                nodes.email.setStyle('display', 'none');
                nodes.phone.setStyle('visibility', 'hidden');
                nodes.system.setStyle('display', 'none');

                Y.Global.fire('ucs-alert:show-overlay', {data: data});
            });

            view.handleSubmit = function (e) {
                var self = this,
                    // get phone and email inputs.
                    inputs = this.getInputs(),
                    eventData = this.get('data'),
                    // validate phone and email in client side.
                    res = this.validate(inputs),
                    fields = res[0],
                    errors = res[1],
                    button = e.currentTarget,
                    getSubmitButtonSlk,
                    createSubscriptionCallback;

                if (button.hasAttribute('disabled')) {
                    return;
                }

                getSubmitButtonSlk = function(inputs) {
                    var slk = 'sbmt p-n e-n';

                    if (inputs.phone !== '' && inputs.phone !== '+1 (   )    -    ') {
                        slk = slk.replace('p-n', 'p-y');
                    }
                    if (inputs.email !== '') {
                        slk = slk.replace('e-n', 'e-y');
                    }
                    return slk;
                };

                createSubscriptionCallback = function (err) {
                    helpers.hideSpinner();
                    var errors,
                        errorType = 'system-error',
                        existing;

                    if (err) {
                        errors = helpers.getError(err);
                        if (!errors && ( err.error && err.error.message && err.error.message.description)) {
                            existing =  (err.error.message.description.toLowerCase().indexOf('existing') > -1);
                        }
                    }
                    if (errors) {
                        err.errors = errors;
                        err.fields = {};

                        if (errors.phone) {
                            errorType = 'invalid-phone';
                        } else if (errors.email) {
                            errorType = 'invalid-email';
                        }

                        Y.fire('ucs-alert:submit', {result: errorType,
                                                    slk:'sbmt-error',
                                                    cat: view.trackingInfo.cat,
                                                    g: view.trackingInfo.g
                                                    });
                        self.fire('input-error', { data : err });
                    } else {
                        var localData = self.get('data');
                        localData.template = 'confirmation';
                        localData.phone = inputs.phone;
                        localData.email = inputs.email;
                        localData.date = Y.Date.parse(eventData.date).getTime();
                        localData.name = eventData.name;
                        

                        // Save inputs on local variable to avoid multiple
                        window.ucs.Alert.inputs = {};
                        window.ucs.Alert.inputs.phone = inputs.phone;
                        window.ucs.Alert.inputs.email = inputs.email;

                        if (existing) {
                            Y.fire('ucs-alert:submit', {result: 'duplicate',
                                                        slk: getSubmitButtonSlk(inputs),
                                                        cat: view.trackingInfo.cat,
                                                        g: view.trackingInfo.g,
                                                        outcome: 'sbmt'
                                                       });
                        } else {
                            Y.fire('ucs-alert:submit', {result: 'new',
                                                        slk: getSubmitButtonSlk(inputs),
                                                        cat: view.trackingInfo.cat,
                                                        g: view.trackingInfo.g,
                                                        outcome: 'sbmt'
                                                       });
                        }
                        self.fire('input-ok', {data: localData});
                    }
                };


                if (button) {
                    button.addClass('disabled');
                    button.setAttribute('disabled', 'true');
                }

                // input error?
                if (!Y.Object.isEmpty(errors)) {
                    this.fire('input-error', {data: {fields: fields, errors: errors}});
                    return this;
                }
                if(eventData.type === "get_the_app")
                {
                    helpers.createSubscriptionGTA(inputs, eventData, createSubscriptionCallback);
                }
                else{
                    helpers.createSubscription(inputs, eventData, createSubscriptionCallback);

                }
            };

            return view;
        };

    }, '0.0.1', {
        requires: [
            'view',
            'ucs-alert-view'
        ]
    });

})(window);

(function(a){a.YUI.add("ucs-alert-view",function(f){f.namespace("ucs");f.publish("ucs-alert-tracker:close-overlay",{broadcast:2});f.publish("ucs-alert-tracker:show-view",{broadcast:2});f.publish("ucs-alert:submit",{broadcast:2});f.publish("ucs-alert:remind-me",{broadcast:2});var c,e={},d={},b=function(h){return(new f.ucs.AlertTemplate(h)).getData();},g=function(j){var i={},h={signup:f.ucs.AlertViewSignup,confirmation:f.ucs.AlertViewConfirmation};f.Object.each(j,function(m,l){i[l]=h[l]({id:l,template:d[l]});});return i;};f.ucs.AlertView=function(h){c=h;this.init();};f.ucs.AlertView.prototype={getData:function(){return e;},init:function(){d=b(c.templates);e=g(d);},showLegal:function(j){var i=j.currentTarget,h=i.one(".text"),k=i.one(".l-tri");if(h){h.setStyle("display","block");}if(k){k.setStyle("display","block");}},mapTimezone:function(h){h=h.toUpperCase();var i={"HST":"HT","HDT":"HT","AKST":"AKT","AKDT":"AKT","PST":"PT","PDT":"PT","MST":"MT","MDT":"MT","CST":"CT","CDT":"CT","EST":"ET","EDT":"ET","AST":"AT","ADT":"AT"};return i[h]||h;},hideLegal:function(j){var i=j.currentTarget,h=i.one(".text"),k=i.one(".l-tri");if(h){h.setStyle("display","none");}if(k){k.setStyle("display","none");}},getCrumbGTA:function(){var h="",i=f.one(c.ids.meta);if(!f.Lang.isNull(i)){h=i.getAttribute("data-gta");}return h;},getProperty:function(){var i="",h=f.one(c.ids.meta);if(!f.Lang.isNull(h)){i=h.getAttribute("data-property");}return i;},getCrumb:function(){var h="",i=f.one(c.ids.meta);if(!f.Lang.isNull(i)){h=i.getAttribute("data-crumb");}return h;},showSpinner:function(){if(f.one(c.ids.button_submit)){f.one(c.ids.input_phone).set("disabled","disabled").removeClass("active");f.one(c.ids.input_email).set("disabled","disabled").removeClass("active");f.one("#yucs-subscribe-text").hide();f.one("#yucs-spinner").show();}},hideSpinner:function(){if(f.one(c.ids.button_submit)){f.one(c.ids.input_phone).removeAttribute("disabled");f.one(c.ids.input_email).removeAttribute("disabled");f.one("#yucs-subscribe-text").show();f.one("#yucs-spinner").hide();}},createSubscriptionGTA:function(m,j,l){var i="",k={},h={};this.showSpinner();k=c.env_details.subscriptions;if(c.qs&&c.qs["ucs-error"]){h.error=c.qs["ucs-error"];}h.c="GetTheApp";h.a="send";h.phoneNumber=this.normalizePhonePrefix(m.phone);h.email=m.email;h.appid=j.id;h.wssid=this.getCrumbGTA();h.button_revision="gtar1";h.modal_revision="1";h.property=this.getProperty();h.format="json";h.crumb=this.getCrumb();h.event_type="universal_header";h=f.QueryString.stringify(h);h=f.Lang.sub("{qs}&callback={callback}",{qs:h});k.query=h;i=f.ucs.Alert.buildUrl(k);f.jsonp(i,{on:{"success":function(n){if(n.error){n.fields={};n.errors={};l(n,null);return false;}l(null,n);return true;},"failure":function(){var n={errors:{system:true}};l(n,null);return false;}}});},createSubscription:function(m,j,l){var i="",k={},h={};this.showSpinner();k=c.env_details.subscriptions;if(c.qs&&c.qs["ucs-error"]){h.error=c.qs["ucs-error"];}h.c="subscriptions";h.a="add";h.phone=this.normalizePhonePrefix(m.phone);h.email=m.email;h.event_id=j.id;h.event_name=j.name;h.event_date=f.Date.parse(j.date).getTime();h.event_expire_time=this.getExpireTime(j.date);h.event_type=j.type;h.crumb=this.getCrumb();h=f.QueryString.stringify(h);h=f.Lang.sub("{qs}&callback={callback}",{qs:h});k.query=h;i=f.ucs.Alert.buildUrl(k);f.jsonp(i,{on:{"success":function(n){if(n.error){n.fields={};n.errors={};l(n,null);return false;}l(null,n);return true;},"failure":function(){var n={errors:{system:true}};l(n,null);return false;}}});},normalizePhonePrefix:function(h){if(h===""||h.substring(0,1)==="1"){return h;}else{return"1"+h;}},getExpireTime:function(j){var i,h;h=f.Date.addDays(f.Date.parse(j),10);if("[object Date]"===Object.prototype.toString.call(h)){i=h.getTime();if(!isNaN(i)){return i;}}f.log("couldnt get 10th day after event. got ="+i,"error");return j;},getError:function(k){var j,l=function(m){var i;if(m.toLowerCase().indexOf("email")>-1){i={};i.email=true;}else{if(m.toLowerCase().indexOf("phone")>-1){i={};i.phone=true;}else{if(m.toLowerCase().indexOf("existing")===-1){i={};i.system=true;}}}return i;};if(k.error&&k.error.message){if(k.error.message.length){for(var h=k.error.message.length-1;h>=0;h--){j=l(k.error.message[h].description);}}else{j=l(k.error.message.description);}}else{if(k.errors){j=k.errors;}else{j={system:true};}}return j;}};},"0.0.1",{requires:["io","view","jsonp","jq-yui","attribute","event-hover","event-custom","datatype-date","autocomplete","autocomplete-filters","ucs-alert-template",]});})(window);var Tinypopup=(function(f,h){var d=200;function e(k,l){var j;for(j in l){if(l.hasOwnProperty(j)){if(j==="top"||j==="left"||j==="width"||j==="height"){k.style[j]=l[j]+"px";}else{k.style[j]=l[j];}}}}function b(){this.shadow=h.createElement("div");this.shadow.id="tinypopup-shadow";this.shadow.className="tinypopup-shadow";this.el.parentNode.appendChild(this.shadow);}function c(k,j,l){if(k.addEventListener){k.addEventListener(j,l,false);}else{k.attachEvent("on"+j,l);}}function g(l,j,k,m){if(l){c(l,j,(function(){return function(){m.apply(k);};}(k)));}}function i(p,q){var n,l,k=[],o=new RegExp("(^| )"+q+"( |$)"),m=p.getElementsByTagName("*");for(n=0,l=m.length;n<l;n+=1){if(o.test(m[n].className)){k.push(m[n]);}}return k;}function a(l,j,k,m){if(!l.nodeName){l=h.getElementById(l);}this.el=l;this.w=0;this.h=0;this.el.style.display="";this.el.className="tinypopup-content";this.onshow=j;this.onhide=k;this.onresize=m;this.showing=false;b.apply(this);g(this.shadow,"click",this,this.hide);g(f,"resize",this,this.resize);this.attachCloseButton();}a.prototype.attachCloseButton=function(){if(this.el&&this.el.querySelector){this.closeButton=this.el.querySelector(".tinypopup-closebutton");}else{if(this.el){this.closeButton=i(this.el,"tinypopup-closebutton")[0];}}if(this.closeButton){g(this.closeButton,"click",this,this.hide);}};a.prototype.show=function(j,k,l){this.w=j;this.h=k;this.shadow.className="tinypopup-shadow show";this.el.className="tinypopup-content show";if(l){this.el.innerHTML="";this.el.appendChild(l);}this.attachCloseButton();this.resize();if(this.onshow){this.onshow(this.el);}this.showing=true;setTimeout((function(m){return function(){m.showing=false;};})(this),d);};a.prototype.hide=function(){if(!this.showing){this.shadow.className="tinypopup-shadow hide";this.el.className="tinypopup-content hide";if(this.onhide){this.onhide(this.el);}}};a.prototype.resize=function(){if(this.onresize){this.onresize(this.el);}};return a;}(window,document));(function(a){a.YUI.add("ucs-alert",function(e){e.namespace("ucs");var d=e.guid(),g=null,j=null,b={},f=null,m={},h={id:{req:1},name:{req:1},date:{req:0,val:e.Date.addYears(new Date(),1)},type:{req:1},genre:{req:0,val:""},url:{req:0,val:"https://screen.yahoo.com/live"},fullUrl:{req:0,val:"yahoo.com/live"},image:{req:0,val:""},text:{req:0,val:""},cnfrmText:{req:0,val:""},template:{req:0,val:"signup"},phone:{req:0,val:""},email:{req:0,val:""},tbd:{req:0,val:"0"}},k={prod:{subscriptions:{scheme:"https://",host:"ucs.netsvs.yahoo.com",port:":443",path:"/ucs/alert/",query:{}},upcoming:{scheme:"https://",host:"video.media.yql.yahoo.com",port:":443",path:"/v1/video/events",query:{}}},nonprod:{subscriptions:{scheme:"http://",host:"fe5.netsvs.gq1.yahoo.com",port:":80",path:"/ucs/alert/",query:{}},upcoming:{scheme:"http://",host:"video.media.yql.yahoo.com",port:":4080",path:"/v1/video/events",query:{}}},mock:{subscriptions:{scheme:"http://",host:"accentdiscontent.corp.ne1.yahoo.com",port:":80",path:"/ucs/alert/dummy/",query:{}},upcoming:{scheme:"http://",host:"video.media.yql.yahoo.com",path:"/v1/video/events",query:{}}}},n=function(o){var p={};e.Object.each(o.ids,function(r,q){p[q]=e.one(r);});return p;},l=function(o){return(new e.ucs.AlertView(o)).getData();},c=function(q,r){if(!e.Object.hasKey(m,q)){e.log("view not found. name="+q,"warn");return;}if(!e.Lang.isNull(j)){var p=e.one("#yucs-alert-overlay");p.setStyle("borderWidth","0");j.remove();}j=m[q];j.set("data",r);j.render();var o=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;if(o>800){f.show(706,560);}else{f.show(406,560);}},i=function(p){var o={},q={};e.Object.each(h,function(s,r){if(s.req===1){if(!e.Object.hasKey(p,r)){q[r]=e.Lang.sub("{param} is required.",{param:r});}else{if(e.Lang.isNull(p[r])||e.Lang.isUndefined(p[r])||""===p[r]){q[r]=e.Lang.sub("{param} must not be empty.",{param:r});}else{o[r]=e.Object.getValue(p,r);}}}else{if(e.Object.hasKey(p,r)&&p[r]){o[r]=p[r];}else{o[r]=e.Object.getValue(s,"val");}}});return[o,q];};e.ucs.Alert=function(p){var o=e.ucs.Alert.parseUrl(window.location.href,"query");this.config=p;if(!e.Lang.isNull(o)&&!e.Lang.isUndefined(o)){this.config.qs=e.QueryString.parse(o);}else{this.config.qs=null;}if(e.Object.hasKey(this.config.qs,"ucs-env")&&e.Object.hasKey(k,this.config.qs["ucs-env"])){this.config.env=this.config.qs["ucs-env"];}else{this.config.env="prod";}this.config.env_details=k[this.config.env];this.init();};e.ucs.Alert.buildUrl=function(p){var o="",q;for(q in p){if(q==="query"){o+="?";}o+=p[q];}return o;};e.ucs.Alert.parseUrl=function(u,p){var r=["source","scheme","authority","userInfo","user","pass","host","port","relative","path","directory","file","query","fragment"],t=/^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,o=t.exec(u),s={},q=14;while(q--){if(o[q]){s[r[q]]=o[q];}}if(p){return s[p];}delete s.source;return s;};e.ucs.Alert.prototype={handleHideOverlay:function(o){o.halt();f.hide();e.fire("ucs-alert-tracker:close-overlay",j.trackingInfo);},handleShowOverlay:function(o){o.halt();c(o.data.template,o.data);},prepopulateInputs:function(){if(this.getAuthState()==="signedin"&&window.location.href.match(/screen.yahoo.com\/live\//gi)){this.fetchLastSubscription(function(o){if(!o||!o.channelDetails){return;}window.ucs.Alert.inputs={};window.ucs.Alert.inputs.phone=o.channelDetails.sms||"";window.ucs.Alert.inputs.email=o.channelDetails.email||"";});}},fetchLastSubscription:function(r){var o={},q=this.config.env_details.subscriptions,p;o.c="subscriptions";o.crumb=this.getCrumb();o.count=1;o.event_type="live_nation";o=e.QueryString.stringify(o);o=e.Lang.sub("{qs}&callback={callback}",{qs:o});q.query=o;p=e.ucs.Alert.buildUrl(q);e.jsonp(p,{on:{"success":function(s){if(s.error||!s.data.subscriptions){return false;}r(s.data.subscriptions[0]);return true;},"failure":function(){return false;}}});},getCrumb:function(){var o="",p=e.one(this.config.ids.meta);if(!e.Lang.isNull(p)){o=p.getAttribute("data-crumb");}return o;},getAuthState:function(){var p="",o=e.one(this.config.ids.meta);if(!e.Lang.isNull(o)){p=o.getAttribute("data-authstate");}return p;},onEscape:function(o){if(o.keyCode===27){e.Global.fire("ucs-alert:hide-overlay",o);}},init:function(){var o=this;b=n(this.config);m=l(this.config);f=new a.Tinypopup(b.overlay.getDOMNode(),null,null,function(r){var q=(window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight)-83,s=Math.max((q-this.h)/2,0),p=window.pageYOffset||document.documentElement.scrollTop;r.style.top=s+p+"px";});e.Global.on("ucs-alert:show-overlay",e.bind(function(p){if(p.origin!==d){o.showOverlay(p.data);}e.one("html").delegate("key",this.onEscape,"down:27");},this));e.Global.on("ucs-alert:hide-overlay",e.bind(function(p){if(p.origin!==d){o.hideOverlay();}e.one("html").detach("key",this.onEscape);},this));e.one("#tinypopup-shadow").on("click",this.handleHideOverlay);this.publish("show-overlay",{defaultFn:this.handleShowOverlay});this.publish("hide-overlay",{defaultFn:this.handleHideOverlay});setTimeout(function(){o.fire("init");},1);this.prepopulateInputs();},showOverlay:function(p){var q=i(p),o=q[0],r=q[1];if(e.Object.isEmpty(r)){this.fire("show-overlay",{data:o});}else{e.log(r,"warn");}},hideOverlay:function(){this.fire("hide-overlay");},toString:function(){return"This is Y.ucs.Alert component.";}};e.augment(e.ucs.Alert,e.EventTarget,true,null,{emitFacade:true,broadcast:0});},"0.0.1",{requires:["ucs-alert-tracker","ucs-alert-view","event","event-custom","querystring","node","template","tinypopup","maskedinput"]});})(window);