var app = app || {};

(function() {
    app.settings = {
        init: function() {
            app.settings.rootDeck = document.querySelector("x-deck");
            app.settings.slidebox = document.querySelector("x-slidebox.wizard");
            app.settings.slides = app.settings.slidebox.querySelector("x-slides").children;

            app.settings.followDeepLink();
            window.addEventListener("hashchange", app.settings.followDeepLink, false);

            new GestureDetector(app.settings.slidebox).startDetecting();

            app.settings.slidebox.addEventListener('swipe', function(event){
                var direction = event.detail.direction;

                if (direction == 'left') {
                    direction = 1;
                }
                else if (direction == 'right') {
                    direction = -1;
                }

                var current_slide = app.settings.get_current_slide();
                if (typeof current_slide === "undefined") {
                    current_slide = app.settings.slides[0];
                }
                var current_slide_index = Array.prototype.indexOf.call(app.settings.slides, current_slide);
                var next_slide_index = (current_slide_index + direction) % app.settings.slides.length;
                console.log(current_slide_index + " " + next_slide_index);
                var next_slide = app.settings.slides[next_slide_index];
                var current_topic = current_slide.querySelector(".topic");
                var next_topic = next_slide.querySelector(".topic");

                if (current_topic && next_topic) {
                    if (app.settings.is_topic_info_mode(current_topic)) {
                        console.log('info '+next_topic.className);
                        app.settings.topic_info_mode_scroll(next_topic);
                    }
                    else {
                        console.log('app.settings '+next_topic.className);
                        app.settings.topic_app.settings_mode_scroll(next_topic);
                    }
                }

                app.settings.slidebox.slideTo(next_slide_index);

            });

            var setting_toggles = document.querySelectorAll(".setting-toggle");

            var setting_toggle_click = function(event){
                app.settings.toggleSetting(this);
            };

            for (var i = 0; i < setting_toggles.length; i++) {
                setting_toggles[i].addEventListener('click', setting_toggle_click);
            }

        },

        real_offset: function(element, container) {
            var top = 0, left = 0;
            do {
                top += element.offsetTop  || 0;
                left += element.offsetLeft || 0;
                element = element.offsetParent;
            } while(element && element !== container);

            return {
                top: top,
                left: left
            };
        },

        is_topic_info_mode: function(topic) {
            var scroll_target = topic.querySelector(".settings-scroll-target");
            scroll_target_offset = app.settings.real_offset(scroll_target, topic);
            if (topic.scrollTop < scroll_target_offset.top - 30) {
                return true;
            }
            return false;
        },
        topic_info_mode_scroll: function(topic, smooth) {
            topic.scrollTop = 0;

            if (smooth === true) {
                app.settings.smooth_scroll_to(topic, topic.parentElement);
            }
        },
        topic_settings_mode_scroll: function(topic) {
            var target = topic.querySelector(".settings-scroll-target");
            var target_offset = app.settings.real_offset(target, topic);
            topic.scrollTop = target_offset.top;
        },

        topic_scroll: function(topic) {
            if (topic.scrollTop < 10 && topic.classList.contains("on")) {
                var top = topic.querySelector(".topic-top");
                top.style.transition = "margin-top 0.18s";
                setTimeout(function() {
                    top.style.marginTop = "-80px";
                    setTimeout(function() {
                        top.style.marginTop = "0";
                    }, 400);
                }, 100);
                return;
            }

            if (app.settings.is_topic_info_mode(topic)) {
                app.settings.topic_info_mode_scroll(topic, true);
            }
        },

        smooth_scroll_to: function(area, target) {
            var atance = area.scrollTop - target.offsetTop;
            if (distance) {
                var step = 50;
                var signed_step = distance > 0 ? -step : step;
                area.scrollTop += signed_step;

                setTimeout(function() {
                    app.settings.smooth_scroll_to(area, target);
                }, 10);
            }
        },

        findAncestorWithClass: function(elem, class_name, levels) {
            levels = typeof levels !== "undefined" ? levels : 10;
            var setting_found = false;

            while (levels > 0 && !setting_found) {
                levels--;
                elem = elem.parentElement;
                if(elem == null) {
                    break;
                }
                setting_found = elem.classList.contains(class_name);
            }

            return !setting_found ? false : elem;
        },

        get_current_slide: function() {
            for (var i = 0; i < app.settings.slides.length; i++) {
                var slide = app.settings.slides[i];
                if (slide.getAttribute("selected")) {
                    return slide;
                }
            }
        },

        followDeepLink: function() {
            var pathArray = window.location.hash.split('#').slice(1);
            app.settings.followLinkRecursive(app.settings.rootDeck, pathArray);
        },

        followLinkRecursive: function(element, pathArray) {
            if(pathArray.length > 0) {
                var index = index || 0;
                var selector = pathArray[index];
                console.log('step: ' + selector);
                var grandchildElement = element.querySelector(selector);
                if(grandchildElement !== null) {
                    var childElement = grandchildElement.parentElement;
                    var parentElement = childElement.parentElement;
                    console.log('tagName: ' + parentElement.tagName);
                    if(parentElement.tagName === 'X-DECK' || parentElement.tagName === 'X-SLIDES') {
                        var childIndex = Array.prototype.indexOf.call(parentElement.children, childElement);
                        if(parentElement.tagName === 'X-DECK') {
                            console.log('shuffle to: ' + childIndex);
                            parentElement.shuffleTo(childIndex);
                        }
                        else {
                            console.log('slide to: ' + childIndex);
                            parentElement.parentElement.slideTo(childIndex);
                        }
                        pathArray.shift();
                        app.settings.followLinkRecursive(childElement, pathArray);
                    }
                }
            }
        },

        scroll_to: function(area_selector, target_selector) {
            var area = document.querySelector(area_selector);
            var target = area.querySelector(target_selector);
            var target_offset = app.settings.real_offset(target, area);
            area.scrollTop = target_offset.top;
        },

        slide_and_scroll_to: function(slide, scroll) {
            var scroll_area = app.settings.slidebox.querySelector(slide);
            if (scroll !== null) {
                slide = scroll_area.parentElement;
                var slide_index = Array.prototype.indexOf.call(app.settings.slides, slide);
                app.settings.slidebox.slideTo(slide_index);
            }

            if (typeof scroll === "string" && scroll !== "") {
                scroll = slide.querySelector(scroll);
                if (scroll !== null) {
                    scroll_area.scrollTop = scroll.offsetTop;
                }
            }
        },

        submitForm: function(elem) {
            var fields = elem.querySelectorAll('input');
            for(var i in fields) {
                var field = fields.item(i);
                if(field !== null) {
                    var action = elem.getAttribute('data-action'),
                        target = elem.getAttribute('data-target') || undefined,
                        value = field.value;
                    app.handleSetting(action, value, target);
                }
            }
        },

        toggleSetting: function(elem) {

            var settingElement = app.settings.findAncestorWithClass(elem, "setting"),
                action = elem.getAttribute('data-action'),
                target = elem.getAttribute('data-target') || undefined,
                value,
                disabled = false;

            if (settingElement) {
                value = settingElement.classList.contains('on');
                var parentSettingsList = app.settings.findAncestorWithClass(settingElement, "settings-list");
                var settingsLists = settingElement.parentElement.getElementsByClassName('settings-list');
                if (settingsLists) { // Has children settings
                    for(var i in settingsLists) {
                        var settingsList = settingsLists.item(i);
                        if(settingsList !== null) {
                            settingsList.classList.toggle('disabled');
                            var isDisabled = settingsList.classList.contains('disabled');
                            var inputElements = settingsList.getElementsByTagName('input');
                            for(var j in inputElements) {
                                var inputElement = inputElements.item(j);
                                if(inputElement) {
                                    inputElement.disabled = isDisabled;
                                }
                            }
                        }
                    }
                }
                if(parentSettingsList) {
                    disabled = parentSettingsList.classList.contains('disabled');
                }
                if(!disabled) {
                    if(elem.classList.contains('setting-toggle')) {
                        settingElement.classList.toggle("off");
                        settingElement.classList.toggle("on");
                        app.handleSetting(action, value, target);
                    }
                    else {
                        if(elem.tagName === 'FORM') {
                            app.settings.submitForm(elem);
                        }
                    }
                }
            }


        }
    };

    document.addEventListener('DOMComponentsLoaded', function() {
        HtmlImports.populate(function() {
            var e = new Event('HtmlImportsDone');
            document.dispatchEvent(e);
        });
    });

    document.addEventListener('HtmlImportsDone', function() {
        app.locationBlur.init();
        app.locationCountry.init();
        app.insertAppList(function() {
            var e = new Event('AppListDone');
            document.dispatchEvent(e);
        });
    });

    document.addEventListener('AppListDone', app.settings.init);

}());
