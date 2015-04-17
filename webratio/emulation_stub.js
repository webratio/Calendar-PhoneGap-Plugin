function createStubs() {
    var calendar = null;
    var isHidden = true;
    var $ = window.top.jQuery;

    function initOpenCalendar(date) {
        var calendarTable = "<table border=\"0\" style=\"width:100%;border-collapse: collapse;\">";
        for (var i = 0; i < 24; i++) {
            var hour;
            if (i <= 12) {
                hour = i + ".00 AM";
            } else {
                hour = i - 12 + ".00 PM";
            }
            if (i === 10) {
                calendarTable += "<tr><td width=\"25%\" height=\"40px\">" + hour + "</td>";
                calendarTable += "<td rowspan=\"3\" height=\"40px\"><div style=\"border: 2px solid #3498db; padding: 10px 40px; background: #3498DB;height:100%; width: 60%; border-radius: 25px; color: #fff; font-size:150%\"><p align=\"center\">Meeting</p></div></td>";
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
        var dateToShow = new Date(date.date)
        var openCalendarTemplate = [
                "<section id=\"wr-calendar-emulator\" style=\"display:none; background: rgba(0, 0, 0, 0); position: absolute; width: 100%; height: 100%; z-index: 10000;\">",
                "<div style=\"background: #fff; height: 100%; width: 100%; overflow: auto;\">",
                "<div id=\"wr-calendar-title\" style=\"background: #3498db; font-size: 2em; color: #fff; text-align: center; font-weight: bold; line-height: 2em;\">"
                        + dateToShow.toDateString() + "</div>", calendarTable, "</div>", "</section>" ].join("\n");

        var opCalendar = $(openCalendarTemplate);
        $('#overlay-views').append(opCalendar);
        return opCalendar;
    }

    function initSaveEvent(data) {
        $('#wr-calendar-emulator').remove();
        var startDate = new Date();
        var endDate = new Date();
        if (data.startTime) {
            startDate = new Date(data.startTime);
        }
        if (data.endTime) {
            endDate = new Date(data.endTime);
        }
        var recurrence = data.recurrence;
        if (!recurrence) {
            recurrence = "none";
        }
        var recurrenceEndDate;
        if (data.recurrenceEndTime) {
            recurrenceEndDate = new Date(data.recurrenceEndTime);
        }
        var headerTable = "<table style=\"width:100%; border-collapse:collapse;\"><tr><td id=\"cancel\" style=\"width:20%;font-size:60%; cursor:pointer;\">Cancel</td><td style=\"width:60%;\">New Event</td><td id=\"done\" style=\"width:20%; font-size:60%; cursor:pointer;\">Save</td><tr></table>";
        var eventTable = [
                "<table border=\"0\" style=\"width:100%;border-collapse: collapse;\">",
                "<tr><td id=\"eventTitle\" style=\"padding-bottom:5%; padding-top:5%; font-size:120%;\" colspan=\"2\">"
                        + (data.title ? data.title : "<i style=\"color:#C0C0C0;\">Insert the title</i>") + "</td></tr>",
                "<tr><td id=\"allDayLabel\" style=\"padding-right:10%;padding-bottom:5%; padding-top:5%; border-right:none; font-size:120%;\" align=\"right\">"
                        + "All Day"
                        + "</td style=\"border-left:none;\"><td style=\"border-left:none\"><input type=\"checkbox\" id=\"allDayToggleButton\" onclick=\"return false;\""
                        + (data.allDay === "true" ? "checked" : "") + " /></td></tr>",
                "<tr><td id=\"startDate\" align=\"right\" style=\"padding-right:20%; padding-bottom:5%; padding-top:5%; font-size:120%;\" colspan=\"2\">"
                        + startDate.toLocaleString() + "</td>",
                "<tr><td id=\"endDate\" align=\"right\" style=\"padding-right:20%; padding-bottom:5%; padding-top:5%; font-size:120%;\" colspan=\"2\">"
                        + endDate.toLocaleString() + "</td>",
                "<tr><td id=\"recurrence\" align=\"right\" style=\"padding-right:20%; padding-bottom:5%; padding-top:5%; font-size:120%;\" colspan=\"2\">Recurrence: "
                        + recurrence + "</td>",
                ((data.recurrenceEndTime && data.recurrence) ? "<tr><td id=\"recurrenceEndDate\" align=\"right\" style=\"padding-right:20%; padding-bottom:5%; padding-top:5%; font-size:120%;\" colspan=\"2\">Until: "
                        + recurrenceEndDate.toDateString() + "</td>"
                        : ""),
                "<tr><td id=\"eventNotes\" style=\"padding-bottom:5%; padding-top:5%; font-size:120%;\" colspan=\"2\">"
                        + (data.notes ? data.notes : "<i style=\"color:#C0C0C0;\">Insert the notes</i>") + "</td>", "</table>" ].join("\n");

        var saveEventTemplate = [
                "<section id=\"wr-calendar-emulator\" style=\"display:none; background: rgba(0, 0, 0, 0); position: absolute; width: 100%; height: 100%; z-index: 10000;\">",
                "<div style=\"background: #fff; height: 100%; width: 100%; overflow: auto;\">",
                "<div id=\"wr-contacts-title\" style=\"background: #3498db; font-size: 2em; color: #fff; text-align: center; font-weight: bold; line-height: 2em;\">",
                headerTable, "</div>", eventTable, "</div>", "</section>" ].join("\n");

        var saveEvent = $(saveEventTemplate);

        $('#overlay-views').append(saveEvent);
        return saveEvent
    }

    return {
        Calendar: {
            createCalendar: function(mergedOptions) {
                console.log("createCalendar", mergedOptions);
            },
            deleteCalendar: function(calendarName) {
                console.log("deleteCalendar", calendarName);
            },
            openCalendar: function(date) {
                console.log("closeCalendar", date);
                calendar = initOpenCalendar(date);
                var p = new Promise(
                        function(resolve, reject) {
                            calendar.show('slide', {
                                direction: 'right',
                                duration: 250
                            });
                            var backButton = $('#platform-events-fire-back');
                            var closeCalendarButton = $("<button id=\"closeCalendar\" class=\"ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only\"><span class=\"ui-button-text\">Back</span></button>");   closeCalendarButton.width("90px");
                            closeCalendarButton.click(function(e) {
                                if (calendar.is(":visible")) {
                                    calendar.hide('slide', {
                                        direction: 'right',
                                        duration: 250
                                    });
                                    closeCalendarButton.remove();
                                    backButton.css("display", "initial");
                                    resolve();
                                }
                            });
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
                                direction: 'right',
                                duration: 250
                            });
                            var backButton = $('#platform-events-fire-back');
                            var closeCalendarButton = $("<button id=\"closeCalendar\" class=\"ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only\"><span class=\"ui-button-text\">Back</span></button>");
                            closeCalendarButton.width("90px");
                            closeCalendarButton.click(function(e) {
                                if (calendar.is(":visible")) {
                                    calendar.hide('slide', {
                                        direction: 'right',
                                        duration: 250
                                    });
                                    closeCalendarButton.remove();
                                    backButton.css("display", "initial");
                                    resolve();
                                }
                            });
                            $('#done').click(function(e) {
                                if (calendar.is(":visible")) {
                                    calendar.hide('slide', {
                                        direction: 'right',
                                        duration: 250
                                    });
                                    closeCalendarButton.remove();
                                    backButton.css("display", "initial");
                                    resolve();
                                }
                            });

                            $('#cancel').click(function(e) {
                                if (calendar.is(":visible")) {
                                    calendar.hide('slide', {
                                        direction: 'right',
                                        duration: 250
                                    });
                                    closeCalendarButton.remove();
                                    backButton.css("display", "initial");
                                    resolve();
                                }
                            });
							backButton.css("display", "none");
                            $('#platform-events-fire-suspend').before(closeCalendarButton);
                        });
            },
            createEventInNamedCalendar: function(data) {
                console.log("createEventInNamedCalendar", data);
            },
            deleteEvent: function(data) {
                console.log("deleteEvent", data);
            },
            deleteEventFromNamedCalendar: function(data) {
                console.log("deleteEventFromNamedCalendar", data);
            },
            findEvent: function(data) {
                console.log("findEvent", data);
            },
            findAllEventsInNamedCalendar: function(calendarName) {
                console.log("findAllEventsInNamedCalendar", calendarName);
            },
            modifyEvent: function(data) {
                console.log("modifyEvent", data);
            },
            modifyEventInNamedCalendar: function(data) {
                console.log("modifyEventInNamedCalendar", data);
            },
            listEventsInRange: function(data) {
                console.log("listEventsInRange", data);
            },
            listCalendars: function(data) {
                console.log("listCalendars", data);
            }
        }
    };
};