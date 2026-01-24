using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
	public class OtpInfo
	{
		public string Otp { get; set; } = null!;
		public DateTime ExpiryTime { get; set; }
	}
}
