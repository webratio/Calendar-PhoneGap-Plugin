using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Runtime.Serialization;
using System.Windows;
using Newtonsoft.Json;
using Microsoft.Phone.Tasks;


namespace WPCordovaClassLib.Cordova.Commands
{
    public class CalendarPlugin : BaseCommand
    {
     
        private CalendarEvent calendarEvent;
        private CalendarOptions calendarOptions;

        public void createEventInteractively(string options)
        {
            if (!TryDeserializeOptions(options, out this.calendarEvent))
            {
                this.DispatchCommandResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION));
                return;
            }
            SaveAppointmentTask saveAppointmentTask = new SaveAppointmentTask();
            var posixTime = DateTime.SpecifyKind(new DateTime(1970, 1, 1), DateTimeKind.Utc);
            saveAppointmentTask.StartTime = posixTime.AddMilliseconds(this.calendarEvent.StartTime);
            if (this.calendarEvent.EndTime != null) {
                saveAppointmentTask.EndTime = posixTime.AddMilliseconds((long) this.calendarEvent.EndTime);
            }
            saveAppointmentTask.Subject = this.calendarEvent.Title;
            saveAppointmentTask.Location = this.calendarEvent.Location;
            saveAppointmentTask.Details = this.calendarEvent.Notes;
            saveAppointmentTask.IsAllDayEvent = IsAllDayEvent(saveAppointmentTask.StartTime, saveAppointmentTask.EndTime);
            saveAppointmentTask.Reminder = GetReminder(this.calendarEvent.Options.FirstReminderMinutes);
            saveAppointmentTask.AppointmentStatus = Microsoft.Phone.UserData.AppointmentStatus.Busy;
            saveAppointmentTask.Show();
            this.DispatchCommandResult(new PluginResult(PluginResult.Status.OK));
        }

        private bool IsAllDayEvent(DateTime? startDate, DateTime? endDate)
        {
            if (startDate.HasValue && endDate.HasValue)
            {
                DateTime localStart = startDate.Value.ToLocalTime();
                DateTime localEnd = endDate.Value.ToLocalTime();
                return ((localEnd.Ticks - localStart.Ticks) % (24L * 60 * 60 * 10000000) == 0)
                    && localStart.Hour == 0 && localStart.Minute == 0 && localStart.Second == 0
                    && localEnd.Hour == 0 && localEnd.Minute == 0 && localEnd.Second == 0;
            }
            return false;
        }

        public void openCalendar(string options)
        {
            if (!TryDeserializeOptions(options, out this.calendarOptions))
            {
                this.DispatchCommandResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION));
                return;
            }
            // TODO open calendar
            this.DispatchCommandResult(new PluginResult(PluginResult.Status.OK));
        }

        static bool TryDeserializeOptions<T>(string options, out T result) where T : class
        {
            result = null;
            try
            {
                var args = JsonConvert.DeserializeObject<string[]>(options);
                result = JsonConvert.DeserializeObject<T>(args[0]);
                return true;
            }
            catch (Exception e)
            {
                Debug.WriteLine("ERROR: Exception deserializing options " + e.Message);
                return false;
            }
        }

        static Reminder GetReminder(int? minutes) {
            if (minutes != null) {
                if (minutes >= 600 * 24 * 7)
                {
                    return Reminder.OneDay;
                }
                else if (minutes >= 600 * 24)
                {
                    return Reminder.OneDay;
                }
                else if (minutes >= 60)
                {
                    return Reminder.OneHour;
                }
                else {
                    return Reminder.ThirtyMinutes;
                }
            }
            return Reminder.OneHour;
        }


        [DataContract]
        public class CalendarEvent
        {
            [DataMember(Name = "title", IsRequired = true)]
            public string Title { get; set; }
            
            [DataMember(Name = "location", IsRequired = false)]
            public string Location { get; set; }
            
            [DataMember(Name = "notes", IsRequired = false)]
            public string Notes { get; set; }
            
            [DataMember(Name = "startTime", IsRequired = true)]
            public long StartTime { get; set; }
            
            [DataMember(Name = "endTime", IsRequired = false)]
            public long? EndTime { get; set; }

            [DataMember(Name = "allDay", IsRequired = false)]
            public bool AllDay { get; set; }

            [DataMember(Name = "options", IsRequired = false)]
            public EventOptions Options { get; set; }
        }

        [DataContract]
        public class EventOptions
        {
            [DataMember(Name = "firstReminderMinutes", IsRequired = true)]
            public int? FirstReminderMinutes { get; set; }
        }

        [DataContract]
        public class CalendarOptions
        {
            [DataMember(Name = "date", IsRequired = false)]
            public long? Time { get; set; }            
        }

    }
}