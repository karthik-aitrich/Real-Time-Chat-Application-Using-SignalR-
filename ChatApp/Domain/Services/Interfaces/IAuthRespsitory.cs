using Domain.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Interfaces
{
	public interface IAuthRespsitory
	{
		Task<bool> verify(string email, string enteredOtp);
		OtpInfo? GetOtp(string email);

		Task SaveOtp(string email, OtpInfo otpInfo);
	}
}
