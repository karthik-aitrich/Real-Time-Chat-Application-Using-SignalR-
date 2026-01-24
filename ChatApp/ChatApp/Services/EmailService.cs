using Domain.DTOs;
using Domain.Services.Interfaces;
using MimeKit;

using MailKit.Net.Smtp;
namespace ChatApp.Services
{
	public class EmailService:IEmailService
	{
		private readonly IConfiguration _config;
		private readonly IAuthRespsitory _authrepository;
		public EmailService(IConfiguration config,IAuthRespsitory authRespsitory)
		{
			_config = config;
			_authrepository = authRespsitory;
		}
		private OtpInfo GenerateOtp()
		{
			var random = new Random();
			return new OtpInfo
			{
				Otp = random.Next(100000, 999999).ToString(),
				ExpiryTime = DateTime.UtcNow.AddMinutes(5)
			};
		}
		public async Task SendEmailAsync(string email)
		{
			try
			{


				var settings = _config.GetSection("MailSettings");
				var otpInfo = GenerateOtp();
				await _authrepository.SaveOtp(email, otpInfo);
			
				var msg = new MimeMessage();
				msg.From.Add(MailboxAddress.Parse(settings["From"]));
				msg.To.Add(MailboxAddress.Parse(email));
				msg.Subject = "user@example.com";
				msg.Body = new BodyBuilder {
					HtmlBody = $@"
                <h3>Email Verification</h3>
                <p>Your OTP for account verification is:</p>
                <h2 style='color:blue'>{otpInfo.Otp}</h2>
                <p>This OTP is valid for a short time.</p>
                <br/>
                <p>Thank you,<br/>
                <strong>Support Team</strong></p>
            "
				}.ToMessageBody(); 

				using var smtp = new SmtpClient();

				await smtp.ConnectAsync(
					settings["Host"],
					int.Parse(settings["Port"]),
					MailKit.Security.SecureSocketOptions.StartTls
				);

				await smtp.AuthenticateAsync(
					settings["Username"],
					settings["Password"]
				);

				await smtp.SendAsync(msg);
				await smtp.DisconnectAsync(true);
			}
			catch (Exception ex)
			{
				throw ex;
			}
		}
	}
}
