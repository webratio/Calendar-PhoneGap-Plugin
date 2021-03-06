function createStubs() {
    var calendar = null;
    var isHidden = true;
    var $ = window.top.jQuery;

    function initOpenCalendar(date) {
        var calendarTable = "<table border=\"0\" style=\"width:100%;border-collapse: collapse;margin: 44px 0;\">";
        for (var i = 0; i < 24; i++) {
            var hour;
            if (i <= 12) {
                hour = i + ".00 AM";
            } else {
                hour = i - 12 + ".00 PM";
            }
            if (i === 10) {
                calendarTable += "<tr><td width=\"25%\" height=\"40px\">" + hour + "</td>";
                calendarTable += "<td rowspan=\"3\" height=\"40px\"><div style=\"background: #666;  border-radius: 10px; color: #fff; font-size:150%;display: table-cell;vertical-align: middle;height: 120px;width: 200px;max-width: 100%;\"><p align=\"center\">Meeting</p></div></td>";
            } else {
                calendarTable += "<tr><td width=\"25%\" height=\"40px\">" + hour + "</td><td>";
                if (i < 10 || i > 12) {
                    calendarTable += "<hr/>";
                }
                calendarTable += "</td>";
            }
            calendarTable += "</tr>";
        }
        calendarTable += "</table>";

        $('#wr-calendar-emulator').remove();
        var dateToShow = new Date(date)
        var openCalendarTemplate = [
                "<section id=\"wr-calendar-emulator\" style=\"display:none; background: rgba(0, 0, 0, 0); position: absolute; width: 100%; height: 100%; z-index: 10000;\">",
                "<div style=\"background: #fff; height: 100%; width: 100%; overflow: auto;\">",
            "<div id=\"wr-calendar-title\" style=\"background: #000;  color: #fff;  font-weight: bold; line-height: 44px;padding: 0 10px;position: absolute;top: 0;left: 0;right: 0;\">"
            + dateToShow.toDateString() + "<div id=\"cancel\" style=\"cursor:pointer;float:right;\">CANCEL</div></div>", calendarTable, "</div>", "</section>" ].join("\n");

        var opCalendar = $(openCalendarTemplate);
        $('#overlay-views').append(opCalendar);
        return opCalendar;
    }

    function initSaveEvent(data) {
        $('#wr-calendar-emulator').remove();
        var startDate = new Date();
        var endDate = new Date();
        if (data["startTime"]) {
            startDate = new Date(data["startTime"]);
        }
        if (data["endTime"]) {
            endDate = new Date(data["endTime"]);
        }
        var recurrence = data["options"] && data["options"]["recurrence"];
        if (!recurrence) {
            recurrence = "none";
        }
        var recurrenceEndDate;
        if (data["options"] && data["options"]["recurrenceEndTime"]) {
            recurrenceEndDate = new Date(data["options"]["recurrenceEndTime"]);
        }
        var eventLocation = data["location"];
        var isAllDay = ((endDate.valueOf() - startDate.valueOf()) % 86400000 === 0);
        var headerTable = "<table style=\"width:100%; border-collapse:collapse;\"><tr><td id=\"done\" style=\"cursor:pointer;\">SAVE</td><td style=\"width: 99%;color: #E6E6E6;\">New Event</td><td id=\"cancel\" style=\"cursor:pointer;\">CANCEL</td><tr></table>";
        var eventTable = [
                "<table border=\"0\" style=\"width:100%;border-collapse: collapse; margin: 44px 0;\">",
            "<tr><td id=\"eventTitle\" style=\"padding: 10px;  border-bottom: 1px solid #ddd;font-size: 1.2em;\" colspan=\"2\">"
                        + (data["title"] ? data["title"] : "<i style=\"color:#C0C0C0;\">Insert the title</i>") + "</td></tr>",
            "<tr><td style=\"padding: 10px;\"><input type=\"checkbox\" id=\"allDayToggleButton\" onclick=\"return false;\""
            + (isAllDay ? "checked" : "") + " /></td><td id=\"allDayLabel\" style=\"padding: 10px;width: 99%;\">"
            + "All Day"
            + "</td></tr>",
            "<tr><td id=\"startDate\"  style=\"padding: 10px;\" colspan=\"2\">"
                        + startDate.toLocaleString() + "</td>",
            "<tr><td id=\"endDate\" style=\"  padding: 10px;\" colspan=\"2\">"
                        + endDate.toLocaleString() + "</td>",
            "<tr><td id=\"recurrence\" style=\"padding: 10px;\" colspan=\"2\">Recurrence: "
                        + recurrence + "</td>",
            ((data["options"] && data["options"]["recurrenceEndTime"] && data["options"]["recurrence"]) ? "<tr><td id=\"recurrenceEndDate\" style=\"padding: 10px;\" colspan=\"2\">Until: "
                        + recurrenceEndDate.toDateString() + "</td>"
                        : ""),
            "<tr><td id=\"location\" style=\"padding: 10px;\" colspan=\"2\">Location: "
                        + eventLocation + "</td>",
            "<tr><td id=\"eventNotes\" style=\"padding: 10px;\" colspan=\"2\">"
                        + (data["notes"] ? data["notes"] : "<i style=\"color:#C0C0C0;\">Insert the notes</i>") + "</td>", "</table>" ].join("\n");

        var saveEventTemplate = [
                "<section id=\"wr-calendar-emulator\" style=\"display:none; background: rgba(0, 0, 0, 0); position: absolute; width: 100%; height: 100%; z-index: 10000;\">",
                "<div style=\"background: #fff; height: 100%; width: 100%; overflow: auto;\">",
            "<div id=\"wr-contacts-title\" style=\"background: #000;  color: #fff; text-align: center; font-weight: bold; line-height: 44px;position: absolute;top: 0;left: 0;right: 0;padding: 0 10px;\">",
                headerTable, "</div>", eventTable, "</div>", "</section>" ].join("\n");

        var saveEvent = $(saveEventTemplate);

        $('#overlay-views').append(saveEvent);
        return saveEvent
    }

    return {
        Calendar: {
            hasReadPermission: function() {
                console.log("hasReadPermission");
            },
            requestReadPermission: function() {
                console.log("requestReadPermission");
            },
            hasWritePermission: function() {
              console.log("hasWritePermission");
            },
            requestWritePermission: function() {
                console.log("requestWritePermission");
            },
            hasReadWritePermission: function() {
                console.log("hasReadWritePermission");
            },
            requestReadWritePermission: function() {
                console.log("requestReadWritePermission");
            },
            createCalendar: function(options) {
                console.log("createCalendar", options);
            },
            deleteCalendar: function(options) {
                console.log("deleteCalendar", options);
            },
            openCalendar: function(options) {
                var date = options["date"];
                console.log("closeCalendar", date);
                calendar = initOpenCalendar(date);
                var p = new Promise(
                        function(resolve, reject) {
                            calendar.show('slide', {
                                direction: 'down',
                                duration: 250
                            });
                            var closeCalendar = function(e) {
                                if (calendar.is(":visible")) {
                                    calendar.hide('slide', {
                                        direction: 'down',
                                        duration: 250
                                    });
                                    closeCalendarButton.remove();
                                    backButton.css("display", "");
                                    resolve();
                                }
                            };
                            var backButton = $('#platform-events-fire-back');
                            var closeCalendarButton = $("<button id=\"closeCalendar\" class=\"ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only\"><span class=\"ui-button-text\">Back</span></button>");
                            closeCalendarButton.width("90px");
                            closeCalendarButton.click(closeCalendar);
                            $('#wr-calendar-emulator #cancel').click(closeCalendar);
                            backButton.css("display", "none");
                            $('#platform-events-fire-suspend').before(closeCalendarButton);
                        });
                return p;
            },
            createEventWithOptions: function(data) {
                console.log("createEventWithOptions", data);
            },
            createEventInteractively: function(data) {
                console.log("createEventInteractively", data);
                calendar = initSaveEvent(data);
                var p = new Promise(
                        function(resolve, reject) {
                            calendar.show('slide', {
                                direction: 'down',
                                duration: 250
                            });
                            var backButton = $('#platform-events-fire-back');
                            var closeCalendarButton = $("<button id=\"closeCalendar\" class=\"ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only\"><span class=\"ui-button-text\">Back</span></button>");
                            closeCalendarButton.width("90px");
                            closeCalendarButton.click(function(e) {
                                if (calendar.is(":visible")) {
                                    calendar.hide('slide', {
                                        direction: 'down',
                                        duration: 250
                                    });
                                    closeCalendarButton.remove();
                                    backButton.css("display", "");
                                    resolve();
                                }
                            });
                            $('#wr-calendar-emulator #done').click(function(e) {
                                if (calendar.is(":visible")) {
                                    calendar.hide('slide', {
                                        direction: 'down',
                                        duration: 250
                                    });
                                    closeCalendarButton.remove();
                                    backButton.css("display", "");
                                    resolve();
                                }
                            });

                            $('#wr-calendar-emulator #cancel').click(function(e) {
                                if (calendar.is(":visible")) {
                                    calendar.hide('slide', {
                                        direction: 'down',
                                        duration: 250
                                    });
                                    closeCalendarButton.remove();
                                    backButton.css("display", "");
                                    resolve();
                                }
                            });
                            backButton.css("display", "none");
                            $('#platform-events-fire-suspend').before(closeCalendarButton);
                        });
                return p;
            },
            findEventWithOptions: function(data) {
                console.log("findEventWithOptions", data);
            },
            findAllEventsInNamedCalendar: function(data) {
                console.log("findAllEventsInNamedCalendar", data);
            },
            deleteEvent: function(data) {
                console.log("deleteEvent", data);
            },
            deleteEventFromNamedCalendar: function(data) {
                console.log("deleteEventFromNamedCalendar", data);
            },
            modifyEventWithOptions: function(calendarName) {
                console.log("modifyEventWithOptions", calendarName);
            },
            listEventsInRange: function(range) {
                console.log("listEventsInRange", range);
            },
            listCalendars: function() {
                console.log("listCalendars");
            }
        }
    };
};