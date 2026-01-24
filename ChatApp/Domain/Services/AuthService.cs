using Domain.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
	public class AuthService:IAuthService
	{
		private readonly IAuthRespsitory _authRespsitory;
		public AuthService(IAuthRespsitory authRespsitory)
		{

			_authRespsitory = authRespsitory;
			
		}
		public async Task<bool> verifyOtp(string email, string enteredOtp)
		{
			var valid = await _authRespsitory.verify( email,enteredOtp);
			return valid;
		}
	}
}
