using EmailSender.API.Models;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace EmailSender.API.Services
{
    public class EmailSenderService
    {
        private readonly ILogger _logger;
        private readonly IEmailSenderConfiguration _emailConfig;

        public EmailSenderService(ILogger logger, IEmailSenderConfiguration emailSenderConfiguration)
        {
            _logger = logger;
            _emailConfig = emailSenderConfiguration;
        }

        public async Task<System.Net.HttpStatusCode> SendEmail(EmailSendRequest request)
        {
            try
            {
                var apiKey = _emailConfig.SendGridApiKey;
                var client = new SendGridClient(apiKey);
                var from = new EmailAddress(_emailConfig.FromAddress, _emailConfig.FromUser);
                var subject = request.Subject;
                var to = new EmailAddress(request.Recipient);
                var htmlContent = request.Content;
                var msg = MailHelper.CreateSingleEmail(from, to, subject, null, htmlContent);
                var response = await client.SendEmailAsync(msg);
                return response.StatusCode;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Exception {ex.Message} encountered when trying to send email", ex.Message);
                return System.Net.HttpStatusCode.InternalServerError;
            }
        }

    }
}
