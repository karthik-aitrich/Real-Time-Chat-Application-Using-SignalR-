using Domain.DTOs;
using Domain.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
	public class AuthRepository:IAuthRespsitory
	{
		private static Dictionary<string, OtpInfo> _otpStore = new();
		public async Task<bool> verify(string email, string enteredOtp)
		{
			if (!_otpStore.ContainsKey(email))
			{
				return false;
			}
			else
			{
				var otpInfo = _otpStore[email];

				if (DateTime.UtcNow > otpInfo.ExpiryTime)
				{
					_otpStore.Remove(email);
					return false;
				}

				if (otpInfo.Otp == enteredOtp)
				{
					_otpStore.Remove(email);
					return true;

				}
			
				

			return false;
		}
		}
		public async Task SaveOtp(string email, OtpInfo otpInfo)
		{
			_otpStore[email] = otpInfo;
		}
		public OtpInfo? GetOtp(string email)
		{
			_otpStore.TryGetValue(email, out var otpInfo);
			return otpInfo;

		}
		

	}
}
