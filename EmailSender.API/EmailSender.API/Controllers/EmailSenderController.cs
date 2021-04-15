using EmailSender.API.Models;
using EmailSender.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EmailSender.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmailSenderController : ControllerBase
    {
        private readonly ILogger<EmailSenderController> _logger;
        private readonly EmailSenderService _emailSender;

        public EmailSenderController(ILogger<EmailSenderController> logger, EmailSenderService emailSender)
        {
            
            _logger = logger;
            _emailSender = emailSender;
        }

        [HttpPost("SendEmail")]
        public async Task<IActionResult> SendEmail(EmailSendRequest emailRequest)
        {
            var responseCode = await _emailSender.SendEmail(emailRequest);
            return responseCode == System.Net.HttpStatusCode.Accepted ? Ok() : StatusCode(int.Parse(responseCode.ToString()));
        }
    }
}
