var foxPrivacyApp = foxPrivacyApp || {};

var settings = {
    init: function() {
        settings.deck = document.querySelector("x-deck");
        settings.slidebox = document.querySelector("x-slidebox");
        settings.slides = settings.slidebox.querySelector("x-slides").children;

        settings.follow_deep_link();
        window.addEventListener("hashchange", settings.follow_deep_link, false);

        new GestureDetector(settings.slidebox).startDetecting();

        settings.slidebox.addEventListener('swipe', function(event){
            var direction = event.detail.direction;

            if (direction == 'left') {
                direction = 1;
            }
            else if (direction == 'right') {
                direction = -1;
            }

            var current_slide = settings.get_current_slide();
            if (typeof current_slide === "undefined") {
                current_slide = settings.slides[0];
            }
            var current_slide_index = Array.prototype.indexOf.call(settings.slides, current_slide);
            var next_slide_index = (current_slide_index + direction) % settings.slides.length;
            console.log(current_slide_index + " " + next_slide_index);
            var next_slide = settings.slides[next_slide_index];
            var current_topic = current_slide.querySelector(".topic");
            var next_topic = next_slide.querySelector(".topic");

            if (current_topic && next_topic) {
                if (settings.is_topic_info_mode(current_topic)) {
                    console.log('info '+next_topic.className);
                    settings.topic_info_mode_scroll(next_topic);
                }
                else {
                    console.log('settings '+next_topic.className);
                    settings.topic_settings_mode_scroll(next_topic);
                }
            }

            settings.slidebox.slideTo(next_slide_index);
                        
        });
        
        var setting_toggles = document.querySelectorAll(".setting-toggle");

        var setting_toggle_click = function(event){
            settings.toggle_setting(this);
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
        scroll_target_offset = settings.real_offset(scroll_target, topic);
        if (topic.scrollTop < scroll_target_offset.top - 30) {
            return true;
        }
        return false;
    },
    topic_info_mode_scroll: function(topic, smooth) {
        topic.scrollTop = 0;

        if (smooth === true) {
            settings.smooth_scroll_to(topic, topic.parentElement);
        }
    },
    topic_settings_mode_scroll: function(topic) {
        var target = topic.querySelector(".settings-scroll-target");
        var target_offset = settings.real_offset(target, topic);
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

        if (settings.is_topic_info_mode(topic)) {
            settings.topic_info_mode_scroll(topic, true);
        }
    },

    smooth_scroll_to: function(area, target) {
        var distance = area.scrollTop - target.offsetTop;
        if (distance) {
            var step = 50;
            var signed_step = distance > 0 ? -step : step;
            area.scrollTop += signed_step;

            setTimeout(function() {
                settings.smooth_scroll_to(area, target);
            }, 10);
        }
    },

    find_ancestor_with_class: function(elem, class_name, levels) {
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
        for (var i = 0; i < settings.slides.length; i++) {
            var slide = settings.slides[i];
            if (slide.getAttribute("selected")) {
                return slide;
            }
        }
    },

    follow_deep_link: function() {
        //var [card, slide, scroll] = window.location.hash.split('#').slice(1);
        var card, slide, scroll,
            path = window.location.hash.split('#').slice(1);
        if(path.length > 0) {
            card = path[0];
            console.log(card);
        }
        if(path.length > 1) {
            slide = path[1];
            console.log(slide);
        }
        if(path.length > 2) {
            scroll = path[2];
            console.log(scroll);
        }

        if (!card) { return; }
        settings.shuffle_to(card);

        if (!slide) { return; }
        slide = [card, slide].join(' ');
        settings.slide_to(slide);

        if (!scroll) { return; }
        settings.scroll_to(slide, scroll);
    },

    shuffle_to: function(card_content_selector) {
        var card_content = settings.deck.querySelector(card_content_selector);
        var card = card_content.parentElement;
        var cards = settings.deck.children;
        var card_index = Array.prototype.indexOf.call(cards, card);
        settings.deck.shuffleTo(card_index);
    },

    slide_to: function(slide_content_selector) {
        var slide_content = settings.slidebox.querySelector(slide_content_selector);
        var slide = slide_content.parentElement;
        var slide_index = Array.prototype.indexOf.call(settings.slides, slide);
        settings.slidebox.slideTo(slide_index);
    },

    scroll_to: function(area_selector, target_selector) {
        var area = document.querySelector(area_selector);
        var target = area.querySelector(target_selector);
        var target_offset = settings.real_offset(target, area);
        area.scrollTop = target_offset.top;
    },

    slide_and_scroll_to: function(slide, scroll) {
        var scroll_area = settings.slidebox.querySelector(slide);
        if (scroll !== null) {
            slide = scroll_area.parentElement;
            var slide_index = Array.prototype.indexOf.call(settings.slides, slide);
            settings.slidebox.slideTo(slide_index);
        }

        if (typeof scroll === "string" && scroll !== "") {
            scroll = slide.querySelector(scroll);
            if (scroll !== null) {
                scroll_area.scrollTop = scroll.offsetTop;
            }
        }
    },

    toggle_setting: function(elem) {
        
        var settingElement = settings.find_ancestor_with_class(elem, "setting"),
            action = elem.getAttribute('data-action'),
            target = elem.getAttribute('data-target') || undefined,
            value,
            disabled = false;

        if (settingElement) {
            var settingsList = settings.find_ancestor_with_class(settingElement, "settings-list");
            if(settingsList) {
                disabled = settingsList.classList.contains('disabled');
            }
            else {
                var settingsLists = settingElement.parentElement.getElementsByClassName('settings-list');
                for(var i in settingsLists) {
                    var settingsList = settingsLists.item(i);
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
            if(!disabled) {
                settingElement.classList.toggle("off");
                settingElement.classList.toggle("on");
            }
            value = settingElement.classList.contains('on');
        }

        if(!disabled) {
            foxPrivacyApp.handleSetting(action, value, target);
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
    foxPrivacyApp.locationBlur.init();
    foxPrivacyApp.insertAppList(function() {
        var e = new Event('AppListDone');
        document.dispatchEvent(e);
    });
});

document.addEventListener('AppListDone', settings.init);
