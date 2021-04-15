using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EmailSender.API.Models
{
    public class EmailSenderConfiguration : IEmailSenderConfiguration
    {
        public string SendGridApiKey { get; set; }

        public string FromAddress { get; set; }

        public string FromUser { get; set; }

    }
}
